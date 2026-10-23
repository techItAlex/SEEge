
const statusEl = document.getElementById("status");
const btn = document.getElementById("btn");

const send = (type) => chrome.runtime.sendMessage({ type });

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

send("whoami")
  .then((result) => {
    if (result.error) {
      throw new Error(result.error);
    }

    render(result.user);
  })
  .catch((error) => {
    statusEl.textContent = `Error: ${error.message}`;
  });
