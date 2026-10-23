// ===== SEEge spike: content.js (v0.1.1) =====

const CFG = {
  leaveBtn: 'button[aria-label="Leave call"]',
  awayMinMs: 3000,
  tickMs: 1000,
};

const log = (...a) => console.log("[SEEge]", ...a);

const meetCode = location.pathname
  .match(/\/([a-z]{3}-[a-z]{4}-[a-z]{3})\/?$/)?.[1];

if (meetCode) {
  log("Meet page detected, code:", meetCode);

  const KEY = "seege:" + meetCode;   // one saved record per meeting code
  let inMeeting = false;
  let visitStart = null;
  const visits = [];                 // [{join, leave}]
  let awayStart = null;
  let awayCount = 0;
  let awaySeconds = 0;

  const fmt = (t) => new Date(t).toLocaleTimeString();

  // Save state so a page reload doesn't wipe it
  function save() {
    chrome.storage.local.set({ [KEY]: { visits, awayCount, awaySeconds } });
  }

  // Restore state from earlier page loads of this same meeting
  chrome.storage.local.get(KEY, (res) => {
    const s = res[KEY];
    if (s) {
      visits.push(...s.visits);
      awayCount = s.awayCount;
      awaySeconds = s.awaySeconds;
      log(`Restored: visits=${visits.length}, awayCount=${awayCount}, awaySeconds=${awaySeconds}`);
    }
  });

  function checkAway() {
    if (!inMeeting) return;
    const now = Date.now();
    const away = document.hidden || !document.hasFocus();
    if (away && awayStart === null) {
      awayStart = now;
    } else if (!away && awayStart !== null) {
      closeAway(now);
    }
  }

  function closeAway(now) {
    const dur = now - awayStart;
    awayStart = null;
    if (dur >= CFG.awayMinMs) {
      awayCount++;
      awaySeconds += Math.round(dur / 1000);
      log(`AWAY ended. Lasted ${Math.round(dur / 1000)}s | count=${awayCount} | total=${awaySeconds}s`);
      save();
    }
  }

  function onJoin() {
    inMeeting = true;
    visitStart = Date.now();
    log("JOIN at", fmt(visitStart));
    checkAway();
  }

  function onLeave() {
    if (!inMeeting) return;
    const now = Date.now();
    if (awayStart !== null) closeAway(now);
    visits.push({ join: visitStart, leave: now });
    inMeeting = false;
    save();
    log("LEAVE at", fmt(now), "| visits:", visits.length, "| rejoins:", visits.length - 1);
  }

  document.addEventListener("visibilitychange", checkAway);
  window.addEventListener("blur", checkAway);
  window.addEventListener("focus", checkAway);
  window.addEventListener("pagehide", onLeave);

  setInterval(() => {
    const joined = !!document.querySelector(CFG.leaveBtn);
    if (joined && !inMeeting) onJoin();
    if (!joined && inMeeting) onLeave();
    checkAway();
  }, CFG.tickMs);
}