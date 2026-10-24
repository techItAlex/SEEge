import test, { before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';

const projectId = 'demo-seege-rules';
const rules = await readFile(new URL('../firestore.rules', import.meta.url), 'utf8');
let env;

before(async () => {
  env = await initializeTestEnvironment({
    projectId,
    firestore: { rules, host: '127.0.0.1', port: 8080 },
  });
});

beforeEach(async () => env.clearFirestore());
after(async () => env?.cleanup());

const session = (teacherEmail = 'teacher@example.com', status = 'live') => ({
  teacherEmail,
  className: 'Demo class',
  meetCodes: ['abc-defg-hij'],
  status,
  scheduledStart: new Date('2026-10-23T09:00:00Z'),
  scheduledEnd: new Date('2026-10-23T10:00:00Z'),
  actualEnd: status === 'ended' ? new Date('2026-10-23T10:00:00Z') : null,
  thresholds: {},
});

const studentRecord = (email = 'student@example.com', uid = 'student-1') => ({
  email, uid, name: 'Student One', consentAt: new Date('2026-10-23T08:00:00Z'),
  consentVersion: 'v1', visits: [], awayPeriods: [], awayCount: 0, awaySeconds: 0,
  chatCount: 0, reactionCount: 0, micOpens: 0, micUnmutedSeconds: 0,
  signalAvailability: { chat: false, reactions: false, mic: false },
  currentlyAway: false, lastHeartbeat: new Date(), extensionVersion: '0.3.0', updatedAt: new Date(),
});

async function seed({ roster = ['student@example.com'], status = 'live' } = {}) {
  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    await db.doc('teachers/teacher@example.com').set({ enabled: true });
    await db.doc('sessions/session-1').set(session('teacher@example.com', status));
    for (const email of roster) {
      await db.doc(`sessions/session-1/roster/${email}`).set({ email, name: email.split('@')[0] });
    }
    await db.doc('meetSessions/abc-defg-hij').set({
      meetCode: 'abc-defg-hij', sessionId: 'session-1', teacherEmail: 'teacher@example.com',
      status, actualEnd: status === 'ended' ? new Date('2026-10-23T10:00:00Z') : null,
    });
  });
}

test('unauthenticated clients cannot read sessions, indexes, config, or write data', async () => {
  await seed();
  const db = env.unauthenticatedContext().firestore();
  await assertFails(db.doc('sessions/session-1').get());
  await assertFails(db.doc('meetSessions/abc-defg-hij').get());
  await assertFails(db.doc('config/meetSelectors').get());
  await assertFails(db.doc('sessions/session-1/students/student@example.com').set(studentRecord()));
});

test('teachers can list only their sessions and cannot read another teacher session', async () => {
  await seed();
  const owner = env.authenticatedContext('teacher-1', { email: 'teacher@example.com' }).firestore();
  const other = env.authenticatedContext('teacher-2', { email: 'other@example.com' }).firestore();
  await assertSucceeds(owner.collection('sessions').where('teacherEmail', '==', 'teacher@example.com').get());
  await assertFails(owner.collection('sessions').where('teacherEmail', '==', 'other@example.com').get());
  await assertFails(other.doc('sessions/session-1').get());
  await assertFails(other.doc('sessions/session-1/students/student@example.com').get());
});

test('students can read their own records but not another student records or unrostered sessions', async () => {
  await seed();
  const student = env.authenticatedContext('student-1', { email: 'student@example.com' }).firestore();
  const otherStudent = env.authenticatedContext('student-2', { email: 'other@example.com' }).firestore();
  await env.withSecurityRulesDisabled(context => context.firestore()
    .doc('sessions/session-1/students/student@example.com').set(studentRecord()));
  await assertSucceeds(student.doc('sessions/session-1/students/student@example.com').get());
  await assertFails(student.doc('sessions/session-1/students/other@example.com').get());
  await assertFails(otherStudent.doc('sessions/session-1').get());
  await assertFails(otherStudent.doc('sessions/session-1/students/student@example.com').get());
  await assertFails(otherStudent.doc('sessions/session-1/students/other@example.com').set(studentRecord('other@example.com', 'student-2')));
});

