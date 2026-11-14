# Cardio Explorer: Issue specs (Week 3, Task 2)

Specs for the four core features in `BRIEF.md`, written with the `product-manager` agent. Each section is the body for one GitHub Issue: paste it into that issue when `gh` is not available.

| Issue | Feature | Branch | Route |
|---|---|---|---|
| #1 | Interactive 4-Chamber Heart & Blood Flow Explorer | `feature/heart-explorer` | `/modules/heart-explorer` |
| #2 | Heart Rate Zones & Pulse Simulator | `feature/pulse-simulator` | `/modules/pulse-simulator` |
| #3 | Daily Habits & Cardiovascular Risk Quiz | `feature/habits-quiz` | `/modules/habits-quiz` |
| #4 | Quick Heart Health Glossary & Fact Cards | `feature/glossary-cards` | `/modules/glossary` |

Build order: #2 → #3 → #4 → #1, then the About page.


---

## Issue #1

### Interactive 4-Chamber Heart & Blood Flow Explorer

> Core feature 1 of 4 in `BRIEF.md`. Audience: middle and high school students and their teachers.

#### Problem

Students struggle to picture the heart's four chambers and four valves from a static textbook diagram, and especially to see blood flow as one continuous double loop (heart to lungs and back, then heart to body and back), so they need a clickable diagram that explains each part and walks them through the full path.

##### Content scope (the facts this feature teaches)

- **4 chambers:** right atrium, right ventricle, left atrium, left ventricle.
- **4 valves:** tricuspid, pulmonary, mitral (bicuspid), aortic.
- **Blood path (one full circuit, about 12 steps):** body → superior/inferior vena cava → right atrium → tricuspid valve → right ventricle → pulmonary valve → pulmonary artery → lungs (gas exchange: picks up oxygen, releases carbon dioxide) → pulmonary veins → left atrium → mitral valve → left ventricle → aortic valve → aorta → body (oxygen delivered) → back to the vena cava.
- **Two loops:** pulmonary circulation (heart ↔ lungs) and systemic circulation (heart ↔ body).

All copy must be in plain language at roughly a grade 7–9 reading level, with the correct term shown alongside (for example "mitral valve (the door between the left atrium and left ventricle)").

---

#### User stories & acceptance criteria

Testing notes: "RTL" = Vitest + React Testing Library (to be added as dev dependencies; see Definition of done). Criteria marked **[manual]** cannot be checked reliably in jsdom and are verified by hand in a real browser, using DevTools device mode and an automated contrast/axe check.

##### Story 1: Explore a chamber or valve

**As a** student learning heart anatomy, **I want** to select any chamber or valve on a heart diagram and read what it does, **so that** I can learn each part's job by exploring instead of memorising a static picture.

**Acceptance criteria**

1. **Given** the explorer has loaded, **when** I look at the diagram, **then** there are exactly 8 selectable parts (4 chambers, 4 valves), each exposed as a button with an accessible name equal to the part's name (for example "Left ventricle"). *(RTL: `getAllByRole('button')` within the diagram returns 8; each found by `getByRole('button', { name: /left ventricle/i })`.)*
2. **Given** no part is selected, **when** the page loads, **then** the information panel shows a short prompt telling me to choose a part (it is never blank).
3. **Given** the explorer, **when** I select "Left ventricle", **then** the information panel shows a heading "Left ventricle", a 1–3 sentence plain-language description of its job, whether it holds oxygen-rich or oxygen-poor blood, and where blood goes next. *(RTL: assert heading text and presence of each field.)*
4. **Given** a part is selected, **when** I look at the diagram, **then** that part is visibly highlighted and marked as selected to assistive tech (`aria-pressed="true"`); all other parts are `aria-pressed="false"`. Only one part is selected at a time.
5. **Given** "Left ventricle" is selected, **when** I select "Mitral valve", **then** the panel updates to the mitral valve content and the previous selection is cleared.
6. **Given** a valve is selected, **when** I read the panel, **then** it names the two spaces the valve sits between and explains that it stops blood flowing backwards.
7. **Given** the content for all 8 parts, **when** the test suite runs, **then** every part has a non-empty name, description, oxygen status and "next" destination in the content data. *(RTL / unit test on the content file.)*
8. **Given** the diagram is shown, **when** I look at it, **then** a visible note explains that the diagram's left and right are the person's left and right, so the left side of the heart appears on the viewer's right.

##### Story 2: Follow the blood step by step

**As a** student, **I want** to follow a drop of blood step by step through the heart, lungs and body, **so that** I understand circulation as one continuous double loop and know the order of the chambers and valves.

**Acceptance criteria**

1. **Given** the explorer, **when** I choose "Follow the blood", **then** a guided tour starts at step 1 (blood returning from the body into the right atrium) and shows a step counter in the form "Step 1 of N". *(RTL: text matches `/step 1 of \d+/i`.)*
2. **Given** I am on any step, **when** I press "Next", **then** the step counter increases by 1, the panel describes the new location, and the matching part of the diagram (or the lungs/body label) is highlighted.
3. **Given** I am on step 1, **then** "Previous" is disabled; **given** I am on the last step, **then** "Next" is disabled (or replaced by "Start again"), and "Start again" returns me to step 1.
4. **Given** the tour, **when** I step through all N steps, **then** the order of locations matches the content scope list above exactly. *(RTL: iterate through steps and compare to the expected ordered list.)*
5. **Given** any step, **when** I read the panel, **then** it states whether the blood is oxygen-rich or oxygen-poor in **words**, not only by colour (red/blue is a convention; colour is never the only signal).
6. **Given** the tour reaches the lungs step, **then** the panel explains that blood picks up oxygen and gets rid of carbon dioxide there; **given** it reaches the body step, **then** the panel explains that oxygen is delivered to the body's cells.
7. **Given** the tour, **when** I am on a step, **then** the panel indicates which loop I am in: "Lungs loop (pulmonary)" or "Body loop (systemic)".
8. **Given** the tour is running, **when** I choose "Exit tour" (or select a part directly), **then** the tour ends and the explorer returns to free-explore mode without errors.
9. **Given** the tour, **then** it only advances when the user acts; it never auto-advances on a timer by default.

##### Story 3: Use it with a keyboard or screen reader

**As a** student who uses a keyboard or a screen reader, **I want** to reach and operate every part of the explorer without a mouse and hear what the diagram shows, **so that** I can learn the same content as everyone else.

**Acceptance criteria**

1. **Given** I am using only a keyboard, **when** I press Tab, **then** focus moves through all 8 parts and the tour controls in a logical order (right side of the heart before left, following the blood path), and Enter or Space selects the focused part. *(RTL with `user-event`: `tab()` reaches each part; `keyboard('{Enter}')` updates the panel.)*
2. **Given** any interactive element has focus, **when** I look at it, **then** a visible focus indicator is shown with at least 3:1 contrast against its background. **[manual]**
3. **Given** I select a part or change tour step, **when** the panel content changes, **then** the update is announced to screen readers via a polite live region (`aria-live="polite"`) and focus is **not** moved unexpectedly. *(RTL: live region exists and contains the new heading text.)*
4. **Given** the diagram is an image or SVG, **when** a screen reader reaches it, **then** it has a text alternative (for example `role="img"` with an accessible name, plus a visually hidden or visible text summary of the full blood path). Decorative shapes are hidden from assistive tech. *(RTL: `getByRole('img', { name: /diagram of the heart/i })`; text summary present in the document.)*
5. **Given** the explorer, **then** it has a page-level `h1` (module title) and the explorer section and panel use correct heading levels with no skipped levels. *(RTL: query headings by level.)*
6. **Given** all text, labels and the parts' highlighted/unhighlighted states, **then** text contrast is at least 4.5:1 (3:1 for large text) and non-text UI parts/borders at least 3:1, in both light and any dark theme. **[manual + axe]**
7. **Given** the explorer is rendered, **when** an automated accessibility check runs (for example `vitest-axe` / `jest-axe`), **then** it reports no violations. *(RTL + axe.)*

