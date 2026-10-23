(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // src/content.js
  var require_content = __commonJS({
    "src/content.js"() {
      var CFG = {
        leaveBtn: 'button[aria-label="Leave call"]',
        awayMinMs: 3e3,
        tickMs: 1e3
      };
      var log = (...a) => console.log("[SEEge]", ...a);
      var meetCode = location.pathname.match(/\/([a-z]{3}-[a-z]{4}-[a-z]{3})\/?$/)?.[1];
      if (meetCode) {
        let save2 = function() {
          chrome.storage.local.set({ [KEY]: { visits, awayCount, awaySeconds } });
        }, checkAway2 = function() {
          if (!inMeeting) return;
          const now = Date.now();
          const away = document.hidden || !document.hasFocus();
          if (away && awayStart === null) {
            awayStart = now;
          } else if (!away && awayStart !== null) {
            closeAway2(now);
          }
        }, closeAway2 = function(now) {
          const dur = now - awayStart;
          awayStart = null;
          if (dur >= CFG.awayMinMs) {
            awayCount++;
            awaySeconds += Math.round(dur / 1e3);
            log(`AWAY ended. Lasted ${Math.round(dur / 1e3)}s | count=${awayCount} | total=${awaySeconds}s`);
            save2();
          }
        }, onJoin2 = function() {
          inMeeting = true;
          visitStart = Date.now();
          log("JOIN at", fmt(visitStart));
          checkAway2();
        }, onLeave2 = function() {
          if (!inMeeting) return;
          const now = Date.now();
          if (awayStart !== null) closeAway2(now);
          visits.push({ join: visitStart, leave: now });
          inMeeting = false;
          save2();
          log("LEAVE at", fmt(now), "| visits:", visits.length, "| rejoins:", visits.length - 1);
        };
        save = save2, checkAway = checkAway2, closeAway = closeAway2, onJoin = onJoin2, onLeave = onLeave2;
        log("Meet page detected, code:", meetCode);
        const KEY = "seege:" + meetCode;
        let inMeeting = false;
        let visitStart = null;
        const visits = [];
        let awayStart = null;
        let awayCount = 0;
        let awaySeconds = 0;
        const fmt = (t) => new Date(t).toLocaleTimeString();
        chrome.storage.local.get(KEY, (res) => {
          const s = res[KEY];
          if (s) {
            visits.push(...s.visits);
            awayCount = s.awayCount;
            awaySeconds = s.awaySeconds;
            log(`Restored: visits=${visits.length}, awayCount=${awayCount}, awaySeconds=${awaySeconds}`);
          }
        });
        document.addEventListener("visibilitychange", checkAway2);
        window.addEventListener("blur", checkAway2);
        window.addEventListener("focus", checkAway2);
        window.addEventListener("pagehide", onLeave2);
        setInterval(() => {
          const joined = !!document.querySelector(CFG.leaveBtn);
          if (joined && !inMeeting) onJoin2();
          if (!joined && inMeeting) onLeave2();
          checkAway2();
        }, CFG.tickMs);
      }
      var save;
      var checkAway;
      var closeAway;
      var onJoin;
      var onLeave;
    }
  });
  require_content();
})();
