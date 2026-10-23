(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // src/popup.js
  var require_popup = __commonJS({
    "src/popup.js"() {
      var statusEl = document.getElementById("status");
      var btn = document.getElementById("btn");
      var send = (type) => chrome.runtime.sendMessage({ type });
      function render(user) {
        btn.hidden = false;
        btn.disabled = false;
        if (user) {
          statusEl.textContent = `Signed in as ${user.email}`;
          btn.textContent = "Sign out";
          btn.onclick = async () => {
            btn.disabled = true;
            statusEl.textContent = "Signing out...";
            try {
              const result = await send("signout");
              if (result.error) {
                throw new Error(result.error);
              }
              render(null);
            } catch (error) {
              statusEl.textContent = `Error: ${error.message}`;
              btn.disabled = false;
            }
          };
        } else {
          statusEl.textContent = "Not signed in";
          btn.textContent = "Sign in with Google";
          btn.onclick = async () => {
            btn.disabled = true;
            statusEl.textContent = "Signing in...";
            try {
              const result = await send("signin");
              if (result.error) {
                throw new Error(result.error);
              }
              render(result.user);
            } catch (error) {
              statusEl.textContent = `Error: ${error.message}`;
              btn.disabled = false;
            }
          };
        }
      }
      send("whoami").then((result) => {
        if (result.error) {
          throw new Error(result.error);
        }
        render(result.user);
      }).catch((error) => {
        statusEl.textContent = `Error: ${error.message}`;
      });
    }
  });
  require_popup();
})();
