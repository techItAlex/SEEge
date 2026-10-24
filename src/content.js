import { shouldRetrySessionCheck } from "./domain.mjs";

const CFG = { leaveButton: 'button[aria-label="Leave call"]', awayMinMs: 3000, pollMs: 1000, heartbeatMs: 60000, recheckMs: 60000 };
const meetCode = location.pathname.match(/\/([a-z]{3}-[a-z]{4}-[a-z]{3})\/?$/)?.[1];
const ask = message => new Promise(resolve => {
  try { chrome.runtime.sendMessage(message, response => resolve(chrome.runtime.lastError ? { error: chrome.runtime.lastError.message } : response || { error: "No response" })); }
  catch (error) { resolve({ error: error.message }); }
});

function showBanner() {
  if (document.getElementById("seege-banner")) return;
  const banner = document.createElement("div");
  banner.id = "seege-banner";
  banner.textContent = "Your activity in this class is being monitored.";
  banner.style.cssText = "position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:2147483647;background:rgba(32,33,36,.92);color:#fff;font:12px system-ui,sans-serif;padding:5px 12px;border-radius:999px;pointer-events:none";
  document.documentElement.appendChild(banner);
}

function safeMatches(element, selector) {
  if (!selector || !element?.closest) return false;
  try { return !!element.closest(selector); } catch { return false; }
}

