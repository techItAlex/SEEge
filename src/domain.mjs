const number = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const millis = (value, fallback = 0) => value?.toMillis ? value.toMillis() : value?.toDate ? value.toDate().getTime() : number(value, fallback);

export function shouldRetrySessionCheck(status) {
  return ['consent_required', 'no_session', 'teacher', 'not_rostered', 'signed_out'].includes(status);
}

export function isValidActualEnd(scheduledStart, actualEnd, now = Date.now()) {
  const start = millis(scheduledStart, NaN);
  const end = millis(actualEnd, NaN);
  return Number.isFinite(start) && Number.isFinite(end) && end >= start && end <= now;
}

export function getClassWindow(session, now = Date.now()) {
  const start = millis(session.scheduledStart);
  const scheduledEnd = millis(session.scheduledEnd);
  const actualEnd = session.actualEnd == null ? null : millis(session.actualEnd);
  const end = Math.min(scheduledEnd, actualEnd ?? scheduledEnd);
  return { start, end: Math.max(start, Math.min(end, now)) };
}

function classIntervals(session, window) {
  const configured = Array.isArray(session.meetIntervals) ? session.meetIntervals : [];
  if (!configured.length) return [{ start: window.start, end: window.end }];
  return configured.map(interval => ({
    start: Math.max(window.start, millis(interval.start)),
    end: Math.min(window.end, interval.end == null ? window.end : millis(interval.end)),
  })).filter(interval => interval.end > interval.start);
}

export function deriveStudentMetrics(student, session, rosterEntry = {}, now = Date.now()) {
  const window = getClassWindow(session, now);
  const rawVisits = Array.isArray(student?.visits) ? student.visits : [];
  const visitsByJoin = new Map();
  for (const visit of rawVisits) {
    const join = millis(visit.join);
    const existing = visitsByJoin.get(join);
    if (!existing || (existing.leave != null && visit.leave == null) || millis(visit.leave) > millis(existing.leave)) visitsByJoin.set(join, visit);
  }
  const visits = [...visitsByJoin.values()].sort((a, b) => millis(a.join) - millis(b.join));
  const lastHeartbeat = millis(student?.lastHeartbeat);
  const intervals = classIntervals(session, window);
  const cutoff = Math.max(window.start, Math.min(window.end, now));
  const timeline = [];
  for (const visit of visits) {
    const join = Math.max(window.start, millis(visit.join));
    const rawLeave = visit.leave == null
      ? Math.min(lastHeartbeat ? (lastHeartbeat + 90_000 > cutoff ? cutoff : lastHeartbeat + 90_000) : join, cutoff)
      : millis(visit.leave);
    const leave = Math.min(window.end, cutoff, Math.max(join, rawLeave));
    for (const interval of intervals) {
      const segmentStart = Math.max(join, interval.start);
      const segmentEnd = Math.min(leave, interval.end);
      if (segmentEnd > segmentStart) timeline.push({ join: segmentStart, leave: segmentEnd });
    }
  }
  timeline.sort((a, b) => a.join - b.join);
  const mergedTimeline = [];
  for (const segment of timeline) {
    const prior = mergedTimeline.at(-1);
    if (prior && segment.join <= prior.leave) prior.leave = Math.max(prior.leave, segment.leave);
    else mergedTimeline.push({ ...segment });
  }
  const attendedMs = mergedTimeline.reduce((total, segment) => total + segment.leave - segment.join, 0);
  const rejoinCount = Math.max(0, mergedTimeline.length - 1);
  const classMs = intervals.reduce((total, interval) => total + interval.end - interval.start, 0);
  const attendedSeconds = Math.round(attendedMs / 1000);
  const percentage = classMs ? Math.min(100, attendedMs / classMs * 100) : 0;
  const thresholds = session.thresholds ?? {};
  const presentPct = number(thresholds.presentPct, 75);
  const lateMinutes = number(thresholds.lateMinutes, 10);
  const joinedAt = visits.length ? Math.min(...visits.map(v => millis(v.join, Infinity))) : null;
  const upcoming = now < window.start;
  const noExtension = !student && !upcoming;
  const status = upcoming ? ['Upcoming'] : noExtension || !attendedMs ? ['Absent'] : [percentage >= presentPct ? 'Present' : 'Partial'];
  if (joinedAt != null && joinedAt > number(session.scheduledStart?.toMillis?.() ?? session.scheduledStart) + lateMinutes * 60_000) status.push('Late');
  const availability = student?.signalAvailability;
  const participationAvailable = !!availability && availability.chat === true && availability.reactions === true && availability.mic === true;
  const totalAwaySeconds = number(student?.awaySeconds);
  const awayPeriods = (student?.awayPeriods ?? []).map(period => ({
    start: Math.max(window.start, millis(period.start)), end: Math.min(window.end, millis(period.end)),
  })).filter(period => period.end > period.start);
  const screenFocus = attendedSeconds ? Math.max(0, 1 - totalAwaySeconds / attendedSeconds) : 0;
  const weight = number(thresholds.participationTargetPerHour, 5);
  const interactionTarget = weight * (classMs / 3_600_000 || 1);
  const participationCount = 2 * number(student?.chatCount) + number(student?.reactionCount) + number(student?.micOpens);
  const participation = participationAvailable ? Math.min(1, participationCount / Math.max(1, interactionTarget)) : null;
  const stability = Math.max(0, 1 - Math.min(1, 0.25 * rejoinCount));
  const weights = thresholds.focusWeights ?? { screen: 0.6, participation: 0.25, stability: 0.15 };
  const score = participationAvailable
    ? (number(weights.screen, 0.6) * screenFocus + number(weights.participation, 0.25) * participation + number(weights.stability, 0.15) * stability)
    : (screenFocus * (number(weights.screen, 0.6) + number(weights.participation, 0.25)) + number(weights.stability, 0.15) * stability);
  const focus = noExtension ? null : Math.round(Math.max(0, Math.min(1, score)) * 100);
  const inMeet = !!student && (session.status ?? 'live') === 'live' && session.actualEnd == null && lastHeartbeat >= now - 90_000 && visits.some(v => v.leave == null);
  return {
    email: student?.email ?? rosterEntry.email ?? '', name: student?.name ?? rosterEntry.name ?? rosterEntry.email ?? 'Unknown student',
    noExtension, inMeet, visits: mergedTimeline, awayPeriods,
    currentlyAway: inMeet && !!student?.currentlyAway,
    joinedAt, leftAt: inMeet ? null : mergedTimeline.length ? mergedTimeline[mergedTimeline.length - 1].leave : null,
    totalSeconds: attendedSeconds, attendancePct: Math.round(percentage * 10) / 10,
    rejoinCount, awayCount: number(student?.awayCount), awaySeconds: totalAwaySeconds,
    chatCount: availability?.chat !== true ? null : number(student?.chatCount),
    reactionCount: availability?.reactions !== true ? null : number(student?.reactionCount),
    micOpens: availability?.mic !== true ? null : number(student?.micOpens),
    micUnmutedSeconds: availability?.mic !== true ? null : number(student?.micUnmutedSeconds),
    participationAvailable, focus, focusLabel: focus == null ? 'Unavailable' : focus >= 80 ? 'Focused' : focus >= 50 ? 'Moderate' : 'Low', status,
    signalAvailability: { chat: availability?.chat === true, reactions: availability?.reactions === true, mic: availability?.mic === true },
  };
}

