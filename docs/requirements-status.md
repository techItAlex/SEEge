# SEEge PRD coverage and pre-deployment review

Review date: 2026-10-23. Source of truth reviewed: all 12 pages of the attached PRD, draft v2 (2026-10-22), plus the current repository. This status distinguishes code presence from checks actually performed.

Status meanings:
- **Implemented:** corresponding code exists in this checkout.
- **Verified:** the stated local test/check actually passed; it does not imply external integration verification.
- **Blocked/manual:** requires Firebase Emulator/deployment, Chrome, Meet, Google account, Gmail configuration, scale testing, or human policy/legal review.

## Requirement matrix

| PRD section / ID | Implemented | Verified locally | Blocked / manual status |
| --- | --- | --- | --- |
| 3, S1 Google sign-in and real name | Chrome Identity/Firebase Auth; popup saves a name and local consent timestamp/version | Build and static review only; sign-in result errors are surfaced | Authenticate teacher and student accounts in Chrome; verify Google OAuth and Firebase Auth providers |
| S2 active Meet matching and banner | Meet-code lookup, live/scheduled-window/roster checks, monitoring banner | Consent-retry state helper test; build | Exercise with real Meet; extension page selector and identity behavior are not browser-tested |
| S3 heartbeat and disclosed activity metrics | 60-second heartbeat, tab hidden/unfocused time, chat/reaction counts, mic open/unmuted duration | Metric-domain unit tests; build. Participation availability now requires selector match in DOM | Current Meet selectors must be configured and tested; signal counts are best-effort |
| S4 immediate join/leave | Content script detects Meet join/leave and persists event state immediately | Domain tests cover visits and abrupt disconnect calculations, not real events | Verify join/leave/rejoin accuracy within PRD's one-minute tolerance in Meet |
| S5 offline buffer/recovery | Chrome local queue, retry alarm, queue survives worker restarts | Static review/build only | Simulate network loss/restore, extension restart, alarm delivery, and end-of-session while offline |
| S6 student UI | Consent/name popup and class monitoring banner; other app content is teacher dashboard | Build only | Chrome visual check: unmatched pages and student-facing state |
| S7 notice and consent | Explicit checkbox; notice now describes identity, timing, away/signals, teacher/report access, 90-day target and deletion; code gates lookup/tracking on consent | Consent retry helper test; reviewed copy/code | Human review consent language and actual consent process; local/client timestamp is self-attested, not server-verifiable |
| T1 create/schedule sessions | Class name, multiple Meet codes, schedule, status, thresholds; session + indexes written atomically | Build; rules-contract test checks code/index ownership conditions | Exercise create/schedule/status transitions in Firebase Emulator and Chrome |
| T2 roster | CSV file/paste, normalized email, add/update/replace | Unit tests cover quoted/BOM CSV, duplicate email, malformed CSV and invalid email | Verify Firestore batch writes and deletion in Chrome/Firebase |
| T3 live dashboard | Firestore snapshot listeners, 5-second metric refresh, session list refresh; polling no longer tears down selected listeners | Build only | Verify updates appear within 10 seconds on normal network; no real snapshot test |
| T4 details/timeline | Student details with visit and away timeline | Domain covers segments and away values | Visual/browser test with live data |
| T5 lifecycle/report/email | Manual end/edit; teacher final departure candidate and five-minute handling; HTML report/Gmail API/draft fallback | Domain early-end test; build | Real teacher Meet closure and Gmail authorization/send/fallback required |
| T6 CSV | CSV contains student/session metrics; formula-safe escaping | CSV quoting/formula-injection unit test | Open exported CSV in spreadsheet software and verify rows/encoding |
| T7 thresholds | Present/late/participation/focus weights configurable | Tests cover present boundary, late label and focus reweighting | UI persistence and teacher-facing formula check in Chrome |
| T8 history | Owner-filtered history list; 90-day Firestore cleanup | Rules-contract tests and static review only | Deploy and validate rules; confirm cleanup against test project data |
| T9 final leave/manual/edit | Leave timer and manual end; editable past end time; future end now rejected | Domain time-window test | Browser lifecycle, five-minute boundary, tab/browser close and end-time editing |
| T10 multiple codes/gap | Multiple codes; code switch closes one interval and starts another | Unit test excludes gap and deduplicates visit | Validate actual Meet call restart flow |
| §6 metric definitions | Time clipping, attendance %, late/present/partial/absent, rejoin, away, focus formula/labels and unavailable participation | Unit tests cover core calculations, boundaries, visit dedupe, gap, disconnected heartbeat and focus | Inputs are client-generated and not tamper-resistant; validate interpretation with live Meet events |
| §7 free stack / auth | MV3, Firebase client, Gmail on-demand `gmail.send`, CSV/draft fallback; no Cloud Functions | Build; Chrome docs confirm `getAuthToken` `scopes` overrides manifest scopes | Verify OAuth console consent, allowlisted teacher and Gmail test user/scope; no cost-quota exercise |
| §8 data model/security | Owner-scoped teacher access; own-student doc path; rostered session metadata; bounded student payload; live-write gate; no student writes to teacher sessions | Static rule-contract regression tests only, not a Firestore Rules evaluator | Firebase Emulator tests for cross-teacher, cross-student, field tampering, deletes, queries and batch index creation are required before deployment |
| §9 dashboard | Cards, searchable/filterable/sortable student table, charts, details, color+text status and responsive/theme styles | Build only | Visual review at 1366px and dark/light modes in Chrome |
| §10 report | Session summary/table, focus/rejoin/no-activity flags, CSV attachment; UTF-8 subject header; fallback draft/download | Build only | Exercise Gmail API and fallback manually; review handling of private roster data |
| §11 privacy | Count/duration-only capture, first-run notice, local deletion request, teacher approval, client cleanup policy | Static code/copy review | Philippine Data Privacy Act suitability, proportionality/lawful basis, withdrawal, rights handling, controller/contact and retention plan require human review; see concerns below |
| §12 reliability/free-tier | Local state, alarms, queued writes, dashboard snapshots, local/Firestore retention attempts | Pure-domain tests and build only | Worker/offline/reconnect/50-student quota/browser tests are not run; no server-side cleanup if the teacher extension does not run |
| §13 risks | Unavailable selector signals, report says no SEEge activity rather than asserting extension absence | Static review | Meet DOM and account restrictions remain external risks |
| §4 optional People-panel cross-check | Not implemented (PRD describes this as nice-to-have) | Not applicable | Could only be evaluated if needed; current dashboard does not claim an extension is installed based on Meet participants |
| §14 milestones | All major local components exist | Build/tests below | Original spike and full demo with classmates remains outstanding |
| §15 acceptance: join/leave/rejoin | Metrics and domain paths exist | Pure visit/90-second tests | Not exercised in Chrome/Meet; one-minute margin unverified |
| §15 acceptance: 10-second tab-away | Away threshold is 3 seconds and focus is calculated | No timer/browser integration test | Manually test switching tab for 10 seconds and verify one away period/about 10 seconds |
| §15 acceptance: roster absent/present | Roster no-record status Absent; threshold classification | Unit tests for absent, present boundary and partial | Test with two accounts in a real monitored class |
| §15 acceptance: teacher end/report/email | Workflow code exists | Build only | Real Firebase/Chrome/Gmail path has not been exercised |
| §15 acceptance: free/no card | No paid service or server function in source setup | Static review only | Confirm Firebase/Google project plans and quotas in provider consoles; this review cannot verify billing status |
| §15 acceptance: professor leaves at 45/90 | Candidate ends class after five minutes; attendance denominator clips to actual end | Domain early-end calculation test | Manual real teacher tab departure test, including restart/worker close |
| §16 open questions | Session allows history; 75% default, 10m late, 5 interactions/hour defaults | Defaults and metric tests inspected | Confirm instructor accepts thresholds, class roster size, history and live-vs-recorded demo choices |

