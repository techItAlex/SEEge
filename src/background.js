import { app, auth } from "./firebase.js";
import { GoogleAuthProvider, signInWithCredential, signOut } from "firebase/auth/web-extension";
import {
  getFirestore, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, collection, query, where,
  serverTimestamp, Timestamp
} from "firebase/firestore/lite";

const db = getFirestore(app);
const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.send";
const QUEUE_PREFIX = "seege:pending:";
const studentSyncLanes = new Map();

function getToken(interactive, scopes) {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive, ...(scopes ? { scopes } : {}) }, token => {
      const error = chrome.runtime.lastError;
      if (error || !token) reject(new Error(error?.message || "Google did not return an access token."));
      else resolve(token);
    });
  });
}

async function signIn() {
  const token = await getToken(true);
  const result = await signInWithCredential(auth, GoogleAuthProvider.credential(null, token));
  return result.user;
}

async function doSignOut() {
  try {
    const token = await getToken(false);
    await chrome.identity.removeCachedAuthToken({ token });
  } catch { /* Sign out still works when there is no cached token. */ }
  await signOut(auth);
}

async function lookupSession(meetCode) {
  const user = auth.currentUser;
  if (!user?.email) return { status: "signed_out" };
  const email = user.email.toLowerCase();
  const [teacher, profile] = await Promise.all([
    getDoc(doc(db, "teachers", email)),
    chrome.storage.local.get(`profile:${email}`),
  ]);
  const savedProfile = profile[`profile:${email}`];
  if (!savedProfile?.consentAt || !savedProfile?.name) return { status: "consent_required", email };
  const cacheKey = `cachedSession:${email}:${meetCode}`;
  let index;
  try { index = await getDoc(doc(db, "meetSessions", meetCode)); }
  catch (error) {
    if (error.code === "permission-denied") {
      await chrome.storage.local.remove(cacheKey);
      return { status: "not_rostered", email };
    }
    throw error;
  }
  if (!index.exists() || index.data().status !== "live") { await chrome.storage.local.remove(cacheKey); return { status: teacher.exists() ? "teacher" : "no_session", email }; }
  const localSession = (await chrome.storage.local.get(`deletionRequested:${email}:${index.data().sessionId}`))[`deletionRequested:${email}:${index.data().sessionId}`];
  if (localSession) { await chrome.storage.local.remove(cacheKey); return { status: "deletion_pending", email }; }
  const isSessionTeacher = teacher.exists() && index.data().teacherEmail === email;
  if (!isSessionTeacher) {
    const roster = await getDoc(doc(db, "sessions", index.data().sessionId, "roster", email));
    if (!roster.exists()) { await chrome.storage.local.remove(cacheKey); return { status: "not_rostered", email }; }
  }
  const sessionSnapshot = await getDoc(doc(db, "sessions", index.data().sessionId));
  if (!sessionSnapshot.exists()) { await chrome.storage.local.remove(cacheKey); return { status: "no_session", email }; }
  const now = Date.now();
  const session = { id: index.data().sessionId, ...sessionSnapshot.data() };
  if (!session.meetCodes?.includes(meetCode) || session.status !== "live" || now < session.scheduledStart.toMillis() || now > Math.min(session.scheduledEnd.toMillis(), session.actualEnd?.toMillis?.() ?? Infinity)) {
    await chrome.storage.local.remove(cacheKey);
    return { status: teacher.exists() ? "teacher" : "no_session", email };
  }
  if (isSessionTeacher && session.teacherEmail === email) {
    const result = { status: "teacher_active", email, sessionId: session.id, scheduledEnd: session.scheduledEnd.toMillis() };
    await chrome.storage.local.set({ [cacheKey]: result });
    return result;
  }
  let selectors = null;
  try {
    const config = await getDoc(doc(db, "config", "meetSelectors"));
    if (config.exists()) selectors = config.data();
  } catch { /* Optional participation signals degrade explicitly. */ }
  const result = {
    status: "active", email, uid: user.uid, name: savedProfile.name, sessionId: session.id,
    className: session.className, scheduledStart: session.scheduledStart.toMillis(),
    scheduledEnd: session.scheduledEnd.toMillis(), selectors,
  };
  await chrome.storage.local.set({ [cacheKey]: result });
  return result;
}

