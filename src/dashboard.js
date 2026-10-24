import { app, auth } from "./firebase.js";
import {
  getFirestore, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  collection, query, where, onSnapshot, Timestamp, writeBatch,
} from "firebase/firestore";
import { summarizeSession, makeCsv, parseRosterCsv, isValidActualEnd } from "./domain.mjs";

const db = getFirestore(app);
const $ = id => document.getElementById(id);
const state = { email: null, sessions: [], selected: null, roster: [], students: new Map(), metrics: null, stops: [], sessionStop: null, timer: null, sort: { key: "name", direction: 1 } };
const day = 86_400_000;

function showMessage(message, isError = false) {
  $("message").textContent = message;
  $("message").classList.toggle("bad", isError);
  $("message").classList.remove("hidden");
}
function hideMessage() { $("message").classList.add("hidden"); }
function toInputTime(timestamp) {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}
function parseInputTime(value) { const date = new Date(value); if (!value || Number.isNaN(date.getTime())) throw new Error("Enter valid start and end times."); return Timestamp.fromDate(date); }
function formatTime(ms) { return ms == null ? "—" : new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); }
function duration(seconds) { if (seconds == null) return "Unavailable"; const m = Math.round(seconds / 60); return `${Math.floor(m / 60)}h ${m % 60}m`; }
function safeText(value) { return String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]); }

async function cleanupExpiredSessions(sessions) {
  const cutoff = Date.now() - 90 * day;
  for (const item of sessions) {
    const end = item.actualEnd?.toMillis?.() ?? item.scheduledEnd?.toMillis?.() ?? 0;
    if (item.status === "live" || end > cutoff) continue;
    for (const sub of ["roster", "students", "deletionRequests"]) {
      const docs = await getDocs(collection(db, "sessions", item.id, sub));
      for (let i = 0; i < docs.docs.length; i += 450) {
        const batch = writeBatch(db);
        docs.docs.slice(i, i + 450).forEach(entry => batch.delete(entry.ref));
        await batch.commit();
      }
    }
    for (const code of item.meetCodes ?? []) {
      const indexRef = doc(db, "meetSessions", code); const index = await getDoc(indexRef);
      if (index.exists() && index.data().sessionId === item.id) await deleteDoc(indexRef);
    }
    await deleteDoc(doc(db, "sessions", item.id));
  }
}

function renderSessions() {
  const box = $("sessions"); box.replaceChildren();
  if (!state.sessions.length) { box.textContent = "No sessions yet."; return; }
  for (const session of state.sessions) {
    const button = document.createElement("button");
    button.className = `secondary${session.id === state.selected ? " session-selected" : ""}`;
    button.textContent = `${session.className} · ${session.status} · ${session.scheduledStart?.toDate?.().toLocaleString?.() ?? ""}`;
    button.addEventListener("click", () => selectSession(session.id));
    box.append(button);
  }
}

async function loadSessions() {
  const snapshot = await getDocs(query(collection(db, "sessions"), where("teacherEmail", "==", state.email)));
  state.sessions = snapshot.docs.map(item => ({ id: item.id, ...item.data() })).sort((a, b) => b.scheduledStart.toMillis() - a.scheduledStart.toMillis());
  await cleanupExpiredSessions(state.sessions);
  renderSessions();
  if (state.selected && !state.sessions.some(item => item.id === state.selected)) state.selected = null;
}