async function startTracking(session) {
  const key = `seege:${session.sessionId}`;
  const deletionKey = `deletionRequested:${session.email}:${session.sessionId}`;
  const restored = (await chrome.storage.local.get(key))[key] ?? {};
  let visits = Array.isArray(restored.visits) ? restored.visits : [];
  let awayPeriods = Array.isArray(restored.awayPeriods) ? restored.awayPeriods : [];
  let awayCount = Number(restored.awayCount) || 0;
  let awaySeconds = Number(restored.awaySeconds) || 0;
  let chatCount = Number(restored.chatCount) || 0;
  let reactionCount = Number(restored.reactionCount) || 0;
  let micOpens = Number(restored.micOpens) || 0;
  let micUnmutedSeconds = Number(restored.micUnmutedSeconds) || 0;
  let lastHeartbeat = Number(restored.lastHeartbeat) || 0;
  let inMeeting = false;
  let currentlyAway = false;
  let visitStart = null;
  let awayStart = null;
  let micUnmuted = false;
  let micStart = null;
  let stopTracking = false;
  let pollTimer = null;
  let heartbeatTimer = null;
  let sessionCheckTimer = null;
  function stopForDeletion() {
    stopTracking = true;
    inMeeting = false;
    visitStart = null;
    awayStart = null;
    micUnmuted = false;
    micStart = null;
    document.getElementById("seege-banner")?.remove();
    clearInterval(pollTimer); clearInterval(heartbeatTimer); clearInterval(sessionCheckTimer);
    chrome.storage.onChanged.removeListener(onStorageChanged);
    chrome.storage.local.remove(key);
  }
  const onStorageChanged = (changes, area) => {
    if (area === "local" && changes[deletionKey]?.newValue) stopForDeletion();
  };
  chrome.storage.onChanged.addListener(onStorageChanged);
  const config = session.selectors ?? {};
  const signalAvailability = { chat: false, reactions: false, mic: false };
  function refreshSignalAvailability() {
    const exists = selector => {
      try { return !!selector && !!document.querySelector(selector); } catch { return false; }
    };
    signalAvailability.chat ||= exists(config.chatSendSelector);
    signalAvailability.reactions ||= (config.reactionSelectors ?? []).some(exists);
    signalAvailability.mic ||= exists(config.microphoneSelector);
  }

  if (restored.openJoin != null) {
    const currentlyJoined = !!document.querySelector(CFG.leaveButton);
    if (currentlyJoined && (!lastHeartbeat || Date.now() - lastHeartbeat <= 90_000)) {
      inMeeting = true;
      visitStart = Number(restored.openJoin);
    } else {
      const estimatedLeave = lastHeartbeat ? lastHeartbeat + 90_000 : Date.now();
      if (estimatedLeave > Number(restored.openJoin)) visits.push({ join: Number(restored.openJoin), leave: estimatedLeave });
    }
  }

  const snapshot = () => ({
    visits: inMeeting ? [...visits, { join: visitStart, leave: null }] : [...visits],
    awayCount, awaySeconds, awayPeriods: awayStart == null ? [...awayPeriods] : [...awayPeriods, { start: awayStart, end: Date.now() }],
    currentlyAway: inMeeting && currentlyAway,
    chatCount, reactionCount, micOpens,
    micUnmutedSeconds: micUnmuted ? micUnmutedSeconds + Math.max(0, Math.round((Date.now() - micStart) / 1000)) : micUnmutedSeconds,
    signalAvailability,
  });
  async function persist(reason) {
    lastHeartbeat = Date.now();
    const state = snapshot();
    await chrome.storage.local.set({ [key]: { ...state, openJoin: inMeeting ? visitStart : null, lastHeartbeat } });
    const result = await ask({ type: "saveStudent", sessionId: session.sessionId, state });
    if (result?.error?.startsWith("TRACKING_STOPPED:")) {
      stopTracking = true;
      const now = Date.now();
      closeAway(now);
      if (inMeeting && visitStart != null) visits.push({ join: visitStart, leave: now });
      inMeeting = false; visitStart = null;
      document.getElementById("seege-banner")?.remove();
      clearInterval(pollTimer); clearInterval(heartbeatTimer);
      clearInterval(sessionCheckTimer);
      chrome.storage.onChanged.removeListener(onStorageChanged);
      if (result.error.includes("deletion was requested")) stopForDeletion();
      else await chrome.storage.local.set({ [key]: { ...snapshot(), openJoin: null, lastHeartbeat: now } });
    } else if (result?.error) console.warn(`[SEEge] Sync pending (${reason}):`, result.error);
  }
  function closeAway(now) {
    if (awayStart == null) return;
    const start = awayStart;
    const duration = now - start;
    awayStart = null;
    if (duration >= CFG.awayMinMs) { awayCount++; awaySeconds += Math.round(duration / 1000); awayPeriods.push({ start, end: now }); }
  }
  function setMicState(now) {
    if (!signalAvailability.mic) return;
    let button;
    try { button = document.querySelector(config.microphoneSelector); } catch { return; }
    if (!button) return;
    const label = `${button.getAttribute("aria-label") || ""} ${button.getAttribute("data-is-muted") || ""}`.toLowerCase();
    const isOpen = /turn off microphone|mute microphone|unmute=false|data-is-muted=["']?false/.test(label);
    if (isOpen && !micUnmuted) { micUnmuted = true; micStart = now; micOpens++; }
    else if (!isOpen && micUnmuted) { micUnmutedSeconds += Math.max(0, Math.round((now - micStart) / 1000)); micUnmuted = false; micStart = null; }
  }
  function checkAway() {
    if (!inMeeting || stopTracking) return;
    const now = Date.now();
    const away = document.hidden || !document.hasFocus();
    const endedAwayPeriod = !away && awayStart != null;
    currentlyAway = away;
    if (away && awayStart == null) awayStart = now;
    else if (endedAwayPeriod) { closeAway(now); persist("focus-return"); }
  }
  async function leave() {
    if (!inMeeting) return;
    const now = Date.now();
    closeAway(now);
    if (micUnmuted) { micUnmutedSeconds += Math.max(0, Math.round((now - micStart) / 1000)); micUnmuted = false; micStart = null; }
    visits.push({ join: visitStart, leave: now });
    inMeeting = false;
    visitStart = null;
    await persist("leave");
  }
  function join() {
    inMeeting = true;
    visitStart = Date.now();
    checkAway();
    persist("join");
  }

  document.addEventListener("visibilitychange", checkAway);
  window.addEventListener("blur", checkAway);
  window.addEventListener("focus", checkAway);
  window.addEventListener("pagehide", leave);
  document.addEventListener("click", event => {
    if (!inMeeting) return;
    const target = event.target;
    if (safeMatches(target, config.chatSendSelector)) chatCount++;
    if ((config.reactionSelectors ?? []).some(selector => safeMatches(target, selector))) reactionCount++;
    if (safeMatches(target, config.microphoneSelector)) setTimeout(() => setMicState(Date.now()), 0);
  }, true);
  pollTimer = setInterval(() => {
    if (stopTracking) return;
    const now = Date.now();
    refreshSignalAvailability();
    if (now >= session.scheduledEnd) { leave(); stopTracking = true; clearInterval(pollTimer); clearInterval(heartbeatTimer); document.getElementById("seege-banner")?.remove(); return; }
    const joined = !!document.querySelector(CFG.leaveButton);
    if (joined && !inMeeting) join();
    if (!joined && inMeeting) leave();
    if (inMeeting) { checkAway(); setMicState(now); }
  }, CFG.pollMs);
  heartbeatTimer = setInterval(() => { if (inMeeting && !stopTracking) persist("heartbeat"); }, CFG.heartbeatMs);
  sessionCheckTimer = setInterval(async () => {
    if (stopTracking) return;
    try {
      const latest = await ask({ type: "checkSession", meetCode });
      if (latest?.error || !shouldRetrySessionCheck(latest?.status)) return;
      stopTracking = true;
      clearInterval(pollTimer); clearInterval(heartbeatTimer); clearInterval(sessionCheckTimer);
      document.getElementById("seege-banner")?.remove();
      if (inMeeting) await leave();
      else await chrome.storage.local.set({ [key]: { ...snapshot(), openJoin: null, lastHeartbeat: Date.now() } });
    } catch { /* Preserve buffered state through network loss; retry at the next check. */ }
  }, CFG.recheckMs);
  if (document.querySelector(CFG.leaveButton) && !inMeeting) join();
}

async function monitorTeacher(sessionId) {
  let joined = false;
  window.addEventListener("pagehide", () => { if (joined) ask({ type: "teacherLeft", sessionId, meetCode }); });
  setInterval(() => {
    const nowJoined = !!document.querySelector(CFG.leaveButton);
    if (nowJoined && !joined) ask({ type: "teacherReturned", sessionId, meetCode });
    if (!nowJoined && joined) ask({ type: "teacherLeft", sessionId, meetCode });
    joined = nowJoined;
  }, CFG.pollMs);
}

async function main() {
  const result = await ask({ type: "checkSession", meetCode });
  if (result.status === "active") { showBanner(); await startTracking(result); return; }
  if (result.status === "teacher_active") { await monitorTeacher(result.sessionId); return; }
  if (shouldRetrySessionCheck(result.status) || result.error) {
    setTimeout(main, CFG.recheckMs);
  }
}

if (meetCode) main().catch(error => console.warn("[SEEge] Could not start monitoring:", error.message));