async function checkSession(meetCode) {
  try { return await lookupSession(meetCode); }
  catch (error) {
    const email = auth.currentUser?.email?.toLowerCase();
    if (email) {
      const key = `cachedSession:${email}:${meetCode}`;
      const cached = (await chrome.storage.local.get([key, `profile:${email}`]));
      const profile = cached[`profile:${email}`]; const session = cached[key];
      if (profile?.consentAt && profile?.name && session && Date.now() < session.scheduledEnd) {
        return { ...session, offline: true };
      }
    }
    throw error;
  }
}

async function persistStudentInner(sessionId, state) {
  const user = auth.currentUser;
  if (!user?.email) throw new Error("Sign in is required to sync activity.");
  const email = user.email.toLowerCase();
  const local = (await chrome.storage.local.get(`profile:${email}`))[`profile:${email}`];
  if (!Number.isFinite(local?.consentAt) || !local?.name) throw new Error("Complete SEEge consent and name setup before joining a monitored class.");
  const deletionKey = `deletionRequested:${email}:${sessionId}`;
  if ((await chrome.storage.local.get(deletionKey))[deletionKey]) throw new Error("TRACKING_STOPPED: deletion was requested for this session.");
  const record = {
    email, uid: user.uid, name: local.name, consentAt: Timestamp.fromMillis(local.consentAt), visits: state.visits,
    awayCount: Math.max(0, Math.trunc(state.awayCount)), awaySeconds: Math.max(0, Math.trunc(state.awaySeconds)),
    awayPeriods: state.awayPeriods ?? [],
    chatCount: Math.max(0, Math.trunc(state.chatCount ?? 0)),
    reactionCount: Math.max(0, Math.trunc(state.reactionCount ?? 0)),
    micOpens: Math.max(0, Math.trunc(state.micOpens ?? 0)),
    micUnmutedSeconds: Math.max(0, Math.trunc(state.micUnmutedSeconds ?? 0)),
    signalAvailability: state.signalAvailability ?? { chat: false, reactions: false, mic: false },
    currentlyAway: !!state.currentlyAway,
    lastHeartbeat: serverTimestamp(), extensionVersion: chrome.runtime.getManifest().version,
    consentVersion: local.consentVersion, updatedAt: serverTimestamp(),
  };
  const queueKey = `${QUEUE_PREFIX}${sessionId}`;
  await chrome.storage.local.set({ [`lastSession:${email}`]: sessionId });
  await chrome.storage.local.set({ [queueKey]: { sessionId, record, queuedAt: Date.now() } });
  await flushQueue(queueKey);
}

function persistStudent(sessionId, state) {
  const previous = studentSyncLanes.get(sessionId) ?? Promise.resolve();
  const current = previous.catch(() => {}).then(() => persistStudentInner(sessionId, state));
  studentSyncLanes.set(sessionId, current);
  return current.finally(() => { if (studentSyncLanes.get(sessionId) === current) studentSyncLanes.delete(sessionId); });
}

async function syncMeetIndex(sessionId, session, status = session.status, actualEnd = session.actualEnd ?? null) {
  for (const meetCode of session.meetCodes ?? []) {
    const ref = doc(db, "meetSessions", meetCode);
    const existing = await getDoc(ref);
    const data = { meetCode, sessionId, teacherEmail: session.teacherEmail, status, actualEnd };
    if (!existing.exists() || existing.data().sessionId !== sessionId || existing.data().status !== status) await setDoc(ref, data);
  }
}