async function createSession(event) {
  event.preventDefault();
  const output = $("create-result"); output.textContent = "Creating…";
  try {
    if (!$('informed').checked) throw new Error("Confirm that your class has been informed first.");
    const start = parseInputTime($("scheduled-start").value);
    const end = parseInputTime($("scheduled-end").value);
    if (end.toMillis() <= start.toMillis()) throw new Error("Scheduled end must be later than scheduled start.");
    const rawCodes = $("meet-codes").value.toLowerCase().split(",").map(value => value.trim()).filter(Boolean);
    if (!rawCodes.length || rawCodes.some(code => !/^[a-z]{3}-[a-z]{4}-[a-z]{3}$/.test(code))) throw new Error("Enter valid Meet codes, separated by commas (for example abc-defg-hij).");
    const codes = [...new Set(rawCodes)];
    let rosterText = $("roster-text").value;
    if ($("roster-file").files[0]) rosterText = await $("roster-file").files[0].text();
    const roster = rosterText.trim() ? parseRosterCsv(rosterText) : [];
    if (!roster.length) throw new Error("Add at least one roster entry before creating the session.");
    const focusWeights = { screen: Number($("focus-screen").value), participation: Number($("focus-participation").value), stability: Number($("focus-stability").value) };
    if (Object.values(focusWeights).some(value => !Number.isFinite(value) || value < 0) || Object.values(focusWeights).reduce((a, b) => a + b, 0) !== 100) throw new Error("Focus weights must be non-negative and add up to 100%.");
    const now = Date.now();
    const status = now >= end.toMillis() ? "ended" : now >= start.toMillis() ? "live" : "scheduled";
    const actualEnd = status === "ended" ? end : null;
    const ref = doc(collection(db, "sessions"));
    const sessionData = {
      className: $("class-name").value.trim(), meetCodes: codes, scheduledStart: start, scheduledEnd: end,
      actualEnd, meetIntervals: [], teacherEmail: state.email, status,
      thresholds: { presentPct: Number($("present-percent").value), lateMinutes: Number($("late-minutes").value), participationTargetPerHour: Number($("participation-target").value), focusWeights: { screen: focusWeights.screen / 100, participation: focusWeights.participation / 100, stability: focusWeights.stability / 100 } },
      retentionDays: 90, classInformedAt: Timestamp.now(), createdAt: Timestamp.now(),
    };
    const createBatch = writeBatch(db);
    createBatch.set(ref, sessionData);
    for (const code of codes) createBatch.set(doc(db, "meetSessions", code), { meetCode: code, sessionId: ref.id, teacherEmail: state.email, status, actualEnd });
    await createBatch.commit();
    for (let i = 0; i < roster.length; i += 400) {
      const batch = writeBatch(db);
      roster.slice(i, i + 400).forEach(entry => batch.set(doc(db, "sessions", ref.id, "roster", entry.email), entry));
      await batch.commit();
    }
    $("session-form").reset();
    $("late-minutes").value = 10; $("present-percent").value = 75; $("participation-target").value = 5;
    $("focus-screen").value = 60; $("focus-participation").value = 25; $("focus-stability").value = 15;
    output.textContent = `Created with ${roster.length} roster entries.`;
    await loadSessions(); await selectSession(ref.id);
  } catch (error) { output.textContent = error.message; output.classList.add("bad"); }
}

function stopSelectedListeners() { state.stops.forEach(stop => stop()); state.stops = []; if (state.sessionStop) state.sessionStop(); state.sessionStop = null; }

async function selectSession(id) {
  stopSelectedListeners();
  state.selected = id; renderSessions(); $("selected").classList.remove("hidden");
  const ref = doc(db, "sessions", id);
  state.sessionStop = onSnapshot(ref, snapshot => {
    if (!snapshot.exists()) { $("selected").classList.add("hidden"); return; }
    const session = { id, ...snapshot.data() };
    const existing = state.sessions.findIndex(item => item.id === id);
    if (existing >= 0) state.sessions[existing] = session;
    renderSessions(); renderSession(session); renderMetrics();
    syncIndexes(session).catch(error => console.warn("Meet-code index sync failed:", error.message));
    const now = Date.now();
    if (session.status === "scheduled" && now >= session.scheduledStart.toMillis() && now < session.scheduledEnd.toMillis()) {
      updateDoc(ref, { status: "live", updatedAt: Timestamp.now() }).catch(error => showMessage(`Could not start session: ${error.message}`, true));
    } else if (session.status === "live" && now >= session.scheduledEnd.toMillis()) {
      updateDoc(ref, { actualEnd: session.scheduledEnd, status: "ended", updatedAt: Timestamp.now() }).catch(error => showMessage(`Could not end scheduled session: ${error.message}`, true));
    }
  }, error => showMessage(`Session listener failed: ${error.message}`, true));
  state.stops.push(onSnapshot(collection(db, "sessions", id, "roster"), snapshot => {
    state.roster = snapshot.docs.map(item => ({ email: item.id, ...item.data() })); renderMetrics();
  }, error => showMessage(`Roster could not load: ${error.message}`, true)));
  state.stops.push(onSnapshot(collection(db, "sessions", id, "students"), snapshot => {
    state.students = new Map(snapshot.docs.map(item => [item.id.toLowerCase(), { email: item.id, ...item.data() }])); renderMetrics();
  }, error => showMessage(`Student activity could not load: ${error.message}`, true)));
  state.stops.push(onSnapshot(query(collection(db, "sessions", id, "deletionRequests"), where("status", "==", "pending")), snapshot => renderDeletionRequests(snapshot.docs.map(item => ({ id: item.id, ...item.data() }))), error => { $("deletion-requests").textContent = `Could not load requests: ${error.message}`; }));
}

