const $ = id => document.getElementById(id);
const send = type => chrome.runtime.sendMessage({ type });
const CONSENT_VERSION = "2026-10-23-v1";

function setStatus(message, isError = false) {
  $("status").textContent = message;
  $("status").classList.toggle("error", isError);
}

function setSteps(states) {
  states.forEach((state, index) => { $(`step${index + 1}`).dataset.state = state; });
}

// The privacy details sit open on the full-page layout and collapsed in the small popup.
$("privacy").open = window.matchMedia("(min-width: 760px)").matches;

async function render() {
  const result = await send("whoami");
  if (result?.error) throw new Error(result.error);
  const user = result.user;
  const button = $("authButton");
  const setup = $("setup");
  const deletion = $("deleteRequest");
  button.hidden = false;
  button.disabled = false;

  if (!user) {
    setSteps(["current", "todo", "todo"]);
    $("stepEmail").textContent = "SEEge uses your Google email to match you to a class roster.";
    $("stepName").hidden = true;
    button.classList.remove("signed-in");
    $("authLabel").textContent = "Continue with Google";
    button.onclick = async () => {
      button.disabled = true;
      setStatus("Opening Google sign-in…");
      try {
        const response = await send("signin");
        if (response?.error) throw new Error(response.error);
        setStatus("");
        await render();
      }
      catch (error) { setStatus(error.message, true); button.disabled = false; }
    };
    setup.hidden = true;
    deletion.hidden = true;
    setStatus("");
    return;
  }

  const email = user.email.toLowerCase();
  const key = `profile:${email}`;
  const values = await chrome.storage.local.get([key, `lastSession:${email}`]);
  const profile = values[key];
  const consented = !!(profile?.consentAt && profile?.name);

  const emailLine = $("stepEmail");
  emailLine.replaceChildren("Signed in as ", Object.assign(document.createElement("span"), { className: "email", textContent: user.email }));
  button.classList.add("signed-in");
  $("authLabel").textContent = "Sign out";
  button.onclick = async () => {
    button.disabled = true;
    try {
      const response = await send("signout");
      if (response?.error) throw new Error(response.error);
      setStatus("");
      await render();
    }
    catch (error) { setStatus(error.message, true); button.disabled = false; }
  };

  setSteps(consented ? ["done", "done", "current"] : ["done", "current", "todo"]);
  setup.hidden = consented;
  $("stepName").hidden = !consented;
  if (consented) $("stepName").textContent = `Saved as ${profile.name}. You can sign out and back in to change it.`;
  if (profile?.name) $("realName").value = profile.name;

  deletion.hidden = !values[`lastSession:${email}`];
  deletion.onclick = async () => {
    deletion.disabled = true;
    try {
      const response = await chrome.runtime.sendMessage({ type: "requestDeletion", sessionId: values[`lastSession:${email}`] });
      if (response?.error) throw new Error(response.error);
      deletion.textContent = "Request sent. Local session data cleared; monitoring stopped for this class.";
    } catch (error) { setStatus(error.message, true); deletion.disabled = false; }
  };

  setStatus(consented ? "You are set. SEEge tracks only when you join an active class you are rostered in." : "");
}

$("setup").addEventListener("submit", async event => {
  event.preventDefault();
  const result = await send("whoami");
  if (!result.user) return;
  const name = $("realName").value.trim();
  if (!name || !$("consent").checked) return;
  await chrome.storage.local.set({ [`profile:${result.user.email.toLowerCase()}`]: {
    name, consentAt: Date.now(), consentVersion: CONSENT_VERSION,
  } });
  await render();
});

render().catch(error => setStatus(`SEEge could not load: ${error.message}`, true));