test('student activity is writable only by its owner during a live rostered session', async () => {
  await seed();
  const student = env.authenticatedContext('student-1', { email: 'student@example.com' }).firestore();
  const ownRecord = student.doc('sessions/session-1/students/student@example.com');
  await assertSucceeds(ownRecord.set(studentRecord()));
  // Accepted client metrics remain self-reported and are not tamper-proof evidence.
  await assertSucceeds(ownRecord.update({ awayCount: 99, lastHeartbeat: new Date('2035-01-01T00:00:00Z') }));
  await assertFails(ownRecord.update({ consentAt: new Date('2026-10-23T08:01:00Z') }));
  await assertFails(ownRecord.update({ deletionStatus: 'deleted' }));
  await assertSucceeds(ownRecord.delete());
  await env.withSecurityRulesDisabled(async context => {
    await context.firestore().doc('sessions/session-1').set(session('teacher@example.com', 'ended'));
  });
  await assertFails(ownRecord.set(studentRecord()));
});

test('live Meet indexes are lookup-readable but reject extra fields and non-owner mutation', async () => {
  await seed();
  const student = env.authenticatedContext('student-1', { email: 'student@example.com' }).firestore();
  const teacher = env.authenticatedContext('teacher-1', { email: 'teacher@example.com' }).firestore();
  const otherTeacher = env.authenticatedContext('teacher-2', { email: 'other@example.com' }).firestore();
  const nonRostered = env.authenticatedContext('student-2', { email: 'other@example.com' }).firestore();
  await assertSucceeds(student.doc('meetSessions/abc-defg-hij').get());
  await assertFails(nonRostered.doc('meetSessions/abc-defg-hij').get());
  await assertFails(student.doc('meetSessions/abc-defg-hij').update({ privateNote: 'unexpected' }));
  await assertFails(otherTeacher.doc('meetSessions/abc-defg-hij').delete());
  await assertSucceeds(teacher.doc('meetSessions/abc-defg-hij').update({ status: 'live' }));
});

test('session and Meet index can be created atomically; foreign or malformed indexes fail', async () => {
  const teacher = env.authenticatedContext('teacher-1', { email: 'teacher@example.com' }).firestore();
  const batch = teacher.batch();
  batch.set(teacher.doc('sessions/session-new'), session());
  batch.set(teacher.doc('meetSessions/abc-defg-hij'), {
    meetCode: 'abc-defg-hij', sessionId: 'session-new', teacherEmail: 'teacher@example.com', status: 'live', actualEnd: null,
  });
  await assertSucceeds(batch.commit());
  const otherTeacher = env.authenticatedContext('other-teacher', { email: 'other@example.com' }).firestore();
  await assertFails(otherTeacher.doc('meetSessions/other-code').set({
    meetCode: 'other-code', sessionId: 'session-new', teacherEmail: 'other@example.com', status: 'live', actualEnd: null,
  }));
  await assertFails(teacher.doc('meetSessions/extra-code').set({
    meetCode: 'extra-code', sessionId: 'session-new', teacherEmail: 'teacher@example.com', status: 'live', actualEnd: null, privateNote: 'no',
  }));
});

test('config reads and writes are limited to the selector document and teacher schema', async () => {
  const student = env.authenticatedContext('student-1', { email: 'student@example.com' }).firestore();
  const teacher = env.authenticatedContext('teacher-1', { email: 'teacher@example.com' }).firestore();
  await env.withSecurityRulesDisabled(context => context.firestore().doc('config/private').set({ secret: 'test-only' }));
  await assertFails(student.doc('config/private').get());
  await assertSucceeds(student.doc('config/meetSelectors').get());
  await assertFails(student.doc('config/meetSelectors').set({ chatSendSelector: '.chat' }));
  const valid = {
    chatSendSelector: '.send', microphoneSelector: '.mic', reactionSelectors: ['.reaction'],
    updatedAt: new Date(), updatedBy: 'teacher@example.com',
  };
  await assertSucceeds(teacher.doc('config/meetSelectors').set(valid));
  await assertFails(teacher.doc('config/meetSelectors').set({ ...valid, updatedBy: 'other@example.com' }));
  await assertFails(teacher.doc('config/other').set(valid));
});