function renderSession(session) {
  state.currentSession = session;
  $("session-title").textContent = session.className;
  $("session-meta").textContent = `${(session.meetCodes ?? []).join(", ")} · ${session.scheduledStart.toDate().toLocaleString()} – ${session.scheduledEnd.toDate().toLocaleString()} · ${session.status}`;
  $("actual-end").value = toInputTime(session.actualEnd);
  $("end-session").disabled = session.status === "ended";
  $("end-session").textContent = session.status === "ended" ? "Class ended" : "End class now";
  const weights = session.thresholds?.focusWeights ?? { screen: 0.6, participation: 0.25, stability: 0.15 };
  $("formula").textContent = `Focus = ${Math.round(weights.screen * 100)}% × screen focus + ${Math.round(weights.participation * 100)}% × participation + ${Math.round(weights.stability * 100)}% × stability. Screen focus = 1 − away seconds ÷ time attended. Participation target: ${session.thresholds?.participationTargetPerHour ?? 5} interactions/hour. Present at ≥${session.thresholds?.presentPct ?? 75}%; late after ${session.thresholds?.lateMinutes ?? 10} minutes. Missing participation signals are shown as unavailable and their weight moves to screen focus.`;
  const unavailable = state.metrics?.rows.filter(row => !row.participationAvailable).length ?? 0;
  $("signals").textContent = unavailable ? `Participation unavailable for ${unavailable} student(s) until Meet selectors are configured.` : "Participation signal configuration is available.";
}

async function updateRoster(event) {
  event.preventDefault();
  const result = $("roster-result"); result.textContent = "Saving…";
  try {
    const file = $("roster-file-edit").files[0];
    const text = file ? await file.text() : $("roster-text-edit").value;
    const incoming = parseRosterCsv(text);
    if (!incoming.length) throw new Error("Add at least one valid name,email roster row.");
    const rosterRef = collection(db, "sessions", state.selected, "roster");
    const existing = await getDocs(rosterRef);
    const incomingIds = new Set(incoming.map(entry => entry.email));
    if ($("roster-mode").value === "replace") {
      const removed = existing.docs.filter(entry => !incomingIds.has(entry.id));
      if (removed.length && !confirm(`Remove ${removed.length} roster entry/entries and delete their session attendance data?`)) return;
      for (const entry of removed) {
        await deleteDoc(doc(db, "sessions", state.selected, "students", entry.id));
        await deleteDoc(entry.ref);
      }
    }
    for (let i = 0; i < incoming.length; i += 400) {
      const batch = writeBatch(db);
      incoming.slice(i, i + 400).forEach(entry => batch.set(doc(db, "sessions", state.selected, "roster", entry.email), entry));
      await batch.commit();
    }
    result.textContent = `Saved ${incoming.length} roster entry/entries.`;
    $("roster-text-edit").value = ""; $("roster-file-edit").value = "";
  } catch (error) { result.textContent = error.message; result.classList.add("bad"); }
}

async function loadSelectors() {
  const snapshot = await getDoc(doc(db, "config", "meetSelectors"));
  if (!snapshot.exists()) return;
  const data = snapshot.data();
  $("chat-selector").value = data.chatSendSelector ?? "";
  $("mic-selector").value = data.microphoneSelector ?? "";
  $("reaction-selectors").value = (data.reactionSelectors ?? []).join("\n");
}

async function saveSelectors(event) {
  event.preventDefault();
  const output = $("selector-result"); output.textContent = "Saving…";
  const reactions = $("reaction-selectors").value.split(/\r?\n/).map(value => value.trim()).filter(Boolean);
  const data = { chatSendSelector: $("chat-selector").value.trim(), microphoneSelector: $("mic-selector").value.trim(), reactionSelectors: reactions, updatedAt: Timestamp.now(), updatedBy: state.email };
  try {
    for (const selector of [data.chatSendSelector, data.microphoneSelector, ...reactions]) if (selector) document.querySelector(selector);
    await setDoc(doc(db, "config", "meetSelectors"), data);
    output.textContent = "Saved. New monitoring sessions will use these selectors.";
  } catch (error) { output.textContent = `Invalid selector or save failed: ${error.message}`; }
}

