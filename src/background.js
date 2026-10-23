
import { auth } from "./firebase.js";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut
} from "firebase/auth/web-extension";

function getToken(interactive) {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive }, (token) => {
      if (chrome.runtime.lastError || !token) {
        reject(
          new Error(
            chrome.runtime.lastError?.message || "No Google access token received."
          )
        );
      } else {
        resolve(token);
      }
    });
  });
}

async function signIn() {
  const token = await getToken(true);
  const credential = GoogleAuthProvider.credential(null, token);
  const result = await signInWithCredential(auth, credential);

  return {
    email: result.user.email,
    uid: result.user.uid
  };
}

async function doSignOut() {
  try {
    const token = await getToken(false);
    await new Promise((resolve, reject) => {
      chrome.identity.removeCachedAuthToken({ token }, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  } catch {
    // Continue signing out even if no cached token is available.
  }

  await signOut(auth);
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    try {
      await auth.authStateReady();

      if (message.type === "signin") {
        const user = await signIn();
        sendResponse({ user });
      } else if (message.type === "signout") {
        await doSignOut();
        sendResponse({ ok: true });
      } else if (message.type === "whoami") {
        const user = auth.currentUser;

        sendResponse({
          user: user
            ? { email: user.email, uid: user.uid }
            : null
        });
      } else {
        sendResponse({ error: "Unknown message type." });
      }
    } catch (error) {
      sendResponse({
        error: error?.message || "An unexpected authentication error occurred."
      });
    }
  })();

  return true;
});