async function updateScheduledSessions() {
  await auth.authStateReady();
  const user = auth.currentUser;
  if (!user?.email) return;
  const sessions = await getDocs(query(collection(db, "sessions"), where("teacherEmail", "==", user.email.toLowerCase())));
  const now = Date.now();
  for (const item of sessions.docs) {
    const session = { id: item.id, ...item.data() };
    let status = session.status;
    let actualEnd = session.actualEnd ?? null;
    if (status === "scheduled" && now >= session.scheduledStart.toMillis() && now < session.scheduledEnd.toMillis()) status = "live";
    if ((status === "scheduled" || status === "live") && now >= session.scheduledEnd.toMillis()) { status = "ended"; actualEnd = session.scheduledEnd; }
    if (status !== session.status) {
      const intervals = Array.isArray(session.meetIntervals) ? [...session.meetIntervals] : [];
      const openIndex = intervals.findLastIndex(interval => interval.end == null);
      if (status === "ended" && openIndex >= 0) intervals[openIndex] = { ...intervals[openIndex], end: actualEnd?.toMillis?.() ?? Date.now() };
      await updateDoc(doc(db, "sessions", session.id), { status, actualEnd, meetIntervals: intervals, updatedAt: serverTimestamp() });
      session.meetIntervals = intervals;
    }
    await syncMeetIndex(session.id, session, status, actualEnd);
  }
}

async function enforceRetention() {
  await auth.authStateReady();
  const user = auth.currentUser;
  if (!user?.email) return;
  const marker = `retentionChecked:${user.email.toLowerCase()}`;
  const last = (await chrome.storage.local.get(marker))[marker] ?? 0;
  if (Date.now() - last < 24 * 60 * 60_000) return;
  const sessions = await getDocs(query(collection(db, "sessions"), where("teacherEmail", "==", user.email.toLowerCase())));
  for (const item of sessions.docs) {
    const session = item.data();
    const end = session.actualEnd?.toMillis?.() ?? session.scheduledEnd?.toMillis?.() ?? 0;
    if (Date.now() < end + (session.retentionDays ?? 90) * 24 * 60 * 60_000) continue;
    for (const subcollection of ["roster", "students", "deletionRequests"]) {
      const children = await getDocs(collection(db, "sessions", item.id, subcollection));
      for (const child of children.docs) await deleteDoc(child.ref);
    }
    for (const code of session.meetCodes ?? []) {
      const ref = doc(db, "meetSessions", code); const index = await getDoc(ref);
      if (index.exists() && index.data().sessionId === item.id) await deleteDoc(ref);
    }
    await deleteDoc(doc(db, "sessions", item.id));
  }
  await chrome.storage.local.set({ [marker]: Date.now() });
}

async function enforceLocalRetention() {
  const cutoff = Date.now() - 90 * 24 * 60 * 60_000;
  const data = await chrome.storage.local.get(null);
  const expired = [];
  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith("seege:") && Number(value?.lastHeartbeat) < cutoff) expired.push(key);
    else if (key.startsWith(QUEUE_PREFIX) && Number(value?.queuedAt) < cutoff) expired.push(key);
    else if (key.startsWith("deletionRequested:") && Number(value) < cutoff) expired.push(key);
  }
  if (expired.length) await chrome.storage.local.remove(expired);
}