function renderMetrics() {
  if (!state.currentSession) return;
  state.metrics = summarizeSession(state.currentSession, state.roster, state.students, Date.now());
  renderSummary(); renderStudents(); renderCharts();
}

async function syncIndexes(session) {
  for (const code of session.meetCodes ?? []) {
    const ref = doc(db, "meetSessions", code); const snapshot = await getDoc(ref);
    if (!snapshot.exists() || snapshot.data().sessionId !== session.id || snapshot.data().status !== session.status) {
      await setDoc(ref, { meetCode: code, sessionId: session.id, teacherEmail: state.email, status: session.status, actualEnd: session.actualEnd ?? null });
    }
  }
}

function renderSummary() {
  const data = state.metrics;
  const values = [["Present", data.present], ["Late", data.late], ["Partial", data.partial], ["Absent / no SEEge activity", data.absent], ["Average focus", data.averageFocus == null ? "—" : `${data.averageFocus}%`], ["Currently in Meet", data.currentlyInMeet]];
  $("summary").replaceChildren(...values.map(([label, value]) => { const box = document.createElement("div"); box.className = "stat card"; box.innerHTML = `<span class="muted">${label}</span><b>${value}</b>`; return box; }));
}

function renderStudents() {
  const body = $("student-rows"); body.replaceChildren();
  const search = $("search").value.trim().toLowerCase(); const filter = $("status-filter").value;
  const rows = state.metrics.rows.filter(row => (!search || `${row.name} ${row.email}`.toLowerCase().includes(search)) && (filter === "all" || row.status.includes(filter)));
  const key = state.sort.key; const direction = state.sort.direction;
  rows.sort((a, b) => {
    const value = row => key === "status" ? row.status.join(" ") : row[key];
    const left = value(a), right = value(b);
    if (left == null) return right == null ? 0 : 1;
    if (right == null) return -1;
    return (typeof left === "string" ? left.localeCompare(right) : left - right) * direction;
  });
  for (const button of document.querySelectorAll(".sort")) {
    const active = button.dataset.sort === key;
    const label = button.textContent.replace(/ [↑↓↕]$/, "");
    button.textContent = `${label} ${active ? direction > 0 ? "↑" : "↓" : "↕"}`;
    button.setAttribute("aria-sort", active ? direction > 0 ? "ascending" : "descending" : "none");
  }
  for (const row of rows) {
    const tr = document.createElement("tr");
    const statuses = row.status.map(value => `<span class="badge ${value === "Present" ? "good" : value === "Late" ? "late" : value === "Absent" ? "bad" : ""}">${safeText(value)}</span>`).join("");
    const focus = row.focus == null ? "Unavailable" : `${row.focus}% <span class="focusbar"><i style="width:${row.focus}%"></i></span>`;
    const presence = row.noExtension ? '<span class="badge bad">● No activity detected</span>' : row.inMeet ? row.currentlyAway ? '<span class="badge late">● In Meet · Away</span>' : '<span class="badge good">● In Meet · Focused</span>' : '<span class="badge">● Left</span>';
    const values = [safeText(row.name), statuses, formatTime(row.joinedAt), formatTime(row.leftAt), duration(row.totalSeconds), row.rejoinCount, `${row.awayCount} / ${duration(row.awaySeconds)}`, row.chatCount == null ? "Unavailable" : row.chatCount, row.reactionCount == null ? "Unavailable" : row.reactionCount, row.micOpens == null ? "Unavailable" : row.micOpens, focus, presence, ""];
    for (let i = 0; i < values.length; i++) { const td = document.createElement("td"); td.innerHTML = values[i]; tr.append(td); }
    const button = document.createElement("button"); button.className = "secondary"; button.textContent = "Details"; button.addEventListener("click", () => showStudentDetail(row)); tr.lastChild.append(button);
    body.append(tr);
  }
}