## Review findings and local fixes

- Emergency demo hardening: Meet-code index reads and writes now require the fixed app schema and index state must match the linked session. Live indexes are readable only by the owning teacher or a rostered student; the extension maps an index permission denial to its not-rostered state. Selector configuration is limited to `config/meetSelectors`, validates its top-level fields and binds `updatedBy` to the authenticated teacher email; other config documents cannot be read or written by clients.
- Added `npm run test:rules` and focused Firestore Emulator tests for unauthenticated denial, teacher ownership, student isolation, live-only student writes, Meet-index ownership/schema, and selector-config scope. The attempt to launch the emulator in this environment was blocked by unavailable network access to Firebase CLI remote configuration/downloads; these tests have not executed here. Existing regex contract tests are not an authorization substitute.

- Consent completed after opening Meet was not retried. The content script now retries `consent_required`; a unit test guards that state.
- Early class end was not rechecked by an already tracking Meet tab. It now checks the session at the existing 60-second cadence and closes monitoring after an authoritative inactive/removed-consent state. Offline state remains buffered and cannot learn of an early end until connectivity returns.
- Firestore allowed an allowlisted teacher to overwrite another session's active Meet-code index, including another live session owned by the same teacher. Updates now require the same owner and same session, or the previous indexed session to be ended; index writes must match the linked session's code list. Session/index creation is atomic to avoid leaving an orphan session if an active code conflicts.
- Any signed-in user could read any live/ended session root document. Reads now require session ownership or the requesting student to be on that session's roster. Student activity paths remain limited to that student's own email document.
- Student write fields were weakly typed/unbounded. Rules now constrain keys, types, counts, array lengths, UID and consent version/timestamp; existing student documents without the new consent timestamp can acquire it on update. These are integrity limits, not proof: a student can still forge their own activity and self-attest consent using a modified client.
- Consent time/version is now included in activity documents. Deletion request now clears the local activity buffer, pending upload and cached session, and stops tracking that class; teacher approval deletes Firestore activity and roster data. Local name/email/consent profile remains by design.
- Google sign-in necessarily processes the email with Firebase Authentication before the local activity consent step; the popup now discloses that sequence and separates authentication from activity tracking.
- Meet participation was marked available based only on configured selectors. It now becomes available only after a configured selector matches a page element.
- Missing student activity was labeled as “No extension detected,” though this may also mean no consent, no join, or no successful sync. Dashboard/report now say “No SEEge activity detected” and report explains that extension installation cannot be inferred.
- Overlapping duplicate visits could inflate rejoin count and reduce the stability score. Rejoins and stability now use merged visit intervals; a unit test covers overlapping duplicate events.
- Dashboard polling re-created student snapshot listeners each minute. It now refreshes the session list without restarting the selected session's listeners.
- Manual class end could be set in the future; it is now rejected. Gmail subject text is UTF-8 encoded for MIME compatibility. Popup sign-in/sign-out errors are no longer silently ignored.