##### Story 4: Use it on a phone or Chromebook

**As a** student using a phone, tablet or school Chromebook, **I want** the explorer to fit my screen and be easy to tap, **so that** I can use it in class or at home without zooming or scrolling sideways.

**Acceptance criteria**

1. **Given** a viewport 320px wide, **when** the explorer loads, **then** there is no horizontal scrolling (page `scrollWidth` is not greater than the viewport width) and all labels are readable. **[manual: DevTools at 320, 375, 768, 1024, 1440px]**
2. **Given** a narrow viewport, **then** the information panel stacks below the diagram; **given** a wide viewport (desktop), **then** it may sit beside the diagram. **[manual]**
3. **Given** a touch screen, **then** every selectable part and control has a target of at least 24×24 CSS px (aim for 44×44), and small valves have an enlarged hit area or a matching list button so they can be tapped accurately. **[manual]**
4. **Given** the page is zoomed to 200% (or text-only zoom), **then** content reflows without overlapping or cutting off text. **[manual]**
5. **Given** the diagram scales, **then** it keeps its aspect ratio and part labels stay attached to the right shapes.

##### Story 5: Respect reduced motion

**As a** student who is sensitive to motion (or who finds animation distracting), **I want** the blood-flow animation to stop or simplify when my device asks for reduced motion, **so that** I can use the explorer comfortably.

**Acceptance criteria**

1. **Given** my system setting `prefers-reduced-motion: reduce`, **when** I use the explorer, **then** no flowing, pulsing or looping animation plays; step changes and highlights appear instantly or with a simple fade under 200ms. *(RTL: mock `window.matchMedia` to return `matches: true` and assert the reduced-motion state/class is applied; visual check **[manual]**.)*
2. **Given** motion is allowed, **then** any animation that lasts more than 5 seconds or loops (for example a beating heart or flowing particles) has a visible "Pause animation" control that works by keyboard. *(RTL: control exists and toggles its pressed state.)*
3. **Given** any animation, **then** nothing flashes more than 3 times per second.
4. **Given** reduced motion, **then** every piece of information shown by animation (direction of flow, current location) is still available as text and static arrows.

##### Story 6: Teacher trusts the content and framing

**As a** teacher, **I want** the explorer's content to be accurate, sourced and clearly framed as education, **so that** I can use it in class with confidence and students don't mistake it for medical advice.

**Acceptance criteria**

1. **Given** the explorer page, **when** it loads, **then** a short visible note states that the content is for learning only and is not medical advice, and suggests talking to a doctor, school nurse or trusted adult about any health concerns. *(RTL: `getByText(/not medical advice/i)`.)*
2. **Given** the explorer, **then** a "Sources" section lists the reputable references used (for example American Heart Association, NIH/NHLBI, or an equivalent open educational source), each with a working link. *(RTL: at least one link in the sources section; link check **[manual]**.)*
3. **Given** any content, **then** it uses no frightening or diagnostic language (no symptoms, diseases, "is your heart normal?" style prompts or self-checks).
4. **Given** the content is written, **then** a second person reviews every chamber, valve and step description against the sources before merge, and the review is noted in the PR. **[manual]**
5. **Given** the content lives in data (not hard-coded in JSX), **then** a teacher-facing reviewer can read all explorer text in one file.

---

#### Out of scope

- User accounts, saving progress or remembering which parts a student visited between sessions (per `BRIEF.md`).
- Teacher dashboards, class codes, assignment tracking or analytics on individual students.
- Quizzes or scoring inside the explorer (the Habits quiz is Feature 3; a separate "check your understanding" quiz can be a follow-up issue).
- The heart's electrical system, ECG, heart sounds or the detailed cardiac cycle (systole/diastole timing); covered by later modules.
- Heart rate, pulse or blood pressure content (Feature 2 and other modules).
- Diseases, defects, symptoms, surgery, or any personal health tracking, self-assessment or diagnosis.
- A realistic 3D model, dissection imagery or photographs of real organs.
- Fetal circulation, coronary arteries and detailed vessel anatomy beyond the main vessels named in the content scope.
- Audio narration and translations into other languages (could be follow-ups).
- Offline/PWA support.

#### Risks

**Health and safety**

- **Looks like medical advice.** Students may try to relate content to their own heart or symptoms. Mitigation: visible "learning only, not medical advice" note (Story 6, AC1), no symptom or self-check content, signpost to a trusted adult or health professional.
- **Inaccurate or oversimplified facts.** A wrong valve order or "blue blood" myth would teach a misconception. Mitigation: content reviewed against cited sources (Story 6, AC2 and AC4); state that blue/red is a diagram convention and that blood is always red.
- **Left/right mirroring confusion.** A common student error. Mitigation: visible orientation note (Story 1, AC8).
- **Anxiety-inducing content.** Some students may have a heart condition themselves or in their family. Mitigation: neutral, factual tone; no disease content in this feature.
- **Motion and photosensitivity.** Pulsing or flowing animation may cause discomfort or, if flashing, seizure risk. Mitigation: Story 5 (reduced motion, pause control, no flashing above 3 per second).

**Privacy**

- The feature should collect **no** personal data: no accounts, forms, cookies or third-party analytics/trackers. Many users are under 13, so any future analytics would need a COPPA/GDPR-K style review first.
- If the selected part or tour step is kept in the URL or `localStorage` for convenience, it must hold only content IDs, never anything personal.
- Fonts, images and scripts should be served from the app itself (no third-party requests) to avoid leaking student IP addresses to other services.

**Product/delivery**

- **Diagram creation.** An accurate, accessible, responsive SVG is the biggest effort. The licence for any borrowed artwork must allow reuse (prefer an original SVG or a clearly licensed one, credited).
- **Colour-only meaning.** Red/blue alone fails colour-blind users; text labels and patterns are required (Story 2, AC5).
- **Test tooling missing.** Vitest and React Testing Library are not yet in `package.json`; adding them is part of this issue.

#### Definition of done

- [ ] All acceptance criteria in Stories 1–6 pass; **[manual]** criteria checked and ticked in the PR description.
- [ ] Vitest, React Testing Library, `@testing-library/user-event`, jsdom and an axe matcher added as dev dependencies, with an `npm test` script; all new tests pass locally.
- [ ] Explorer content (parts, descriptions, tour steps, sources) lives in `src/mocks/heartExplorer.js`, separate from the components; the explorer renders on the `heart-explorer` module page (`/modules/heart-explorer`, defined in `src/content/modules.js`).
- [ ] Styles added to `src/styles/global.css` using the existing `:root` design tokens; no inline colour values that bypass the tokens.
- [ ] Manually checked at 320, 375, 768, 1024 and 1440px wide with no horizontal scroll; checked by keyboard only; checked with one screen reader (NVDA, VoiceOver or ChromeVox on a Chromebook); checked with reduced motion turned on.
- [ ] Automated axe check reports no violations; contrast verified to WCAG 2.2 AA.
- [ ] Content reviewed against cited sources by a second person; "not medical advice" note and Sources section visible.
- [ ] No personal data collected; no third-party network requests added.
- [ ] `npm run build` succeeds with no new warnings.
- [ ] Built on `feature/heart-explorer` branched from `dev`; PR targets `dev` and uses `.github/pull_request_template.md`.

---

## Issue #2

### Heart Rate Zones & Pulse Simulator