function renderCharts() {
  const { present, late, partial, absent, rows } = state.metrics;
  const lateOnly = rows.filter(row => row.status.includes("Late") && !row.status.includes("Present")).length;
  const presentOnly = rows.filter(row => row.status.includes("Present") && !row.status.includes("Late")).length;
  const otherPartial = rows.filter(row => row.status.includes("Partial") && !row.status.includes("Late")).length;
  const lateCount = rows.filter(row => row.status.includes("Late")).length;
  const n = Math.max(rows.length, 1); const a = presentOnly / n * 360; const b = a + lateCount / n * 360; const c = b + otherPartial / n * 360;
  $("donut").style.background = `conic-gradient(var(--green) 0deg ${a}deg,var(--amber) ${a}deg ${b}deg,var(--blue) ${b}deg ${c}deg,var(--line) ${c}deg 360deg)`;
  $("donut-label").textContent = `${rows.length} rostered`;
  $("legend").textContent = `Present ${presentOnly} · Late ${lateOnly} · Partial ${otherPartial} · Absent ${absent}${lateCount !== lateOnly ? ` · Late and partial ${lateCount - lateOnly}` : ""}`;
  const bins = [0, 0, 0, 0, 0];
  for (const row of rows) if (row.focus != null) bins[Math.min(4, Math.floor(row.focus / 20))]++;
  const max = Math.max(1, ...bins); const bars = $("focus-bars"); bars.replaceChildren();
  bins.forEach((count, i) => { const div = document.createElement("div"); div.style.height = `${Math.max(4, count / max * 130)}px`; div.title = `${count} student(s)`; const small = document.createElement("small"); small.textContent = ["0–19", "20–39", "40–59", "60–79", "80–100"][i]; div.append(small); bars.append(div); });
}

function showStudentDetail(row) {
  $("detail-name").textContent = `${row.name} · ${row.email}`;
  const start = state.currentSession.scheduledStart.toMillis();
  const end = (state.currentSession.actualEnd ?? state.currentSession.scheduledEnd).toMillis();
  const width = Math.max(1, end - start);
  const track = document.createElement("div"); track.className = "timeline";
  for (const visit of row.visits) { const segment = document.createElement("i"); segment.className = "segment"; segment.style.left = `${Math.max(0, (visit.join - start) / width * 100)}%`; segment.style.width = `${Math.max(0.4, Math.min(100, (visit.leave - visit.join) / width * 100))}%`; track.append(segment); }
  for (const period of row.awayPeriods) { const segment = document.createElement("i"); segment.className = "awaysegment"; segment.style.left = `${Math.max(0, (period.start - start) / width * 100)}%`; segment.style.width = `${Math.max(0.4, Math.min(100, (period.end - period.start) / width * 100))}%`; track.append(segment); }
  const title = document.createElement("p"); title.textContent = `${formatTime(row.joinedAt)} joined · ${formatTime(row.leftAt)} left · ${duration(row.totalSeconds)} total · ${row.rejoinCount} rejoin(s)`;
  const away = document.createElement("p"); away.textContent = `${row.awayCount} away period(s), ${duration(row.awaySeconds)} total. Green bars show meeting visits; amber bars show away periods.`;
  const status = document.createElement("p"); status.textContent = `${row.status.join(" · ")} · Focus ${row.focus == null ? "Unavailable" : `${row.focus}% (${row.focusLabel})`}`;
  $("detail-content").replaceChildren(title, track, away, status);
  $("student-detail").classList.remove("hidden");
}

function renderDeletionRequests(requests) {
  const box = $("deletion-requests"); box.replaceChildren();
  if (!requests.length) { box.textContent = "No pending requests."; return; }
  for (const item of requests) {
    const row = document.createElement("p"); const text = document.createElement("span"); text.textContent = `${item.email} requested deletion on ${item.createdAt?.toDate?.().toLocaleString?.() ?? ""} `;
    const approve = document.createElement("button"); approve.textContent = "Delete student data"; approve.className = "danger";
    approve.addEventListener("click", async () => {
      if (!confirm(`Delete ${item.email}'s attendance data and roster entry for this session?`)) return;
      try {
        await deleteDoc(doc(db, "sessions", item.sessionId, "students", item.email));
        await deleteDoc(doc(db, "sessions", item.sessionId, "roster", item.email));
        await updateDoc(doc(db, "sessions", item.sessionId, "deletionRequests", item.id), { status: "fulfilled", fulfilledAt: Timestamp.now() });
      } catch (error) { showMessage(`Could not fulfill request: ${error.message}`, true); }
    });
    row.append(text, approve); box.append(row);
  }
}