async function flushQueue(key) {
  const pending = (await chrome.storage.local.get(key))[key];
  if (!pending) return;
  const step = async (label, run) => {
    try { return await run(); }
    catch (error) { error.message = `${label}: ${error.message}`; throw error; }
  };
  // chrome.storage keeps JSON only, so the queued record's Timestamp/serverTimestamp values come back as plain maps.
  const consent = pending.record.consentAt;
  const record = {
    ...pending.record,
    consentAt: consent instanceof Timestamp ? consent : new Timestamp(consent.seconds, consent.nanoseconds),
    lastHeartbeat: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const session = await step(`read session ${pending.sessionId}`, () => getDoc(doc(db, "sessions", pending.sessionId)));
  if (!session.exists() || session.data().status !== "live" || Date.now() >= session.data().scheduledEnd.toMillis() || (session.data().actualEnd && Date.now() >= session.data().actualEnd.toMillis())) {
    await chrome.storage.local.remove(key);
    throw new Error("TRACKING_STOPPED: the class is no longer live.");
  }
  const rosterEntry = await step(`read roster ${pending.record.email}`, () => getDoc(doc(db, "sessions", pending.sessionId, "roster", pending.record.email)));
  if (!rosterEntry.exists()) {
    await chrome.storage.local.remove(key);
    throw new Error("TRACKING_STOPPED: this student is no longer on the session roster.");
  }
  await step(`write students/${pending.record.email}`, () => setDoc(doc(db, "sessions", pending.sessionId, "students", pending.record.email), record, { merge: true }));
  await chrome.storage.local.remove(key);
}

async function flushAll() {
  const data = await chrome.storage.local.get(null);
  for (const key of Object.keys(data).filter(key => key.startsWith(QUEUE_PREFIX))) {
    try { await flushQueue(key); } catch (error) { console.warn("SEEge sync will retry:", error.message); }
  }
}

async function teacherLeft(sessionId, meetCode) {
  await chrome.storage.local.set({ [`teacher-away:${sessionId}`]: { at: Date.now(), meetCode } });
}

async function teacherReturned(sessionId, meetCode) {
  await auth.authStateReady();
  const key = `teacher-away:${sessionId}`;
  const candidate = (await chrome.storage.local.get(key))[key];
  const sessionRef = doc(db, "sessions", sessionId);
  const snapshot = await getDoc(sessionRef);
  if (!snapshot.exists() || snapshot.data().teacherEmail !== auth.currentUser?.email?.toLowerCase() || snapshot.data().status !== "live") return;
  const session = snapshot.data();
  const intervals = Array.isArray(session.meetIntervals) ? [...session.meetIntervals] : [];
  const openIndex = intervals.findLastIndex(interval => interval.end == null);
  let changed = false;
  if (candidate && candidate.meetCode && candidate.meetCode !== meetCode && openIndex >= 0) {
    intervals[openIndex] = { ...intervals[openIndex], end: candidate.at };
    intervals.push({ start: Date.now(), end: null, meetCode });
    changed = true;
  } else if (openIndex < 0) {
    intervals.push({ start: session.scheduledStart.toMillis(), end: null, meetCode });
    changed = true;
  }
  if (changed) await updateDoc(sessionRef, { meetIntervals: intervals, updatedAt: serverTimestamp() });
  await chrome.storage.local.remove(key);
}

async function finishLongTeacherDeparture() {
  await auth.authStateReady();
  const data = await chrome.storage.local.get(null);
  for (const [key, start] of Object.entries(data)) {
    if (!key.startsWith("teacher-away:") || Date.now() - start.at < 5 * 60_000) continue;
    const sessionId = key.slice("teacher-away:".length);
    try {
      const sessionRef = doc(db, "sessions", sessionId);
      const current = await getDoc(sessionRef);
      if (current.exists() && current.data().teacherEmail === auth.currentUser?.email?.toLowerCase() && current.data().status === "live") {
        const intervals = Array.isArray(current.data().meetIntervals) ? [...current.data().meetIntervals] : [];
        const openIndex = intervals.findLastIndex(interval => interval.end == null);
        if (openIndex >= 0) intervals[openIndex] = { ...intervals[openIndex], end: start.at };
        await updateDoc(sessionRef, { actualEnd: Timestamp.fromMillis(start.at), meetIntervals: intervals, status: "ended", updatedAt: serverTimestamp() });
        for (const code of current.data().meetCodes ?? []) {
          const indexRef = doc(db, "meetSessions", code);
          const indexSnapshot = await getDoc(indexRef);
          if (indexSnapshot.exists() && indexSnapshot.data().sessionId === sessionId) await updateDoc(indexRef, { status: "ended", actualEnd: Timestamp.fromMillis(start.at) });
        }
      }
      await chrome.storage.local.remove(key);
    } catch (error) { console.warn("Could not close session after teacher departure:", error.message); }
  }
}

function base64Url(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

async function sendReport({ subject, html, csv, filename }) {
  const recipient = auth.currentUser?.email;
  if (!recipient) throw new Error("Sign in to the Gmail account that should receive this report.");
  const token = await getToken(true, [GMAIL_SCOPE]);
  const boundary = `seege_${crypto.randomUUID().replaceAll("-", "")}`;
  const safeFilename = String(filename || "seege-report.csv").replace(/[\r\n"\\]/g, "_");
  const mime = [
    `To: ${recipient}`, `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject.replace(/[\r\n]/g, " "))))}?=`, "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary=\"${boundary}\"`, "", `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"', "Content-Transfer-Encoding: base64", "", btoa(unescape(encodeURIComponent(html))).match(/.{1,76}/g)?.join("\r\n") ?? "",
    `--${boundary}`, `Content-Type: text/csv; name=\"${safeFilename}\"`,
    `Content-Disposition: attachment; filename=\"${safeFilename}\"`, "Content-Transfer-Encoding: base64", "",
    btoa(unescape(encodeURIComponent(csv))).match(/.{1,76}/g)?.join("\r\n") ?? "", `--${boundary}--`, "",
  ].join("\r\n");
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw: base64Url(mime) }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    if (response.status === 401) chrome.identity.removeCachedAuthToken({ token });
    throw new Error(body.error?.message || `Gmail send failed (${response.status}).`);
  }
  return { ok: true };
}

chrome.runtime.onInstalled.addListener(() => chrome.alarms.create("seege-maintenance", { periodInMinutes: 1 }));
chrome.runtime.onStartup.addListener(() => chrome.alarms.create("seege-maintenance", { periodInMinutes: 1 }));
chrome.alarms.onAlarm.addListener(alarm => { if (alarm.name === "seege-maintenance") { flushAll(); enforceLocalRetention().catch(error => console.warn("Local retention check failed:", error.message)); updateScheduledSessions().catch(error => console.warn("Session lifecycle check failed:", error.message)); finishLongTeacherDeparture().catch(error => console.warn("Teacher departure check failed:", error.message)); enforceRetention().catch(error => console.warn("Retention check failed:", error.message)); } });

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    await auth.authStateReady();
    switch (message.type) {
      case "signin": {
        const user = await signIn();
        return { user: { email: user.email, uid: user.uid } };
      }
      case "signout": await doSignOut(); return { ok: true };
      case "whoami": {
        const user = auth.currentUser;
        return { user: user ? { email: user.email, uid: user.uid } : null };
      }
      case "checkSession": return await checkSession(message.meetCode);
      case "saveStudent": await persistStudent(message.sessionId, message.state); return { ok: true };
      case "teacherLeft": await teacherLeft(message.sessionId, message.meetCode); return { ok: true };
      case "teacherReturned": await teacherReturned(message.sessionId, message.meetCode); return { ok: true };
      case "sendReport": return await sendReport(message.report);
      case "requestDeletion": {
        const user = auth.currentUser;
        if (!user?.email) throw new Error("Sign in before requesting deletion.");
        const email = user.email.toLowerCase();
        const sessionId = String(message.sessionId ?? "");
        const lastSessionKey = `lastSession:${email}`;
        const lastSession = (await chrome.storage.local.get(lastSessionKey))[lastSessionKey];
        if (!sessionId || lastSession !== sessionId) throw new Error("Deletion requests are available only for your latest tracked session.");
        await studentSyncLanes.get(sessionId)?.catch(() => {});
        const id = `${message.sessionId}_${user.uid}`;
        await setDoc(doc(db, "sessions", message.sessionId, "deletionRequests", id), {
          sessionId: message.sessionId, email, uid: user.uid,
          status: "pending", createdAt: serverTimestamp(),
        });
        const local = await chrome.storage.local.get(null);
        const cacheKeys = Object.entries(local)
          .filter(([key, value]) => key.startsWith(`cachedSession:${email}:`) && value?.sessionId === sessionId)
          .map(([key]) => key);
        await chrome.storage.local.set({ [`deletionRequested:${email}:${sessionId}`]: Date.now() });
        await chrome.storage.local.remove([`seege:${sessionId}`, `${QUEUE_PREFIX}${sessionId}`, lastSessionKey, ...cacheKeys]);
        return { ok: true };
      }
      default: throw new Error("Unknown SEEge request.");
    }
  })().then(sendResponse).catch(error => sendResponse({ error: error.message || "Unexpected SEEge error." }));
  return true;
});
