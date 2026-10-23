
import { app, auth } from "./firebase.js";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from "firebase/auth/web-extension";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore/lite";

const db = getFirestore(app);

// ---------- sign in / out ----------
function getToken(interactive) {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive }, (token) => {
      if (chrome.runtime.lastError || !token) {
        reject(
          new Error(chrome.runtime.lastError?.message || "No token")
        );
      } else {
        resolve(token);
      }
    });
  });
}

async function signIn() {
  const token = await getToken(true);
  const cred = GoogleAuthProvider.credential(null, token);
  const result = await signInWithCredential(auth, cred);
  return result.user;
}

async function doSignOut() {
  try {
    const token = await getToken(false);
    await chrome.identity.removeCachedToken({ token });
  } catch (e) {
    // No cached token, fine.
  }

  await signOut(auth);
}

// ---------- session check ----------

async function checkSession(meetCode) {
  const user = auth.currentUser;

  if (!user) return { status: "signed_out" };

  const email = user.email.toLowerCase();
  console.log("[SEEge bg] signed in as", email, "uid:", user.uid);

  // Call 1: Check whether this person is a teacher.
  let teacherDoc;

  try {
    teacherDoc = await getDoc(doc(db, "teachers", email));
  } catch (error) {
    throw new Error("TEACHERS READ failed: " + error.message);
  }

  if (teacherDoc.exists()) {
    return { status: "teacher", email };
  }

  // Call 2: Find sessions matching this Meet code.
  let snapshot;

  try {
    const sessionsQuery = query(
      collection(db, "sessions"),
      where("meetCodes", "array-contains", meetCode),
      where("status", "==", "live")
    );

    snapshot = await getDocs(sessionsQuery);
  } catch (error) {
    throw new Error("SESSIONS QUERY failed: " + error.message);
  }

  const liveSessions = snapshot.docs
    .filter((item) => item.data().status === "live")
    .sort(
      (a, b) =>
        b.data().scheduledStart.toMillis() -
        a.data().scheduledStart.toMillis()
    );

  if (liveSessions.length === 0) {
    return { status: "no_session", email };
  }

  const sessionDoc = liveSessions[0];
  const session = sessionDoc.data();

  return {
    status: "active",
    email,
    sessionId: sessionDoc.id,
    className: session.className,
    scheduledStart: session.scheduledStart.toMillis(),
    scheduledEnd: session.scheduledEnd.toMillis(),
  };
}

// ---------- save student data ----------
async function saveStudent(sessionId, state) {
  const user = auth.currentUser;

  if (!user) throw new Error("Not signed in");

  const email = user.email.toLowerCase();

  await setDoc(
    doc(db, "sessions", sessionId, "students", email),
    {
      name: user.displayName || email,
      visits: state.visits,
      awayCount: state.awayCount,
      awaySeconds: state.awaySeconds,
      lastHeartbeat: serverTimestamp(),
      extensionVersion: chrome.runtime.getManifest().version,
    },
    { merge: true }
  );
}

// ---------- message router ----------
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    try {
      await auth.authStateReady();

      if (msg.type === "signin") {
        const user = await signIn();

        sendResponse({
          user: { email: user.email, uid: user.uid },
        });
      } else if (msg.type === "signout") {
        await doSignOut();
        sendResponse({ ok: true });
      } else if (msg.type === "whoami") {
        const user = auth.currentUser;

        sendResponse({
          user: user
            ? { email: user.email, uid: user.uid }
            : null,
        });
      } else if (msg.type === "checkSession") {
        sendResponse(await checkSession(msg.meetCode));
      } else if (msg.type === "saveStudent") {
        await saveStudent(msg.sessionId, msg.state);
        sendResponse({ ok: true });
      }
    } catch (error) {
      sendResponse({ error: error.message });
    }
  })();

  return true;
});