function reportCsv() {
  const headers = ["Name", "Email", "Status", "No SEEge activity detected", "In time", "Out time", "Total minutes", "Attendance %", "Rejoins", "Away count", "Away seconds", "Chat count", "Reaction count", "Mic opens", "Mic unmuted seconds", "Focus score", "Focus label"];
  const rows = state.metrics.rows.map(row => [row.name, row.email, row.status.join(" + "), row.noExtension ? "Yes" : "No", row.joinedAt ? new Date(row.joinedAt).toISOString() : "", row.leftAt ? new Date(row.leftAt).toISOString() : "", Math.round(row.totalSeconds / 60), row.attendancePct, row.rejoinCount, row.awayCount, row.awaySeconds, row.chatCount, row.reactionCount, row.micOpens, row.micUnmutedSeconds, row.focus, row.focusLabel]);
  return makeCsv(headers, rows);
}

function downloadCsv(csv, session) {
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = `SEEge-${session.className.replace(/[^a-z0-9-_]+/gi, "-")}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function reportHtml(session) {
  const metrics = state.metrics;
  const lowest = [...metrics.rows].filter(row => row.focus != null).sort((a, b) => a.focus - b.focus).slice(0, 3);
  const rejoins = [...metrics.rows].sort((a, b) => b.rejoinCount - a.rejoinCount).slice(0, 3);
  const noExtension = metrics.rows.filter(row => row.noExtension).map(row => safeText(row.name)).join(", ") || "None";
  const table = metrics.rows.map(row => `<tr><td>${safeText(row.name)}</td><td>${safeText(row.email)}</td><td>${safeText(row.status.join(" + "))}</td><td>${formatTime(row.joinedAt)}</td><td>${formatTime(row.leftAt)}</td><td>${duration(row.totalSeconds)}</td><td>${row.attendancePct}%</td><td>${row.rejoinCount}</td><td>${row.awayCount} / ${duration(row.awaySeconds)}</td><td>${row.chatCount ?? "Unavailable"}</td><td>${row.reactionCount ?? "Unavailable"}</td><td>${row.micOpens ?? "Unavailable"}</td><td>${row.micUnmutedSeconds == null ? "Unavailable" : duration(row.micUnmutedSeconds)}</td><td>${row.focus == null ? "Unavailable" : `${row.focus}% (${safeText(row.focusLabel)})`}</td><td>${row.noExtension ? "No SEEge activity detected" : ""}</td></tr>`).join("");
  return `<h2>SEEge report: ${safeText(session.className)}</h2><p>${safeText(session.scheduledStart.toDate().toLocaleString())} – ${safeText((session.actualEnd ?? session.scheduledEnd).toDate().toLocaleString())}</p><p>Present ${metrics.present} · Late ${metrics.late} · Partial ${metrics.partial} · Absent ${metrics.absent}</p><h3>Lowest focus</h3><p>${lowest.map(x => `${safeText(x.name)} (${x.focus}%)`).join(", ") || "Unavailable"}</p><h3>Most rejoins</h3><p>${rejoins.map(x => `${safeText(x.name)} (${x.rejoinCount})`).join(", ")}</p><h3>No SEEge activity detected</h3><p>${noExtension}</p><table border="1" cellpadding="5"><thead><tr><th>Name</th><th>Email</th><th>Status</th><th>In</th><th>Out</th><th>Total</th><th>Attendance</th><th>Rejoins</th><th>Away</th><th>Chat</th><th>Reactions</th><th>Mic opens</th><th>Mic unmuted</th><th>Focus</th><th>Detection</th></tr></thead><tbody>${table}</tbody></table><p>No SEEge activity does not establish whether SEEge is installed. Focus is an indicator based on tab state and available participation counts, not proof of attention. Participation signal collection may be unavailable.</p>`;
}

async function sendEmail() {
  const session = state.currentSession; if (!session) return;
  const csv = reportCsv(); const subject = `SEEge attendance report — ${session.className}`;
  try {
    const result = await chrome.runtime.sendMessage({ type: "sendReport", report: { subject, html: reportHtml(session), csv, filename: `SEEge-${session.className.replace(/[^a-z0-9-_]+/gi, "-")}.csv` } });
    if (result?.error) throw new Error(result.error);
    showMessage("Report emailed to the signed-in Gmail account with CSV attached.");
  } catch (error) {
    downloadCsv(csv, session);
    const body = encodeURIComponent(`The SEEge CSV report has been downloaded and is ready to attach.\n\nPresent ${state.metrics.present} · Late ${state.metrics.late} · Partial ${state.metrics.partial} · Absent ${state.metrics.absent}`);
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(state.email)}&su=${encodeURIComponent(subject)}&body=${body}`;
    chrome.tabs.create({ url });
    showMessage(`Gmail API could not send (${error.message}). CSV downloaded and a prefilled Gmail draft opened; attach the CSV and send it.`);
  }
}

