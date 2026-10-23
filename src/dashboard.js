import { app, auth } from "./firebase.js";
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  collection,
  Timestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

const db = getFirestore(app);


const $ = (id) => document.getElementById(id);

function parseCode(value) {
  return value.toLowerCase().match(/[a-z]{3}-[a-z]{4}-[a-z]{3}/)?.[0];
}

async function init() {
  try {
    await auth.authStateReady();

    const user = auth.currentUser;

    if (!user || !user.email) {
      $("msg").textContent =
        "Not signed in. Sign in through the SEEge popup, then reload this page.";
      return;
    }

    const email = user.email.toLowerCase();
    const teacherDoc = await getDoc(doc(db, "teachers", email));

    if (!teacherDoc.exists()) {
      $("msg").textContent = `${email} is not in the teacher list.`;
      return;
    }

    $("msg").hidden = true;
    $("app").hidden = false;
    $("who").textContent = email;

    $("form").addEventListener("submit", async (event) => {
      event.preventDefault();

      const code = parseCode($("meet").value.trim());

      if (!code) {
        alert("Enter a valid Google Meet code, such as abc-defg-hij.");
        return;
      }

      const className = $("className").value.trim();
      const start = new Date($("start").value);
      const end = new Date($("end").value);

      if (!className) {
        alert("Enter a class name.");
        return;
      }

      if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime()) ||
        end <= start
      ) {
        alert("The scheduled end must be later than the scheduled start.");
        return;
      }

      try {
        await addDoc(collection(db, "sessions"), {
          className,
          meetCodes: [code],
          scheduledStart: Timestamp.fromDate(start),
          scheduledEnd: Timestamp.fromDate(end),
          actualEnd: null,
          teacherEmail: email,
          status: "live",
          thresholds: {
            presentPct: 75,
            lateMinutes: 10,
          },
          createdAt: Timestamp.now(),
        });

        $("form").reset();
      } catch (error) {
        console.error("Could not create session:", error);
        alert("Could not create session: " + error.message);
      }
    });

    const sessionsQuery = query(
      collection(db, "sessions"),
      where("teacherEmail", "==", email)
    );

    onSnapshot(
      sessionsQuery,
      (snapshot) => {
        const rows = $("rows");
        rows.replaceChildren();

        const sessions = snapshot.docs
          .map((item) => item.data())
          .sort(
            (a, b) =>
              b.scheduledStart.seconds - a.scheduledStart.seconds
          );

        for (const session of sessions) {
          const row = document.createElement("tr");

          for (const value of [
            session.className,
            (session.meetCodes ?? []).join(", "),
            session.scheduledStart.toDate().toLocaleString(),
            session.status,
          ]) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
          }

          rows.appendChild(row);
        }
      },
      (error) => {
        console.error("Could not load sessions:", error);
        $("msg").hidden = false;
        $("msg").textContent = "Could not load sessions: " + error.message;
      }
    );
  } catch (error) {
    console.error("Dashboard initialization failed:", error);
    $("msg").textContent = "Dashboard error: " + error.message;
  }
}

init();
