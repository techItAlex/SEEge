import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const rules = await readFile(new URL('../firestore.rules', import.meta.url), 'utf8');

test('session document reads require an owner or the requesting student to be rostered', () => {
  assert.match(rules, /allow get: if ownsSession\(\) \|\| \(signedIn\(\)[\s\S]*?exists\(rosterPath\(sessionId, email\(\)\)\)\);/);
  assert.match(rules, /allow list: if ownsSession\(\);/);
  assert.match(rules, /allow read: if ownsSessionById\(sessionId\) \|\| ownStudent\(studentEmail\);/);
});

test('student writes are limited to their own live-session document and bounded typed fields', () => {
  assert.match(rules, /allow create: if ownStudent\(studentEmail\)[\s\S]*?get\(sessionPath\(sessionId\)\)\.data\.status == 'live'[\s\S]*?validStudentData\(studentEmail\);/);
  assert.match(rules, /allow update: if ownStudent\(studentEmail\)[\s\S]*?request\.resource\.data\.uid == resource\.data\.uid[\s\S]*?request\.resource\.data\.consentVersion == resource\.data\.consentVersion[\s\S]*?validStudentData\(studentEmail\);/);
  assert.match(rules, /request\.resource\.data\.awaySeconds <= 86400/);
  assert.match(rules, /request\.resource\.data\.visits\.size\(\) <= 500/);
});

test('a teacher cannot take over another teacher active Meet-code index', () => {
  assert.match(rules, /allow create: if validMeetIndex\(meetCode\);/);
  assert.match(rules, /allow update: if validMeetIndex\(meetCode\)[\s\S]*?resource\.data\.teacherEmail == email\(\)[\s\S]*?resource\.data\.sessionId == request\.resource\.data\.sessionId[\s\S]*?get\(sessionPath\(resource\.data\.sessionId\)\)\.data\.status == 'ended'/);
  assert.match(rules, /meetCode in getAfter\(sessionPath\(request\.resource\.data\.sessionId\)\)\.data\.meetCodes/);
});

test("student deletion requests are limited to the requesting student's own rostered session", () => {
  assert.match(rules, /match \/deletionRequests\/\{requestId\}[\s\S]*?allow create: if signedIn\(\)[\s\S]*?exists\(rosterPath\(sessionId, email\(\)\)\)[\s\S]*?request\.resource\.data\.email == email\(\)/);
});

test('Meet indexes have an explicit schema and must match the linked session state', () => {
  assert.match(rules, /function validMeetIndex\(meetCode\)[\s\S]*?keys\(\)\.hasOnly\(\['meetCode', 'sessionId', 'teacherEmail', 'status', 'actualEnd'\]\)/);
  assert.match(rules, /request\.resource\.data\.status == getAfter\(sessionPath\(request\.resource\.data\.sessionId\)\)\.data\.status/);
  assert.match(rules, /request\.resource\.data\.actualEnd == getAfter\(sessionPath\(request\.resource\.data\.sessionId\)\)\.data\.actualEnd/);
  assert.match(rules, /resource\.data\.keys\(\)\.hasOnly\([\s\S]*?'teacherEmail', 'status', 'actualEnd'[\s\S]*?\]\)/);
  assert.match(rules, /resource\.data\.status == 'live'[\s\S]*?exists\(rosterPath\(resource\.data\.sessionId, email\(\)\)\)/);
});

test('client config is limited to the supported selector document and teacher schema', () => {
  assert.match(rules, /match \/config\/\{configId\}[\s\S]*?allow get: if signedIn\(\) && configId == 'meetSelectors';/);
  assert.match(rules, /allow list: if false;/);
  assert.match(rules, /allow create, update: if configId == 'meetSelectors'[\s\S]*?isTeacher\(\)[\s\S]*?request\.resource\.data\.updatedBy == email\(\)/);
  assert.match(rules, /allow delete: if false;/);
});