async function setEnd(endedNow) {
  const session = state.currentSession; if (!session) return;
  const actualEnd = endedNow ? Timestamp.now() : parseInputTime($("actual-end").value);
  if (!isValidActualEnd(session.scheduledStart, actualEnd)) throw new Error("Actual end must be between the scheduled start and now.");
  const intervals = [...(session.meetIntervals ?? [])];
  const openIndex = intervals.findLastIndex(interval => interval.end == null);
  if (openIndex >= 0) intervals[openIndex] = { ...intervals[openIndex], end: actualEnd.toMillis() };
  await updateDoc(doc(db, "sessions", session.id), { actualEnd, meetIntervals: intervals, status: "ended", updatedAt: Timestamp.now() });
  await syncIndexes({ ...session, status: "ended", actualEnd });
}

async function init() {
  try {
    await auth.authStateReady();
    const user = auth.currentUser;
    if (!user?.email) { showMessage("Sign in through the SEEge extension popup, then reload this dashboard.", true); return; }
    state.email = user.email.toLowerCase(); $("who").textContent = `Signed in as ${state.email}`;
    const profile = (await chrome.storage.local.get(`profile:${state.email}`))[`profile:${state.email}`];
    if (!profile?.consentAt || !profile?.name) { showMessage("Complete the SEEge first-run name and consent setup in the extension popup, then reload this dashboard.", true); return; }
    const teacher = await getDoc(doc(db, "teachers", state.email));
    if (!teacher.exists()) { showMessage("This Google account is not on the teacher allowlist.", true); return; }
    $("app").classList.remove("hidden"); hideMessage();
    $("session-form").addEventListener("submit", createSession);
    $("roster-form").addEventListener("submit", updateRoster);
    $("selector-form").addEventListener("submit", saveSelectors);
    $("search").addEventListener("input", renderStudents); $("status-filter").addEventListener("change", renderStudents);
    document.querySelectorAll(".sort").forEach(button => button.addEventListener("click", () => {
      const key = button.dataset.sort;
      state.sort = { key, direction: state.sort.key === key ? -state.sort.direction : 1 };
      renderStudents();
    }));
    $("refresh").addEventListener("click", () => loadSessions().catch(error => showMessage(error.message, true)));
    $("close-detail").addEventListener("click", () => $("student-detail").classList.add("hidden"));
    $("end-session").addEventListener("click", () => setEnd(true).catch(error => showMessage(error.message, true)));
    $("save-end").addEventListener("click", () => setEnd(false).catch(error => showMessage(error.message, true)));
    $("csv").addEventListener("click", () => state.currentSession && downloadCsv(reportCsv(), state.currentSession));
    $("email").addEventListener("click", sendEmail);
    state.timer = setInterval(() => {
      if (!state.currentSession) return;
      renderMetrics();
      const session = state.currentSession; const now = Date.now();
      if (session.status === "scheduled" && now >= session.scheduledStart.toMillis() && now < session.scheduledEnd.toMillis()) updateDoc(doc(db, "sessions", session.id), { status: "live", updatedAt: Timestamp.now() }).catch(console.error);
      if (session.status === "live" && now >= session.scheduledEnd.toMillis()) {
        const intervals = [...(session.meetIntervals ?? [])]; const openIndex = intervals.findLastIndex(interval => interval.end == null);
        if (openIndex >= 0) intervals[openIndex] = { ...intervals[openIndex], end: session.scheduledEnd.toMillis() };
        updateDoc(doc(db, "sessions", session.id), { actualEnd: session.scheduledEnd, meetIntervals: intervals, status: "ended", updatedAt: Timestamp.now() }).catch(console.error);
      }
    }, 5000);
    await loadSelectors();
    await loadSessions();
    // A newly created scheduled session can become live/end without the page being reopened.
    setInterval(async () => { try { await loadSessions(); } catch (error) { console.warn("Session refresh failed:", error.message); } }, 60_000);
  } catch (error) { showMessage(`Dashboard initialization failed: ${error.message}`, true); }
}

init();
