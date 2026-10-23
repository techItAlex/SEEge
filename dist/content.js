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
        tickMs: 1e3,
        heartbeatMs: 6e4,
        recheckMs: 6e4
      };
      var log = (...args) => console.log("[SEEge]", ...args);
      var fmt = (time) => new Date(time).toLocaleTimeString();
      var meetCode = location.pathname.match(/\/([a-z]{3}-[a-z]{4}-[a-z]{3})\/?$/)?.[1];
      function ask(msg) {
        return new Promise((resolve) => {
          try {
            chrome.runtime.sendMessage(msg, (res) => {
              if (chrome.runtime.lastError) {
                resolve({ error: chrome.runtime.lastError.message });
              } else {
                resolve(res || { error: "No response" });
              }
            });
          } catch (error) {
            resolve({ error: error.message });
          }
        });
      }
      function showBanner() {
        if (document.getElementById("seege-banner")) return;
        const banner = document.createElement("div");
        banner.id = "seege-banner";
        banner.textContent = "Your activity in this class is being monitored.";
        banner.style.cssText = "position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:2147483647;background:rgba(32,33,36,.92);color:#fff;font:12px system-ui,sans-serif;padding:5px 12px;border-radius:999px;pointer-events:none;";
        document.documentElement.appendChild(banner);
      }
      async function startTracking(session) {
        const KEY = "seege:" + session.sessionId;
        let inMeeting = false;
        let visitStart = null;
        let visits = [];
        let awayStart = null;
        let awayCount = 0;
        let awaySeconds = 0;
        const stored = (await chrome.storage.local.get(KEY))[KEY];
        if (stored) {
          visits = stored.visits;
          awayCount = stored.awayCount;
          awaySeconds = stored.awaySeconds;
          log(
            `Restored: visits=${visits.length}, awayCount=${awayCount}, awaySeconds=${awaySeconds}`
          );
        }
        const saveLocal = () => {
          try {
            chrome.storage.local.set({
              [KEY]: { visits, awayCount, awaySeconds }
            });
          } catch (error) {
            log("Local save failed:", error);
          }
        };
        const snapshot = () => ({
          visits: inMeeting ? [...visits, { join: visitStart, leave: null }] : [...visits],
          awayCount,
          awaySeconds
        });
        async function sync(reason) {
          const result = await ask({
            type: "saveStudent",
            sessionId: session.sessionId,
            state: snapshot()
          });
          if (result.error) {
            log("Sync FAILED (" + reason + "):", result.error);
          } else {
            log("Synced (" + reason + ")");
          }
        }
        function closeAway(now) {
          const duration = now - awayStart;
          awayStart = null;
          if (duration >= CFG.awayMinMs) {
            awayCount++;
            awaySeconds += Math.round(duration / 1e3);
            log(
              `AWAY ended. Lasted ${Math.round(duration / 1e3)}s | count=${awayCount} | total=${awaySeconds}s`
            );
            saveLocal();
          }
        }
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
        function onJoin() {
          inMeeting = true;
          visitStart = Date.now();
          log("JOIN at", fmt(visitStart));
          checkAway();
          sync("join");
        }
        function onLeave() {
          if (!inMeeting) return;
          const now = Date.now();
          if (awayStart !== null) closeAway(now);
          visits.push({ join: visitStart, leave: now });
          inMeeting = false;
          saveLocal();
          log(
            "LEAVE at",
            fmt(now),
            "| visits:",
            visits.length,
            "| rejoins:",
            visits.length - 1
          );
          sync("leave");
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
        setInterval(() => {
          if (inMeeting) sync("heartbeat");
        }, CFG.heartbeatMs);
      }
      async function main() {
        const result = await ask({
          type: "checkSession",
          meetCode
        });
        if (result.status === "active") {
          log("Tracking session:", result.className);
          showBanner();
          await startTracking(result);
          return;
        }
        log("Not tracking:", result.status || result.error);
        if (result.status !== "teacher") {
          setTimeout(main, CFG.recheckMs);
        }
      }
      if (meetCode) {
        log("Meet page detected, code:", meetCode);
        main();
      }
    }
  });
  require_content();
})();
