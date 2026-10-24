# SEEge

SEEge is a Manifest V3 Chrome extension for consent-based Google Meet attendance and activity monitoring. It stores attendance and count-only activity in Firebase Firestore, provides a teacher dashboard, and generates CSV/email reports.

## Local build

```sh
npm ci
npm test
npm run build
```

In Chrome, open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select this repository's `dist/` folder. Keep `dist/` because it is the directly loadable extension build. `npm run build` copies `public/` to `dist/` and bundles `src/` with esbuild.

## Firebase setup

The app uses the existing SEEge Firebase project configuration in `src/firebase.js`. Do not replace it with a different project. In Firebase Console:

1. Enable Google sign-in under Authentication providers and create/enable Cloud Firestore.
2. Create a Firestore document at `teachers/<lowercase-professor-email>`. The extension only checks whether this document exists; the client cannot add teacher allowlist entries.
3. Deploy the checked-in Firestore rules from the project root. With Firebase CLI installed and authenticated, run `firebase deploy --only firestore:rules --project seege-82ab8`. Review the rules and selected Firebase project before deploying.
4. Add the Chrome extension OAuth client ID (already in `public/manifest.json`) to the Google sign-in configuration. Preserve the manifest key and OAuth client ID so the extension identity does not change.
5. The dashboard requests `gmail.send` only when the teacher clicks **Email report** (the student sign-in token remains limited to basic profile/email scopes). The OAuth consent configuration must permit this scope. Gmail's sensitive-scope consent screen and the account's first authorization require a real Google account; test-mode authorization can expire and need reauthorization. The dashboard downloads the CSV and opens a prefilled Gmail draft if the API send fails.

The Chrome extension performs Firestore calls from its extension origin. Its API host permissions are listed in the manifest. Do not broaden them unless the Firebase SDK requires it and the reason is reviewed.

## Teacher workflow

1. Sign in from the extension popup, enter the teacher's real name, and acknowledge the same first-run data notice.
2. Open the dashboard. Create a session with class name, one or more comma-separated Meet codes, scheduled times, thresholds, and a roster CSV with `name,email` columns. The teacher must confirm that students have been informed.
3. The roster is matched by normalized Google email. Students must install SEEge, sign in, enter their real name, and consent before they are tracked.
4. Select a session to see live metrics. End it manually, or leave it open for schedule end / teacher final-departure handling. Correct the actual end time if needed.
5. Download the full CSV or email the report to the signed-in teacher account. If Gmail authorization or sending fails, attach the downloaded CSV to the opened draft.

## Meet participation selectors

The teacher dashboard can save CSS selectors in `config/meetSelectors`. Meet's DOM is not a supported extension API, so chat-send, reaction, and microphone signals are best-effort. Check selectors against the current Meet interface before using them. A signal is reported available only after its selector matches an element on the Meet page; empty or unmatched selectors are reported as unavailable, and the focus calculation redistributes the participation weight to screen focus. SEEge records counts and durations only; it does not store message contents, audio, or video.

## Security, retention, and limits

`firestore.rules` scopes teacher reads and writes to allowlisted teachers and confines student activity reads/writes to the student's own email document in a live session. Students cannot read another student's activity or alter teacher-owned session/roster documents. Meet-code indexes have a fixed field schema; selector configuration reads/writes are limited to the supported `config/meetSelectors` document with a validated top-level schema. Student payload types, counts, and list sizes are bounded, and the recorded Firebase UID/consent version cannot be changed after record creation. The Firestore Emulator test suite is available with `npm run test:rules`; it must pass against the rules before deployment. **Do not collect real student data until these rules have been deployed to the intended Firebase project.** Client-collected metrics and consent timestamps are not cryptographic proof; a student can alter their own client and their own counts/timestamps.

Session data is set to a 90-day retention period. The extension cleans up expired session, roster, student, code-index, and deletion-request documents while Chrome is running and the owner teacher is signed in. It does not use a server-side scheduler because the project targets Firebase's no-cost plan; therefore Firestore data can remain beyond 90 days if the extension is not run. Local activity buffers and unsent queue entries are also cleaned up by the student's extension after 90 days. A student deletion request clears that session's local buffer and queued upload immediately, stops monitoring for that class, and asks the teacher to delete its Firestore activity and roster entry. It does not remotely clear the student's saved Google email, name, or consent record.

When a rostered student has no activity document, the dashboard reports **No SEEge activity detected**. This does not prove the student did not install the extension; they may not have consented, may not have joined, or may not have synced while online.

Meet does not expose an official in-meeting extension API. Join/leave detection depends on the current Meet button label, and participation signals depend on configured selectors. For call restarts, add each Meet code to the session; when the teacher moves from one code to a different code, measured class intervals exclude the gap. Google Meet, OAuth, Firestore rules deployment, Gmail delivery, Chrome lifecycle behavior, and the 50-student free-tier target require manual integration testing.

## Local verification

Run `npm test` for the offline metric/CSV tests and `npm run build` to generate the extension. See [the requirements status](docs/requirements-status.md) for implemented, locally verified, and external/manual verification status.