export function summarizeSession(session, roster, students, now = Date.now()) {
  const studentMap = students instanceof Map ? students : new Map(Object.entries(students ?? {}));
  const rows = [...roster].map(entry => {
    const key = String(entry.email).toLowerCase();
    return deriveStudentMetrics(studentMap.get(key) ?? studentMap.get(entry.email), session, entry, now);
  });
  const count = key => rows.filter(row => row.status.includes(key)).length;
  const scores = rows.map(row => row.focus).filter(value => value != null);
  return { rows, present: count('Present'), late: count('Late'), partial: count('Partial'), absent: count('Absent'), currentlyInMeet: rows.filter(row => row.inMeet).length, averageFocus: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null };
}

export function csvEscape(value) {
  let text = value == null ? '' : String(value);
  if (/^[\s\u0000-\u001f]*[=+@-]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function makeCsv(headers, rows) {
  return [headers, ...rows].map(row => row.map(csvEscape).join(',')).join('\r\n');
}

export function parseRosterCsv(text) {
  text = String(text).replace(/^\uFEFF/, '');
  const records = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted && ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === ',' && !quoted) { row.push(cell.trim()); cell = ''; }
    else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell.trim()); if (row.some(Boolean)) records.push(row); row = []; cell = '';
    } else cell += ch;
  }
  if (cell || row.length) { row.push(cell.trim()); records.push(row); }
  if (quoted) throw new Error('Roster CSV has an unclosed quotation mark.');
  if (records.length && /^(name|student.?name)$/i.test(records[0][0]) && /^(e-?mail|student.?e-?mail)$/i.test(records[0][1] ?? '')) records.shift();
  const byEmail = new Map();
  for (const [name, email] of records) {
    const key = String(email ?? '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) throw new Error(`Invalid roster email: ${key || 'blank'}`);
    const cleanName = String(name ?? '').trim().slice(0, 100);
    if (!cleanName) throw new Error(`Missing name for ${key}`);
    byEmail.set(key, { email: key, name: cleanName });
  }
  return [...byEmail.values()];
}