> Core feature 2 in `BRIEF.md`. Lives on the `pulse-simulator` module page (`/modules/pulse-simulator`, defined in `src/content/modules.js`).
> Status: a work-in-progress prototype covers the zone simulator (Story 2). The pulse-counting practice (Story 1) is not built yet.

#### Problem

Students struggle to find and count their own pulse, and heart rate zones feel abstract, so they can't connect a number like "140 BPM" to what their body is doing during activity.

#### User stories & acceptance criteria

Testing note: every criterion below should be testable with Vitest + React Testing Library (RTL). Query by role and accessible name, not by class names. Use fake timers (`vi.useFakeTimers()`) for anything timed. Contrast (Story 5) and the 320px layout (Story 6) also need a manual or automated browser check, because jsdom cannot measure them. That is noted where it applies.

---

##### Story 1: Guided pulse-counting practice (new)

**As a** student, **I want** step-by-step help to find my pulse, count beats for 15 seconds and turn that count into beats per minute, **so that** I learn how a pulse is measured and what BPM means.

**Guided steps and timer**

- **Given** the Heart Rate page has loaded, **when** I reach the pulse practice section, **then** I see numbered steps in plain language: (1) find your pulse on the inside of your wrist below the thumb, with two fingers (not your thumb); (2) press Start and count beats until the timer stops; (3) type your count; (4) see your BPM.
- **Given** the steps are shown, **then** they say to press gently and to stop and tell a teacher or trusted adult if you feel dizzy or unwell. They do not tell students to exercise hard before counting.
- **Given** the timer is idle, **when** I activate the "Start 15-second count" button with a mouse, Enter or Space, **then** a countdown starts at 15 and shows the seconds left as text, not only as an animation.
- **Given** the countdown is running, **then** an `aria-live="polite"` region announces "Counting started" at the start and "Time's up. Enter your count." at the end. It does not announce every second.
- **Given** the countdown is running, **when** I activate "Stop" or "Reset", **then** the timer stops, the display goes back to 15, and focus stays on a visible, sensible control.
- **Given** the countdown reaches 0, **then** focus does not jump unexpectedly. The count input is ready, and the live region tells me what to do next.
- **Given** I don't want to use the timer (for example, a teacher is timing the class), **then** I can still type a count and calculate. The timer is optional.

**Input and calculation**

- **Given** the practice section, **then** there is one number input with a visible `<label>` such as "Beats counted in 15 seconds". RTL `getByLabelText` finds it. Helper text ("Type a whole number, for example 18") is linked with `aria-describedby`.
- **Given** I type a valid whole number from 1 to 60 and press "Calculate BPM" (or Enter inside the input), **then** the result shows the count × 4, for example 18 → "72 beats per minute". The calculation is shown as "18 × 4 = 72".
- **Given** a result is shown, **then** it is announced through an `aria-live="polite"` region.
- **Given** a result is shown, **then** next to it is the neutral note: "This is a practice estimate. Counting mistakes are common. It is not a medical measurement." The result is never labelled "normal", "abnormal", "healthy", "too high", "too low" or anything similar, and it is not put into a zone.
- **Given** a valid result is shown, **when** I change the input, **then** the old result is cleared or marked out of date until I calculate again. A stale BPM is never shown next to a new count.
- Leading and trailing spaces are ignored, so " 18 " is treated as 18.

**Input validation**

All errors follow the same pattern:
- They appear as text next to the input, linked with `aria-describedby`.
- The input gets `aria-invalid="true"`.
- The message is announced through `role="alert"` or a polite live region.
- Errors are not shown by colour alone.
- No BPM result is shown while there is an error.
- The tone is friendly and never blames the student.

| # | Given input | Then the app shows (suggested wording) |
|---|---|---|
| V1 | Empty, or only spaces | "Type the number of beats you counted." |
| V2 | Non-numeric text, such as `abc`, `12abc` or `1e2`. Also symbols other than digits. | "Please use numbers only, for example 18." |
| V3 | Very long input: 4 or more digits (such as `99999999999` or `0018`), or any text longer than 20 characters (such as a pasted paragraph). Short mixed text like `12abc` is V2. | "That's longer than we expected. Type a number from 1 to 60." The raw text is not shown back on the page. The UI does not break or overflow at 320px. |
| V4 | A negative number, such as `-5` | "A count can't be negative. Type a number from 1 to 60." |
| V5 | A decimal, such as `17.5` or `18,5` | "Count whole beats only, for example 18." The value is not rounded silently. |
| V6 | Zero (`0`) | "Looks like no beats were counted. Try finding your pulse again, or ask your teacher for help." This is not treated as a health warning. |
| V7 | Implausibly high, more than 60 (over 240 BPM), such as `75` | "That number is higher than we'd expect for 15 seconds. It's easy to miscount, so try counting again." This message must not suggest that anything is medically wrong. |

- **Given** an error is shown, **when** I fix the input and calculate again, **then** the error message, `aria-invalid` and the error styling are removed, and the result appears.
- **Given** any input, valid or not, **then** nothing is saved to `localStorage`, `sessionStorage`, cookies, the URL, or any network request. A test can check that storage stays empty and that `fetch` is not called.
- **Given** I reload the page, **then** the input and result are empty.

---

##### Story 2: Explore simulated heart rate zones (prototype exists, needs hardening)

**As a** student, **I want** to choose an activity level and see how a simulated heart rate and zone change, **so that** I understand how heart rate rises from rest to hard exercise.

- **Given** the page has loaded, **then** four buttons are shown: Rest, Light, Moderate and Hard. They work as a single-select group (`aria-pressed`, or a radio group), and Rest is selected by default.
- **Given** I select an activity with a mouse, Enter or Space, **then** the panel shows a simulated BPM, the zone name, a % of estimated maximum heart rate, and a one- or two-sentence explanation.
- **Given** a selection changes, **then** the new BPM and zone are announced through one `aria-live="polite"` region, for example "Moderate activity: about 140 beats per minute, moderate zone".
- **Given** each activity, **then** the BPM and % values come from one mock data object in the module's content (not hard-coded in JSX). A unit test checks that BPM goes up from Rest to Light to Moderate to Hard, and that the % values match `BPM / (220 − 16)` within rounding.
- **Given** the zone panel, **then** it clearly says the values are simulated for an example 16-year-old ("Example student, age 16. Simulated data."). The maximum is described as an estimate (220 − age) that varies from person to person.
- **Given** zone thresholds are shown (AHA target heart rate chart: moderate ≈ 50–70% and vigorous ≈ 70–85% of estimated maximum; the CDC page that gave 64–76% / 77–93% no longer exists), **then** they match the cited AHA source, the "talk test" wording matches the CDC intensity page, and each level's BPM falls inside its own stated range, and each source link has descriptive text and opens to a reputable page.
- **Given** any zone, **then** the wording is descriptive ("your breathing gets faster and talking gets harder") and not a personal prescription ("you should train at…").

---

##### Story 3: Beating heart animation with motion control

**As a** student who is sensitive to motion (or easily distracted), **I want** the beating heart animation to follow the simulated BPM and to be easy to pause, **so that** I can see the pace without the motion bothering me.

- **Given** an activity is selected and motion is allowed, **then** the heart animation beat rate matches the simulated BPM. A test checks the animation duration value: 60 / BPM seconds.
- **Given** the page has loaded, **then** there is a pause/play toggle button with an accessible name ("Pause heart animation" / "Play heart animation") and `aria-pressed` or a name that changes to show its state.
- **Given** the user's OS has `prefers-reduced-motion: reduce`, **then** the animation does not start automatically. A still heart and the BPM text are shown, and the user can still choose to play it. A test mocks `matchMedia`.
- **Given** the animation is decorative, **then** it is hidden from screen readers (`aria-hidden="true"`), and the BPM text carries the meaning.
- **Given** any state, **then** nothing flashes more than 3 times per second, even at the Hard BPM. At 180 BPM a beat happens 3 times per second, so the animation must be a gentle scale or pulse, not a flash or a strong change in brightness.