## Security and privacy conclusions

- A signed-in student cannot read another student's activity through the inspected Firestore match rules: student document access compares the document ID to the authenticated lower-case email, and collection listing cannot establish that predicate for arbitrary IDs. Session root metadata is now roster-gated. **This conclusion is based on static rule inspection and contract tests only; no Rules Emulator run was possible.**
- A rostered signed-in student and the owning teacher can read a live Meet-code index, including its session ID and teacher email. Unrostered signed-in users are now denied. The index remains a metadata disclosure to account for in the notice and privacy review.
- A student may write arbitrary values within their own bounded session payload (including fabricated visit timestamps/counts), malformed visit/away list entries, or bypass the UI consent checkbox with a modified client. Rules bound list sizes and field types, but do not iterate over and validate every nested list item. Rules freeze consent time/version and UID after the first record write, but the client supplies the initial values. Firestore rules cannot establish that a user genuinely clicked a consent control or that client-observed Meet signals are truthful. Do not treat reported metrics as disciplinary evidence or verified attendance proof.
- Data includes real names, account email, attendance/away timeline, interaction counts, derived scores and roster information. Reports are addressed to the teacher's own Gmail. Human review should confirm lawful basis and voluntary/informed consent, purpose/necessity/proportionality, notice details, rights and correction/withdrawal process, controller identity/contact, student age/guardian or institutional obligations, processor/transfer terms for Google/Firebase, report access, incident response, and whether the 90-day client-scheduled retention is adequate. This review is not legal advice or a legal-compliance finding.
- Firestore cleanup remains client-scheduled. A 90-day target is implemented but deletion can be delayed if Chrome/the teacher extension is not run; there is no server scheduler. Local student activity/queue cleanup also requires their extension alarm to run.

## Verification performed

- `npm test`: **22 passed, 0 failed**. Includes metric/CSV/roster tests, consent retry and bounded manual-end logic, overlapping visit deduplication, and static Firestore rule contract checks. Static rule tests do not compile or execute Firestore rules.
- `npm run build`: **passed**; outputs regenerated in tracked `dist/`.
- `git diff --check`: **passed**; Git emitted only CRLF normalization warnings.
- Firebase CLI: **installed locally** (15.34.1). Firestore Emulator test launch was attempted with the demo-only project ID; CLI remote configuration fetch failed because the environment could not resolve the Firebase public host, and no emulator authorization results were produced.
- Chrome, Google Meet, Firebase production/emulator, Google OAuth, Gmail delivery, offline/restart and 50-student tests: **not performed**.
- Manifest identity/config: version, manifest key, OAuth client ID and existing `src/firebase.js` config were preserved during this review. No deployment, data write, staging, commit or push occurred.
- `.gitignore`: remains repository-root-only; excludes `node_modules`, local `.env*`, logs/temp/OS/editor files. It does not ignore the required source files or `dist/`; `dist/` remains tracked. No files were removed as cleanup.

## Must complete before real-student use

1. Install/use Firebase CLI and run Firebase Emulator authorization tests for owner, student, other-student, other-teacher, status transitions and atomic session/index writes. Resolve any rule compile/test failure before deploy.
2. Human privacy review of notice, data controller contact, lawful basis/consent and rights/deletion process, especially if students may be minors or institutional policies apply.
3. In a disposable Firebase project, configure Google Auth, Firestore, teacher allowlist and rules; test with separate teacher/student accounts before production.
4. Configure and test the existing OAuth client for Gmail `gmail.send`; verify the click-triggered consent and real send/fallback with the teacher's account.
5. Load `dist/` unpacked in Chrome; test consent, roster matching, join/leave/rejoin, 10-second away event, early teacher leave/end, code restart/gap, deletion, offline recovery, dashboard freshness, CSV/report and service-worker restarts.
6. Observe Firestore read/write quotas for at least 50 students and confirm project billing remains within the intended free tier.
