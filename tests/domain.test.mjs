import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveStudentMetrics, getClassWindow, summarizeSession, makeCsv, parseRosterCsv, shouldRetrySessionCheck, isValidActualEnd } from '../src/domain.mjs';

const base = { scheduledStart: 0, scheduledEnd: 7_200_000, actualEnd: null, thresholds: { presentPct: 75, lateMinutes: 10 } };
const roster = { email: 'a@example.com', name: 'A Student' };

test('rechecks consent and non-active Meet states, but treats an active session as settled', () => {
  assert.equal(shouldRetrySessionCheck('consent_required'), true);
  assert.equal(shouldRetrySessionCheck('no_session'), true);
  assert.equal(shouldRetrySessionCheck('active'), false);
  assert.equal(shouldRetrySessionCheck('teacher_active'), false);
});

test('manual class end is bounded by scheduled start and current time', () => {
  assert.equal(isValidActualEnd(1_000, 2_000, 3_000), true);
  assert.equal(isValidActualEnd(1_000, 900, 3_000), false);
  assert.equal(isValidActualEnd(1_000, 3_001, 3_000), false);
});

test('clips attendance to early class end and schedule', () => {
  const session = { ...base, actualEnd: 4_500_000 };
  const result = deriveStudentMetrics({ visits: [{ join: 0, leave: 4_500_000 }] }, session, roster, 7_200_000);
  assert.equal(result.attendancePct, 100);
  assert.equal(result.totalSeconds, 4500);
  assert.ok(result.status.includes('Present'));
});

test('counts rejoin and late while classifying partial attendance', () => {
  const result = deriveStudentMetrics({ visits: [{ join: 720_000, leave: 1_200_000 }, { join: 1_500_000, leave: 2_000_000 }] }, base, roster, 7_200_000);
  assert.equal(result.rejoinCount, 1);
  assert.ok(result.status.includes('Late'));
  assert.ok(result.status.includes('Partial'));
});

test('applies the exact present threshold and preserves late as a separate label', () => {
  const lateSession = { scheduledStart: 0, scheduledEnd: 4_000_000, actualEnd: null, thresholds: { presentPct: 75, lateMinutes: 10 } };
  const onBoundary = deriveStudentMetrics({ visits: [{ join: 660_000, leave: 4_000_000 }] }, lateSession, roster, 4_000_000);
  assert.equal(onBoundary.attendancePct, 83.5);
  assert.ok(onBoundary.status.includes('Late'));
  assert.ok(onBoundary.status.includes('Present'));
  const session = { scheduledStart: 0, scheduledEnd: 1_000_000, actualEnd: null, thresholds: { presentPct: 75, lateMinutes: 10 } };
  const exact = deriveStudentMetrics({ visits: [{ join: 0, leave: 750_000 }] }, session, roster, 1_000_000);
  assert.equal(exact.attendancePct, 75);
  assert.ok(exact.status.includes('Present'));
});

test('uses last heartbeat plus 90 seconds for abrupt disconnect', () => {
  const result = deriveStudentMetrics({ visits: [{ join: 0, leave: null }], lastHeartbeat: 60_000 }, base, roster, 7_200_000);
  assert.equal(result.totalSeconds, 150);
});

test('handles Firestore timestamps for active visits and leaves out time blank', () => {
  const ts = value => ({ toMillis: () => value });
  const session = { ...base, status: 'live' };
  const result = deriveStudentMetrics({ visits: [{ join: ts(0), leave: null }], lastHeartbeat: ts(80_000) }, session, roster, 100_000);
  assert.equal(result.totalSeconds, 100);
  assert.equal(result.inMeet, true);
  assert.equal(result.leftAt, null);
});

test('rostered students without extension data are absent', () => {
  const summary = summarizeSession(base, [roster], new Map(), 7_200_000);
  assert.equal(summary.absent, 1);
  assert.equal(summary.rows[0].noExtension, true);
  assert.equal(summary.rows[0].focus, null);
});

test('computes focus, unavailable participation and weights safely', () => {
  const student = { visits: [{ join: 0, leave: 3_600_000 }], awaySeconds: 360, awayCount: 1, chatCount: 2, reactionCount: 1, micOpens: 1, signalAvailability: { chat: false, reactions: true, mic: true } };
  const result = deriveStudentMetrics(student, base, roster, 7_200_000);
  assert.equal(result.participationAvailable, false);
  assert.equal(result.focus, 92);
});

test('applies configured focus weights and reweights unavailable participation', () => {
  const session = { ...base, thresholds: { focusWeights: { screen: 1, participation: 0, stability: 0 } } };
  const result = deriveStudentMetrics({ visits: [{ join: 0, leave: 3_600_000 }], awaySeconds: 360, signalAvailability: { chat: false, reactions: false, mic: false } }, session, roster, 7_200_000);
  assert.equal(result.focus, 90);
});

test('limits end time to schedule and current time', () => {
  assert.deepEqual(getClassWindow({ ...base, actualEnd: 9_000_000 }, 3_600_000), { start: 0, end: 3_600_000 });
});

test('excludes the gap between two Meet links and deduplicates duplicate joins', () => {
  const session = { ...base, meetIntervals: [{ start: 0, end: 3_600_000 }, { start: 5_400_000, end: 7_200_000 }] };
  const result = deriveStudentMetrics({ visits: [
    { join: 0, leave: 3_600_000 }, { join: 0, leave: 3_600_000 },
    { join: 5_400_000, leave: 7_200_000 },
  ] }, session, roster, 7_200_000);
  assert.equal(result.totalSeconds, 5_400);
  assert.equal(result.attendancePct, 100);
  assert.equal(result.rejoinCount, 1);
});

test('overlapping duplicate visits do not inflate rejoins or reduce stability', () => {
  const student = { visits: [
    { join: 0, leave: 1_800_000 },
    { join: 1_000, leave: 1_800_000 },
  ] };
  const result = deriveStudentMetrics(student, base, roster, 7_200_000);
  assert.equal(result.rejoinCount, 0);
  assert.equal(result.focus, 100);
});

test('CSV quotes cells and neutralizes spreadsheet formulas', () => {
  assert.equal(makeCsv(['name', 'value'], [['=1+1', 'a,"b']]), '"name","value"\r\n"\'=1+1","a,""b"');
});

test('parses BOM and quoted roster CSV, normalizes email and updates duplicates', () => {
  const roster = parseRosterCsv('\uFEFFname,email\r\n"Doe, Jane",JANE@example.com\r\nUpdated Name,jane@example.com');
  assert.deepEqual(roster, [{ email: 'jane@example.com', name: 'Updated Name' }]);
});

test('rejects malformed roster CSV and invalid email rows', () => {
  assert.throws(() => parseRosterCsv('Name,Email\n"Open name,email@example.com'), /unclosed quotation/);
  assert.throws(() => parseRosterCsv('Name,not-an-email'), /Invalid roster email/);
});
