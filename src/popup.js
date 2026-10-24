const $ = id => document.getElementById(id);
const send = type => chrome.runtime.sendMessage({ type });
const CONSENT_VERSION = "2026-10-23-v1";

async function render() {
  const result = await send("whoami");
  if (result?.error) throw new Error(result.error);
  const user = result.user;
  const button = $("authButton");
  const setup = $("setup");
  const deletion = $("deleteRequest");
  if (!user) {
    $("status").textContent = "Sign in once with Google to set up SEEge.";
    button.hidden = false;
    button.textContent = "Sign in with Google";
    button.onclick = async () => {
      button.disabled = true;
      try {
        const response = await send("signin");
        if (response?.error) throw new Error(response.error);
        await render();
      }
      catch (error) { $("status").textContent = error.message; button.disabled = false; }
    };
    setup.hidden = true;
    deletion.hidden = true;
    return;
  }
  const key = `profile:${user.email.toLowerCase()}`;
  const values = await chrome.storage.local.get([key, `lastSession:${user.email.toLowerCase()}`]);
  const profile = values[key];
  $("status").textContent = `Signed in as ${user.email}`;
  button.hidden = false;
  button.className = "secondary";
  button.textContent = "Sign out";
  button.onclick = async () => {
    button.disabled = true;
    try {
      const response = await send("signout");
      if (response?.error) throw new Error(response.error);
      await render();
    }
    catch (error) { $("status").textContent = error.message; button.disabled = false; }
  };
  setup.hidden = !!(profile?.consentAt && profile?.name);
  if (profile?.name) $("realName").value = profile.name;
  deletion.hidden = !values[`lastSession:${user.email.toLowerCase()}`];
  deletion.onclick = async () => {
    deletion.disabled = true;
    try {
      const response = await chrome.runtime.sendMessage({ type: "requestDeletion", sessionId: values[`lastSession:${user.email.toLowerCase()}`] });
      if (response?.error) throw new Error(response.error);
      deletion.textContent = "Request sent. Local session data cleared; monitoring stopped for this class.";
    } catch (error) { $("status").textContent = error.message; deletion.disabled = false; }
  };
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
  $("status").textContent = "Consent and name saved. SEEge will track only when you join an active monitored class.";
  await render();
});

render().catch(error => { $("status").textContent = `SEEge could not load: ${error.message}`; });
