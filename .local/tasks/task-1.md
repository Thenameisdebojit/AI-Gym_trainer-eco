---
title: Fix settings + Report stats UI
---
# Fix Settings & Report Section UI

## What & Why
Several web app settings are visual-only and have no real effect. The Report
section's top-stats area doesn't match the reference design, and there's no
way to jump to the full workout history from within Report. This task makes
all settings actually work and updates the Report header to match the
reference image.

## Done looks like
- **Dark Mode** — toggling it in Settings immediately switches the whole app
  to a dark theme (dark backgrounds, light text, dark borders). The choice
  persists across page reloads via localStorage.
- **Language** — selecting a language in Settings immediately changes the
  navigation labels, screen headings, and key UI strings throughout the app
  to the selected language (EN, FR, ES, HI, DE, PT). Persists across reloads.
- **Notifications** — enabling the toggle triggers a browser notification
  permission prompt. If granted, a demo "Time to work out!" notification is
  shown and the toggle reflects the real permission state.
- **Health Sync** — toggling shows a clear informational message: "Health Sync
  requires the FitAI mobile app." The toggle state is saved but no actual
  sync is attempted in the browser.
- **Report top section** — matches reference image: a single white card
  containing three columns (Workouts / Kcal / Minutes) with the medal, flame,
  and clock icons, all pulled from real session data.
- **"All records" link** — appears next to the "History" heading in Report.
  Clicking it expands (or navigates to) the full calendar + weekly-grouped
  history view (the same HistoryView already built in Discover.js) directly
  inside the Report screen.

## Out of scope
- Real Apple Health / Google Fit API integration (browser restriction).
- Push notifications via a service worker / backend (demo browser
  notification only).
- Translating every string in the app — only nav labels, screen headings,
  and the most visible Settings labels need to change.

## Tasks
1. **Global AppSettingsContext** — Create a React context in
   `frontend/context/AppSettingsContext.js` that holds darkMode, language,
   notifications (permission state), and healthSync. On mount it reads from
   localStorage; on change it writes back. Dark mode applies
   `data-theme="dark"` to `<html>`. Wrap the app in `layout.js` (or
   `page.js`) with this provider.

2. **Dark-theme CSS variables** — Add a `[data-theme="dark"]` block to
   `globals.css` that overrides all `--bg`, `--surface`, `--surface-2`,
   `--border`, `--border-light`, `--text`, `--text-secondary`,
   `--text-tertiary` variables to appropriate dark values.

3. **Wire Settings.js to context** — Replace the local `useState` calls for
   darkMode, language, notifications, and healthSync with `useAppSettings()`
   context hook calls. Notifications toggle should call
   `Notification.requestPermission()` and reflect the actual permission.
   Health Sync toggle shows an inline info message. Language and dark mode
   changes are instant and global.

4. **Language strings in page.js** — Consume the language from context in
   `page.js` so that NAV_ITEMS labels and screen subtitles update when the
   user switches language. Provide translations for the 6 supported languages.

5. **Report stats card + history link** — Replace the three separate stat
   mini-cards at the top of `Report.js` with a single unified card matching
   the reference image (one row, three columns, icon above number above label,
   no individual card borders). Add a "History" section header with an
   "All records →" link that toggles the HistoryView component (already
   exists in `Discover.js`) inline within Report.

## Relevant files
- `frontend/screens/Settings.js`
- `frontend/screens/Report.js`
- `frontend/app/page.js`
- `frontend/app/globals.css`
- `frontend/app/layout.js`
- `frontend/screens/Discover.js:330-500`