---

##### Story 4: Teacher-led demonstration

**As a** teacher, **I want** to use the page on a projector or a class Chromebook without logging in or doing any setup, **so that** I can lead a whole class through pulse counting and the zone comparison.

- **Given** a teacher opens the Heart Rate page, **then** both sections work right away with no account, sign-in or data entry.
- **Given** the pulse practice, **then** a teacher can run the 15-second timer for the class, and the countdown text is large enough to read from across a room (it uses a design token from `global.css`, and its size is listed in the PR).
- **Given** a "Reset" control, **when** a teacher activates it, **then** the timer, input, errors and result all go back to their starting state so the next student can use it.
- **Given** the page, **then** there is a short "How this works" note for teachers explaining the ×4 calculation and that all zone data is simulated.

---

##### Story 5: Accessible to every student

**As a** student who uses a keyboard, screen reader or zoom, **I want** every control and result to be usable and announced, **so that** I can complete the activity like everyone else.

- **Given** keyboard-only use, **when** I press Tab through the page, **then** I reach every interactive control (activity buttons, animation toggle, timer Start/Stop/Reset, count input, Calculate, source links) in a logical order with no keyboard trap.
- **Given** any focused control, **then** a visible focus indicator is shown with at least 3:1 contrast against what is next to it. It is not removed with `outline: none` unless a replacement is provided.
- **Given** all form controls, **then** each has a programmatic label. RTL `getByRole(..., { name })` finds each one.
- **Given** headings, **then** the page has one `h1`, and the sections ("Practice taking your pulse", "Heart rate zones") use correctly nested headings.
- **Given** text and UI parts, **then** they meet WCAG 2.1 AA contrast: 4.5:1 for normal text, and 3:1 for large text and UI parts, including error text and zone colours. Zone meaning is never shown by colour alone; the zone name is always shown as text. *(Checked with axe or a manual contrast check. jsdom cannot measure contrast.)*
- **Given** an automated a11y check (for example `vitest-axe` / `jest-axe` on the rendered page), **then** there are no violations.
- **Given** a browser zoomed to 200%, **then** no content is cut off or overlaps.

---

##### Story 6: Works on any device, clearly educational

**As a** student on a phone or school Chromebook, **I want** the page to fit my screen and to clearly say it is for learning, **so that** I can use it anywhere and don't mistake it for a medical tool.

- **Given** a 320px-wide viewport, **then** there is no horizontal scrolling. Activity buttons wrap or stack, the input and buttons fit, and long error messages wrap. *(Checked manually in browser dev tools or with a Playwright snapshot. Note this in the PR.)*
- **Given** touch devices, **then** interactive targets are at least 44×44 CSS px.
- **Given** the Heart Rate page, **then** a disclaimer is visible on the page near the pulse result and in the site footer. Suggested wording: "Cardio Explorer is for learning only. It is not medical advice and cannot diagnose any condition. If you have questions about your heart or feel unwell, talk to a parent, school nurse or doctor." RTL can find this text.
- **Given** the page, **then** sources (CDC, AHA) are listed for every number or threshold shown, in line with the brief's success metric for accurate content.

#### Out of scope

- User accounts, sign-in, saving progress, history of past counts, or progress charts (brief: out of scope).
- Teacher dashboards, class rosters, or collecting results from students.
- Storing, sending or analysing any user-entered value, including the pulse count, BPM or age. No analytics events that contain these values.
- Entering a personal age to work out a personal max HR or personal zones. The demo uses a fixed example age of 16 (see open questions).
- Reading heart rate from a device: camera-based pulse detection, wearables, Bluetooth or the Web Sensors API.
- Any diagnosis, risk score, "normal/abnormal" judgement, or advice for a specific person's training or health.
- ECG/waveform content (separate biometrics topic).
- Count windows other than 15 seconds (for example 30 or 60 seconds), and the neck (carotid) pulse method. These are possible later.
- Audio beeps or haptics for the timer.
- Translating the page into other languages.

#### Risks

**Health and safety**
- **Seen as medical advice or diagnosis (high).** A student might read a low or high practice BPM as a sign that something is wrong. *Mitigation:* never label the student's own result or put it into a zone. Use the neutral "practice estimate" note. The V6 and V7 messages blame miscounting, not health. Show the disclaimer on the page and in the footer.
- **Anxiety in students with known heart conditions.** *Mitigation:* use calm wording and point students to a trusted adult or school nurse. Never use alarm colours or alarm wording for a result.
- **Physical exertion.** Telling students to exercise and then measure could be unsafe. *Mitigation:* the activity levels are simulated only. The page does not tell students to exercise. The steps say to stop if they feel dizzy.
- **Pulse-taking technique.** Pressing hard on the neck (carotid) can be unsafe for some people. *Mitigation:* teach the wrist (radial) method only for now.
- **Accuracy of the "220 − age" formula.** It is a rough population estimate with a wide error range (about ±10–12 BPM). *Mitigation:* call it an "estimate", say it varies from person to person, and cite the source. Zone thresholds must match the cited CDC/AHA pages, and a content reviewer should check them before release.
- **Photosensitivity.** A fast heart animation could be close to flashing thresholds at high BPM. *Mitigation:* see Story 3, and pause the animation by default when reduced motion is set.

**Privacy**
- Users are minors (under 13 in middle school), so COPPA/FERPA-type concerns apply. *Mitigation:* collect nothing and keep nothing. Values exist only in component state. No storage, network calls, analytics payloads or URL parameters contain user input. Tests enforce this (Story 1).
- Students using shared classroom devices. *Mitigation:* nothing persists after a reload, and there is a Reset control.

**Accessibility and product**
- jsdom cannot check contrast or the 320px layout, so these could regress without anyone noticing. *Mitigation:* add a manual check item to the PR template checklist for this feature.
- The prototype already exists, so it could be merged without hardening. *Mitigation:* Story 2 and Story 3 criteria apply to the existing code, not only to new code.

#### Open questions

1. **Accepted range:** is 1–60 beats per 15 seconds (4–240 BPM) the right range? Should a very low but possible count (for example 1–7, under 30 BPM) get a gentle "try counting again" hint instead of a result?
2. **Reference range:** should the page show a general, cited resting range for teens (for example AHA's 60–100 BPM for resting adults and teens) separately from the student's result, or leave it out completely to reduce the risk of self-diagnosis? The default in this spec is to show it only as general text, never next to the student's number as a comparison.
3. **Age:** keep a fixed demo age of 16, or let students choose an example age from a preset list (for example 12–18) that is clearly labelled as an example? A free-text age input is out of scope.
4. **Neck pulse:** keep the wrist-only method, or add the carotid method with safety guidance in a later issue?
5. **Disclaimer wording:** does the school or organisation need its own approved disclaimer text?

#### Definition of done

- [ ] All acceptance criteria in Stories 1–6 pass. The automated ones are covered by Vitest + RTL tests (validation cases V1–V7, the ×4 calculation, live region announcements, keyboard operation, reduced motion, no storage or network use).
- [ ] An automated accessibility check (axe) passes on the Heart Rate page with no violations.
- [ ] A manual check is recorded in the PR: keyboard-only walkthrough, screen reader smoke test (NVDA or VoiceOver), WCAG AA contrast, 320px width with no horizontal scroll, 200% zoom, and reduced motion turned on.
- [ ] Mock and simulated data live in `src/mocks/`, not hard-coded in components. The page renders through `src/views/ModuleView.jsx`, and styles use the design tokens in `src/styles/global.css`.
- [ ] Every number and threshold shown is cited (CDC/AHA), and a second team member has checked it against the source.
- [ ] The "educational, not medical advice" disclaimer is visible on the page and in the footer.
- [ ] No user input is saved or sent anywhere (checked by tests and by code review).
- [ ] `npm run build` succeeds with no new lint or console errors.
- [ ] The PR is opened from `feature/pulse-simulator` into `dev`, uses `.github/pull_request_template.md`, and has been through code, QA and security review.

---

## Issue #3

### Daily Habits & Cardiovascular Risk Quiz

Core feature 3 from `BRIEF.md`. Short multiple-choice questions on **food, activity, sleep, stress and tobacco**. After each answer the student gets an instant explanation of how that habit affects the heart, with a source.

> **Design principle:** this is a quiz about **what habits do to the heart in general**. It never asks students about their own habits, body or family, and never gives a personal risk level. The only score is a knowledge score ("You got 7 of 10 right").

#### Problem

Students learning human biology find the link between everyday habits (food, activity, sleep, stress, tobacco) and heart health abstract. They need a quick, interactive way to test what they know and get a clear, sourced explanation straight away, without the app judging or diagnosing them.

#### User stories & acceptance criteria

##### Story 1: Answer a habit question and get instant feedback

**As a** middle or high school student, **I want** to answer a short multiple-choice question about a daily habit and see straight away whether I was right and why, **so that** I learn how that habit affects the heart while it is fresh.

- **AC 1.1 Question display**
  - **Given** I open the quiz
  - **When** the first question loads
  - **Then** I see the question text, its topic (one of Food, Activity, Sleep, Stress, Tobacco), progress ("Question 1 of N") and 2 to 4 answer options.
- **AC 1.2 Answer options are a labelled radio group**
  - **Given** a question is shown
  - **When** I inspect it with a screen reader (or `getByRole`)
  - **Then** the options are a `radiogroup` whose accessible name is the question text, and each option is a `radio` whose accessible name is the full option text.
- **AC 1.3 Checking an answer**
  - **Given** I have chosen an option
  - **When** I activate "Check answer"
  - **Then** a feedback panel appears saying **"Correct"** or **"Not quite"** in text, names the correct option, and shows a 1 to 3 sentence explanation of how the habit affects the heart.
  - **And** if no option is chosen, "Check answer" stays enabled and shows the message "Choose an answer first." (an enabled button with a clear message is easier to discover with a screen reader than a disabled one).
- **AC 1.4 Answer locked after checking**
  - **Given** I have checked an answer
  - **When** the feedback is showing
  - **Then** the options can no longer be changed, and a "Next question" button (or "See results" on the last question) is available.
- **AC 1.5 Source shown with explanation**
  - **Given** feedback is showing
  - **When** I read the explanation
  - **Then** I see a "Source" line naming the organisation and page (for example "CDC: Physical Activity for Children"), linked to it. External links open in a new tab and say so in their accessible name.

##### Story 2: Cover all five habit areas with accurate, sourced content

**As a** teacher, **I want** the quiz to cover food, activity, sleep, stress and tobacco with facts I can check against WHO, AHA or CDC, **so that** I can trust it in class and point students to the original source.

- **AC 2.1 Topic coverage**
  - **Given** the quiz content file
  - **When** the content test runs
  - **Then** there are at least 2 questions for each of the 5 topics (minimum 10 questions), and every question has: `id`, `topic`, `question`, 2 to 4 `options`, exactly one correct option, `explanation`, and at least one `source` with `organisation`, `title` and `url`.
- **AC 2.2 Statistics are cited**
  - **Given** any question or explanation that contains a number (minutes, hours, milligrams, percent)
  - **When** content is reviewed
  - **Then** that number appears on the cited WHO, AHA or CDC page (or another named public-health body agreed in review), and the source entry records the date it was checked.
- **AC 2.3 Age-appropriate figures**
  - **Given** a recommendation that differs by age (for example activity or sleep)
  - **When** it is used in the quiz
  - **Then** the figure for children and teens is used, not the adult one, and the age range is stated (for example "for ages 6 to 17").
- **AC 2.4 Content lives in one place**
  - **Given** a teacher or developer wants to fix a fact
  - **When** they look for the quiz content
  - **Then** all questions, explanations and sources are in a single data file, `src/mocks/habitsQuiz.js`, separate from the UI components.

##### Story 3: See a knowledge summary at the end, not a personal verdict

**As a** student, **I want** to see how many questions I got right and a short recap of each habit at the end, **so that** I know what to review before a test without feeling judged about my own health.

- **AC 3.1 Results screen**
  - **Given** I have answered the last question
  - **When** I activate "See results"
  - **Then** I see "You got X of N right", plus a one-line takeaway for each of the 5 topics.
- **AC 3.2 No risk language about the student**
  - **Given** the results screen and all quiz content
  - **When** a content test scans the text
  - **Then** none of these phrases appear: "your risk", "risk score", "risk level", "you are at risk", "high risk", "low risk", "diagnos", "your heart is", "you should see a doctor". (The list lives with the test and can be extended.)
- **AC 3.3 Score framing**
  - **Given** any score from 0 to N
  - **When** results are shown
  - **Then** the message is about knowledge (for example "Great review!" or "Try again to learn more"), never about health, and no colours, icons or wording suggest a "healthy/unhealthy" or "safe/danger" verdict.
- **AC 3.4 Restart**
  - **Given** I am on the results screen
  - **When** I activate "Try again"
  - **Then** the quiz restarts at question 1 with no options selected and focus on the first question heading.

##### Story 4: Use the quiz with keyboard, screen reader and any screen

**As a** student who uses a keyboard, a screen reader or a small phone, **I want** the quiz to work fully without a mouse and on any screen size, **so that** I can take part like everyone else.

- **AC 4.1 Keyboard operable**
  - **Given** I am using only the keyboard
  - **When** I use Tab, Shift+Tab, arrow keys, Space and Enter
  - **Then** I can choose an option, check the answer, follow the source link, go to the next question, see results and restart, with no keyboard traps. (RTL: drive the whole quiz with `userEvent.tab()` / `userEvent.keyboard()`.)
- **AC 4.2 Focus management**
  - **Given** I move to a new question or to the results screen
  - **When** it renders
  - **Then** focus moves to its heading (e.g. `tabIndex="-1"`), so screen-reader users hear the new content. (RTL: assert `document.activeElement`.)
- **AC 4.3 Visible focus**
  - **Given** any interactive element in the quiz
  - **When** it receives keyboard focus
  - **Then** a visible focus indicator appears with at least 3:1 contrast against its background (uses the shared focus style in `global.css`). Manual check.
- **AC 4.4 Feedback announced**
  - **Given** I check an answer
  - **When** feedback appears
  - **Then** it is inside a region with `aria-live="polite"` that exists in the DOM before the answer is checked, so "Correct" or "Not quite" and the explanation are announced. (RTL: assert the live region exists on first render and contains the feedback text after checking.)
- **AC 4.5 Not colour alone**
  - **Given** an answer has been checked
  - **When** correct and incorrect options are marked
  - **Then** each marked option has a text label ("Correct answer", "Your answer") and an icon with a text alternative, as well as any colour. (RTL: assert the label text is present.)
- **AC 4.6 Contrast**
  - **Given** any text, icon or control state in the quiz (default, hover, focus, selected, correct, incorrect, disabled excepted)
  - **When** checked with a contrast tool
  - **Then** normal text meets WCAG AA 4.5:1, large text and UI components meet 3:1, using design tokens from `:root` in `src/styles/global.css`. Manual check (or axe in CI if adopted).
- **AC 4.7 Responsive, no sideways scrolling**
  - **Given** a viewport 320px wide (and also 768px and 1280px)
  - **When** I go through a whole quiz including the longest question and the results screen
  - **Then** there is no horizontal scrolling, long words and URLs wrap, tap targets are at least 44 by 44 CSS px, and text stays readable when zoomed to 200%. Manual check in browser dev tools.
- **AC 4.8 Reduced motion**
  - **Given** I have "reduce motion" turned on
  - **When** feedback or transitions appear
  - **Then** no non-essential animation plays.

##### Story 5: Understand that this is education, not medical advice

**As a** student (and as a parent or teacher), **I want** the quiz to clearly say it teaches general facts and is not medical advice, **so that** nobody mistakes it for a health check and I know where to go if I have a real worry.

- **AC 5.1 Notice before starting**
  - **Given** I open the quiz
  - **When** the intro screen shows
  - **Then** I see a short notice in plain language, for example: "This quiz teaches general facts about habits and the heart. It does not check your own health. If you have questions about your health, talk to a parent, school nurse or doctor."
- **AC 5.2 Notice on results**
  - **Given** I reach the results screen
  - **When** it renders
  - **Then** the same notice (or a shortened version) is shown again. (RTL: assert the notice text on both screens.)
- **AC 5.3 No personal questions**
  - **Given** all quiz questions
  - **When** the content test runs and a reviewer reads them
  - **Then** no question asks about the student's own behaviour, body, weight, health conditions or family ("How many hours do *you* sleep?", "Do you vape?"). Questions are knowledge questions ("How many hours of sleep do experts recommend for teens?").
  - **And** the quiz UI contains no text, number or free-entry inputs. (RTL: `queryAllByRole('textbox')` and `queryAllByRole('spinbutton')` return nothing.)
- **AC 5.4 Supportive tone**
  - **Given** any explanation, especially for stress and tobacco/vaping
  - **When** reviewed
  - **Then** the wording does not shame, scare or blame (no "you will get heart disease"); it explains the general effect and, for stress and tobacco, points to asking a trusted adult for help.

##### Story 6: Reach the quiz from the Modules page

**As a** student or teacher, **I want** to find the quiz from the modules list and the home page, **so that** I can use it as part of the habits module.

- **AC 6.1 Listed with the habits modules**
  - **Given** I am on the Modules page
  - **When** I look at the module cards
  - **Then** I see a card for the quiz that links to its page, and this entry comes from `src/content/modules.js` (the single source of truth).
- **AC 6.2 Works as a route**
  - **Given** I open the quiz URL directly or refresh it
  - **When** the page loads
  - **Then** the quiz intro screen shows inside the shared layout with a unique page `<title>` and one `<h1>`.

#### Out of scope

- Any question about the student's own habits, body, weight, BMI, blood pressure, heart rate, symptoms, medications or family history.
- Any personal risk score, risk level, risk calculator, traffic-light rating or "your heart age" style output.
- Diagnosis, symptom checking or personalised health advice.
- Saving answers or scores: no accounts, no `localStorage`/`sessionStorage`, no server calls with answers, no analytics on individual answers. Refreshing the page resets the quiz.
- Teacher dashboards, class results, leaderboards or sharing scores.
- Timed questions, randomised question banks, difficulty levels, or multiple question types (drag-and-drop, free text). Multiple choice only for v1.
- Calorie counting, dieting or weight-loss content.
- Translation into other languages.
- New content for the other core features (heart explorer, pulse simulator, glossary).

#### Risks

| Risk | Why it matters | Mitigation in this spec |
| --- | --- | --- |
| **Looks like medical advice or a diagnosis** | The issue title contains "Risk Quiz"; minors may read a score as a verdict on their own health. | Knowledge score only (AC 3.1–3.3), banned-phrase test (AC 3.2), notice on intro and results (AC 5.1–5.2). Consider a student-facing title without "Risk" (see open questions). |
| **Collecting health data from minors** | Self-report answers about vaping, sleep or stress are sensitive personal data about children (COPPA, GDPR-K, school policies). | No personal questions, no inputs, nothing stored or sent (AC 5.3, Out of scope). |
| **Inaccurate or outdated facts** | Guidelines change; adult figures are often wrongly applied to children. | Every number cited and date-checked, child/teen figures used (AC 2.2–2.3); content reviewed before merge. |
| **Body image and eating disorders** | Weight and calorie content can harm vulnerable teens. | Weight, BMI and calories out of scope; food questions focus on patterns (fruit and vegetables, salt, sugary drinks, whole grains). |
| **Anxiety, shame or fear** | Stress and tobacco topics can upset students, especially those with family members who smoke or have heart disease. | Supportive, non-blaming tone and trusted-adult pointer (AC 5.4); no family-history questions. |
| **Tobacco/vaping content misread as permission** | Phrases like "less harmful" can be taken as approval. | Do not compare vaping as "safer"; state that nicotine affects heart rate and blood pressure and that no tobacco use is safe for young people, as CDC does. |
| **External links** | Links take minors off-site. | Only official WHO, AHA, CDC (or agreed public-health) pages; `rel="noopener noreferrer"`; labelled as opening a new tab. |
| **Accessibility exclusion** | Quiz feedback is commonly shown by colour only. | Story 4 criteria. |

#### Definition of done

- [ ] All acceptance criteria above pass.
- [ ] Vitest + React Testing Library are set up in the project (not currently in `package.json`) with a `test` script, and tests cover at least: content schema (AC 2.1), banned phrases (AC 3.2), no personal inputs (AC 5.3), notice on intro and results (AC 5.1–5.2), radio group labelling (AC 1.2), check/next/results/restart flow (AC 1.3, 1.4, 3.1, 3.4), keyboard-only run-through and focus moves (AC 4.1, 4.2), aria-live feedback (AC 4.4), text labels on correct/incorrect (AC 4.5).
- [ ] Manual checks recorded in the PR: 320px / 768px / 1280px with no sideways scrolling, 200% zoom, visible focus, contrast of all states, one screen reader pass (NVDA or VoiceOver).
- [ ] Every fact and statistic has a WHO, AHA or CDC (or agreed) source with URL and "checked on" date; a second person has reviewed the content against the sources.
- [ ] Quiz is the `habits-quiz` entry in `src/content/modules.js` and renders at `/modules/habits-quiz`.
- [ ] Styles use tokens in `src/styles/global.css`; components are self-contained and commented, per `CLAUDE.md`.
- [ ] `npm run build` succeeds with no console errors.
- [ ] PR from `feature/habits-quiz` into `dev`, using `.github/pull_request_template.md`.

---

## Issue #4

### Quick Heart Health Glossary & Fact Cards

Core feature 4 in `BRIEF.md`. Audience: middle and high school students, and the teachers who guide them.

#### Problem

Students revising for a biology or health test need a quick, trustworthy place to look up heart-health terms in plain language and test their recall. At the moment they have to dig back through long module pages or search the open web, where answers are often unreliable or too technical.

#### User stories & acceptance criteria

Notes that apply to every story:
- "Term" means one glossary entry. Each one has a term name, a plain-language definition (aim for 1 to 3 sentences, about a Year 7 to 9 reading level), a learning area (`anatomy`, `habits` or `biometrics`, matching the `theme` values used in `src/content/modules.js`) and an optional fact. If the fact has a source, the source is shown with it.
- Glossary content lives in one content file (`src/mocks/glossary.js`), just as modules live only in `modules.js`. It is not hard-coded inside components.
- Criteria tagged **[RTL]** should be automated with Vitest + React Testing Library. Criteria tagged **[Manual]** need a browser, devtools or an assistive-technology check, and the results are recorded in the PR.

---

##### Story 1: Browse the glossary

**As a** student revising for a test, **I want** to see all key heart-health terms in one alphabetical list with short, plain-language definitions, **so that** I can review the vocabulary quickly without reopening every module.

**Acceptance criteria**

1. **[RTL]** **Given** I open the Glossary page, **when** it renders, **then** I see one visible level-1 heading ("Heart Health Glossary" or similar), and every term in the glossary content file is shown with its definition.
2. **[RTL]** **Given** the glossary content, **when** the list renders, **then** the terms are sorted A to Z, ignoring case and leading punctuation (for example "ECG" sorts under E).
3. **[RTL]** **Given** the list renders, **when** I inspect its structure, **then** it uses semantic markup (a description list, `dl`/`dt`/`dd`, or a list with a heading per term). Each term name is programmatically tied to its definition.
4. **[RTL]** **Given** a term has a learning area, **when** it renders, **then** the learning-area name is shown as text, not as colour alone.
5. **[RTL]** **Given** the site navigation, **when** I look at the header nav or the Modules page, **then** there is a link to the Glossary page, and the Glossary has its own route (`/modules/glossary`).
6. **[Manual]** **Given** the glossary content, **when** content review takes place, **then** each definition has been checked for accuracy and plain language (no unexplained jargon, and no definitions that use the term to define itself).

---

##### Story 2: Search and filter terms

**As a** student short on time, **I want** to search by keyword and filter by learning area, **so that** I can jump straight to the terms I'm unsure about.

**Acceptance criteria**

Search basics
1. **[RTL]** **Given** the Glossary page, **when** it renders, **then** there is a search input with a visible text label (not placeholder-only), for example "Search terms". The input can be found with `getByLabelText` / `getByRole('searchbox')`.
2. **[RTL]** **Given** I type "atri", **when** the list updates, **then** only terms whose name or definition contains "atri" (case-insensitive) are shown, for example "Atrium" and "Atria". Results update as I type, with no submit button needed.
3. **[RTL]** **Given** I type "ATRIUM" or "  atrium  " (with spaces before and after), **when** the list updates, **then** the results match those for "atrium". Matching ignores case and leading/trailing whitespace.
4. **[RTL]** **Given** a term name contains accented or curly-quote characters, **when** I search with the plain equivalent (for example "heart's" with a straight apostrophe), **then** the term still matches. The matching rule is documented in the content file comments.

Edge cases
5. **[RTL]** **Empty search.** **Given** the search box is empty, or contains only spaces, **when** the list renders, **then** all terms (within the active filter) are shown, and no "no results" message appears.
6. **[RTL]** **No matches.** **Given** I type "zzzz", **when** the list updates, **then** no terms are shown, and a message appears saying no terms match "zzzz", with a suggestion to check spelling or clear the search. The message includes a "Clear search" button that empties the input, shows all terms again and returns focus to the input.
7. **[RTL]** **Special characters.** **Given** I type regex or HTML-significant text such as `(`, `[`, `.*`, `\`, `+`, `?`, `<script>` or `&amp;`, **when** the list updates, **then** the app does not throw or log errors, the characters are matched literally (not as a pattern), and the typed text is shown as plain text in the no-results message (it is not rendered as HTML).
8. **[RTL]** **Very long input.** **Given** I paste a 5,000-character string, **when** the list updates, **then** the input accepts at most 100 characters (proposed `maxLength`), the page does not freeze, and the no-results message wraps or truncates the echoed text with an ellipsis instead of causing horizontal scrolling.
9. **[RTL]** **Result count.** **Given** any search or filter state, **when** the results change, **then** a polite live region (`role="status"` / `aria-live="polite"`) announces the count, for example "5 terms shown" or "No terms match". It is not re-announced on every keystroke when the count is unchanged.

Filter
10. **[RTL]** **Given** the filter control, **when** it renders, **then** it offers "All", "Anatomy", "Biometrics" and "Habits" (derived from the module `theme` values, not hard-coded). It is a labelled native control (radio group, `select`, or toggle buttons with `aria-pressed`).
11. **[RTL]** **Given** I select "Biometrics" and type "rate", **when** the list updates, **then** only biometrics terms matching "rate" are shown. Search and filter combine with AND.
12. **[RTL]** **Given** a filter returns zero terms, **when** the list renders, **then** the same no-results message appears, with an option to reset the filter and the search.

---

##### Story 3: Flip fact cards to test myself

**As a** student, **I want** to flip a card that shows a term on the front and its definition and a fact on the back, **so that** I can quiz myself before a test.

**Acceptance criteria**

1. **[RTL]** **Given** the Fact Cards view (a section of the Glossary page or a tab, see Open questions), **when** it renders, **then** each card's front shows the term name and its back shows the definition and fact. At first, only the fronts are exposed to assistive technology.
2. **[RTL]** **Given** a card, **when** I inspect it, **then** the flip control is a native `<button>` with an accessible name that includes the term, for example "Flip card for Atrium", and `aria-expanded` reflects the state (the name stays the same, so the state is not announced twice).
3. **[RTL]** **Given** a card is face-down, **when** I click it, or focus it and press Enter or Space, **then** it flips to show the back, the state attribute becomes true, and the back content becomes available to assistive technology (it is no longer `aria-hidden` / `hidden` / `inert`).
4. **[RTL]** **Given** a card is flipped, **when** I activate it again, **then** it flips back to the front, and the state attribute becomes false.
5. **[RTL]** **Given** a card is flipped, **when** I check focus, **then** focus stays on the same control. It is not lost to `<body>` and does not move to another card.
6. **[RTL]** **Given** I hover over a card with a mouse, **when** I do not click, **then** the card does not flip. Flipping never depends on hover alone.
7. **[RTL]** **Given** several cards, **when** I flip one, **then** the others keep their own state, and there is a "Reset all cards" control that turns every card back to its front.
8. **[RTL]** **Given** search or filter is active (Story 2), **when** the Fact Cards view is shown, **then** it shows the same filtered set as the list.
9. **[Manual]** **Given** a screen reader (NVDA + Chrome or VoiceOver + Safari), **when** I tab to a card and activate it, **then** the reader announces the term, the button role and the state change, and I can then read the back content.
10. **[Manual]** **Given** a touch device, **when** I tap a card, **then** it flips, and the tap target is at least 44 by 44 CSS px.

---

##### Story 4: See where facts come from

**As a** teacher, **I want** every fact card statistic or health claim to show its source, **so that** I can trust the content and show students how to check facts.

**Acceptance criteria**

1. **[RTL]** **Given** a fact in the content file has a `source` (organisation name, page title, URL and the date it was checked), **when** the back of its card is shown, **then** the source is shown as "Source: <organisation>, <title>" with a link.
2. **[RTL]** **Given** a source link, **when** it renders, **then** it has a meaningful accessible name (not "click here"), and if it opens in a new tab it uses `target="_blank"` with `rel="noopener noreferrer"` and tells the user it opens in a new tab (visible text or an icon with text).
3. **[RTL]** **Given** the content file, **when** a test checks every fact, **then** every fact that contains a number, percentage or health claim has a non-empty `source` with an `https://` URL. The test fails if one is missing (a data-integrity test).
4. **[RTL]** **Given** a source link is focused inside a flipped card, **when** I press Enter, **then** the link opens and the card does not flip back. The link and the flip button are separate controls, so no interactive element is nested inside another.
5. **[Manual]** **Given** the cited sources, **when** content review takes place, **then** each comes from a reputable public-health body (for example WHO, AHA, NHS, CDC or NIH/NHLBI) and the URL loads. The review date is recorded in the content file.

---

##### Story 5: Educational framing, not medical advice

**As a** teacher, **I want** the glossary and cards to be clearly labelled as education, not medical advice, **so that** students do not use them to diagnose themselves or others.

**Acceptance criteria**

1. **[RTL]** **Given** the Glossary page, **when** it renders, **then** a short notice is visible near the top (not only in the footer). For example: "This glossary is for learning. It is not medical advice. If you are worried about your health, talk to a parent or carer, school nurse or doctor."
2. **[RTL]** **Given** any definition or fact that mentions numeric ranges (for example resting heart rate or blood pressure), **when** it renders, **then** the wording describes typical ranges for learning ("is often around...") and never personal judgements ("your heart rate is unhealthy if..."). This is enforced by content review, plus a test that the content contains no second-person diagnostic phrases from an agreed list.
3. **[Manual]** **Given** the content, **when** content review takes place, **then** there are no dosage, treatment or "what to do if you have symptom X" instructions, apart from a general "get help" line for emergencies (see Risks).

---

##### Story 6: Use it on any device and with any ability

**As a** student using a phone, Chromebook, keyboard only or a screen reader, **I want** the glossary and cards to work fully on my setup, **so that** I can revise wherever and however I study.

**Acceptance criteria**

1. **[RTL]** **Given** the Glossary page, **when** I tab through it, **then** the order is logical: notice, then search, then filter, then view toggle (if any), then terms or cards, then source links. Every interactive element can be reached and operated with the keyboard alone, and there are no keyboard traps.
2. **[Manual]** **Given** any focusable element, **when** it receives keyboard focus, **then** a visible focus indicator appears (using `:focus-visible`, at least 2 px, and at least 3:1 contrast against the surrounding colours). It is not hidden by the flip transform.
3. **[Manual]** **Given** the design tokens in `src/styles/global.css`, **when** text and controls are checked with a contrast tool, **then** body text meets WCAG AA (4.5:1), large text and UI component boundaries meet 3:1, and both sides of every card pass.
4. **[RTL]** **Given** the user has set `prefers-reduced-motion: reduce`, **when** a card is flipped, **then** there is no 3D rotation animation. The content swaps instantly, or with a short opacity fade of 150 ms or less. Test this by mocking `matchMedia` and asserting the reduced-motion class or attribute is applied. **[Manual]** Confirm visually.
5. **[Manual]** **Given** a viewport 320 CSS px wide (and 375, 768 and 1280), **when** I view the page in list view and card view, with a long term name and a long search string, **then** there is no horizontal page scroll, cards reflow to a single column, and long words wrap (`overflow-wrap: anywhere`).
6. **[Manual]** **Given** the browser zoom is at 200% or text spacing is increased (WCAG 1.4.12), **when** I view cards, **then** no content is clipped. A card's height grows to fit its back content rather than using a fixed height.
7. **[RTL]** **Given** the page, **when** it is checked with `jest-axe` / `vitest-axe` in the default, no-results and one-card-flipped states, **then** there are no violations.

#### Out of scope

- User accounts, saving flipped/known cards, progress tracking, streaks or spaced repetition (accounts and saved progress are out of scope in `BRIEF.md`).
- Scored quizzes or timed tests. That is Feature 3, the Habits & Risk Quiz.
- Teacher tools for adding, editing or exporting terms, and teacher dashboards. Content is edited in the source file by the team.
- Personal health input of any kind (entering your own heart rate or blood pressure) and any interpretation of it.
- Translation and multiple languages, and audio pronunciation of terms (possible later enhancements).
- Fuzzy or typo-tolerant search, synonyms and search across other pages of the app.
- Printing or PDF export of card sets.
- Images or diagrams on cards (text-only for this issue; may link to the Heart Explorer later).
- Linking each term to and from specific module pages (nice-to-have, separate issue).

#### Risks

**Health and safety**
- **Looks like medical advice.** Terms such as "arrhythmia", "hypertension", "tachycardia" or numeric "normal" ranges could lead a student to self-diagnose or worry. *Mitigation:* the Story 5 notice, wording that describes typical ranges for learning rather than judging individuals, no symptom checkers, and a content review sign-off.
- **Emergency content.** If terms such as "heart attack", "cardiac arrest" or "CPR" are included, students may look for what to do. *Mitigation:* limit content to a definition plus a single line saying "In an emergency, call your local emergency number" (do not hard-code 911, because the audience may be outside the US). Decide whether these terms are in scope (see Open questions).
- **Inaccurate or outdated facts.** Statistics change, for example yearly heart-disease figures. *Mitigation:* every statistic is cited with a "checked on" date (Story 4), the sources come from reputable bodies only, and the team re-reviews at least once a year.
- **Anxiety or sensitive topics.** Some students have heart conditions or family bereavement. *Mitigation:* use a neutral, non-alarming tone, avoid fear-based statistics, and do not single out lifestyle "blame".
- **Body-image framing.** Habit-related terms (diet, weight) can feed shame or eating-disorder triggers. *Mitigation:* focus on heart function and habits, not weight or appearance, and avoid moralising words like "bad food".

**Privacy**
- Low risk by design: no accounts, no personal data, and no data sent to a server. *Must hold:* search text is not logged, sent to analytics or stored in the URL or `localStorage` without a decision from the team (a search for "arrhythmia" could reveal a student's own concern, especially on shared school devices). If filter or search state is ever put in the URL for sharing, that needs a separate privacy review.
- External source links take students to third-party sites. Use `rel="noopener noreferrer"` and link only to official public-health pages.

**Security**
- Search text is echoed in the no-results message. It must be rendered as text, never with `dangerouslySetInnerHTML` (Story 2, AC7).
- Search must not build a `RegExp` from raw input without escaping it (to avoid crashes and ReDoS).

**Accessibility**
- 3D flip cards often break for screen readers (both faces read out, or hidden content stays focusable) and for reduced-motion users. Story 3 and Story 6 address this, but it is the area most likely to regress, so the RTL tests are required, not optional.

**Open questions for the team**
1. Should Fact Cards be a tab/toggle on the same `/modules/glossary` page or a separate route? (This spec assumes a toggle on one page with shared search and filter.)
2. How many terms ship in v1? (Suggestion: 20 to 30, about 8 to 10 per learning area.)
3. Are emergency terms (heart attack, cardiac arrest, CPR, AED) in scope for v1? If so, who signs off the wording?
4. Who is the named content reviewer for accuracy (a teacher or health professional), and is that review a merge requirement?
5. Is a 100-character search limit acceptable?
6. Glossary data lives in `src/mocks/glossary.js` (mock data folder noted in `CLAUDE.md`).
7. Spelling standard: the existing content mixes British ("fibre") and US spelling. Pick one for definitions.

#### Definition of done

- [ ] All acceptance criteria in Stories 1 to 6 are met. Every **[RTL]** criterion has at least one passing Vitest + React Testing Library test, and the axe checks pass.
- [ ] Data-integrity test passes: every term has a name, a definition and a valid learning area, there are no duplicate terms, and every statistic or claim has an `https://` source and a "checked on" date.
- [ ] **[Manual]** checks are recorded in the PR: keyboard-only pass, one screen reader pass, contrast results, reduced-motion check, and screenshots at 320, 375, 768 and 1280 px with no horizontal scroll.
- [ ] Content has been reviewed for accuracy, plain language and "education, not medical advice" framing, and the reviewer is named in the PR.
- [ ] The educational notice is visible on the page.
- [ ] The Glossary is reachable from site navigation and its route works on a hard refresh.
- [ ] No new runtime dependencies were added without justification in the PR. Styles use existing tokens in `src/styles/global.css`.
- [ ] `npm run build` succeeds with no new console errors or warnings.
- [ ] The PR is opened from `feature/glossary-cards` into `dev`, using `.github/pull_request_template.md`, and links to and closes #4.
