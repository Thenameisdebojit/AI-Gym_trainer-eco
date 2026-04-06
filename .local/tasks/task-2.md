---
title: Report: history nav + interactive charts
---
# Report: History Nav + Interactive Charts

## What & Why
Two UX improvements to the Report screen:
1. "All Records" should navigate the user to the Discover tab's built-in History view instead of expanding an inline overlay inside Report.
2. The Weekly Activity bar chart should be interactive — hovering or tapping a bar shows the exact kcal value for that day. The Weight Tracking line chart should show a hover crosshair with a floating tooltip displaying the weight value and month label at the nearest data point.

## Done looks like
- Clicking "All Records" in the Report tab switches the app to the Discover tab and automatically opens its History view (calendar + weekly sessions list), not an inline panel inside Report
- Hovering (or tapping on mobile) any bar in the Weekly Activity chart shows a tooltip with the day name and calorie total; the hovered bar is visually highlighted
- Moving the mouse over the Weight Chart canvas draws a vertical crosshair line and a floating tooltip that follows the cursor, snapping to the nearest logged weight point and showing its value and month label
- Removing the mouse from either chart hides the tooltip cleanly
- All interactions work in all 6 languages (no new translation keys needed; the data labels are already dynamic)

## Out of scope
- Clicking a bar to filter the session list below (future work)
- Pinch-to-zoom on the Weight Chart
- Redesigning the Report layout

## Tasks
1. **Cross-tab navigation signal** — Add a lightweight `navigateTo(tab, subView)` helper to `AppSettingsContext` (or a tiny localStorage/event approach) so any screen can request a top-level tab switch and optional sub-view. Update `page.js` to listen and act on that signal, passing it as a prop (or context value) down to the relevant screen.

2. **Wire "All Records" to Discover History** — In `Report.js`, replace the `setShowFullHistory` toggle with a call to `navigateTo('discover', 'history')`. Remove the now-unused `InlineHistoryView` render. In `Discover.js`, check on mount whether the navigation target requests `'history'` and if so, immediately set `view = 'history'`.

3. **Interactive WeeklyBar chart** — Refactor the `WeeklyBar` component inside `Report.js` to track a `hovered` index in local state. On `onMouseEnter`/`onMouseLeave` of each bar column, update the hovered index and show a small tooltip (positioned absolutely above the bar) with the day label and kcal value. Highlight the hovered bar with a stronger color and a subtle scale/shadow.

4. **Interactive WeightChart (canvas)** — Add `onMouseMove` and `onMouseLeave` handlers to the canvas in `WeightChart.js`. On move, find the nearest data point by x-position, draw a vertical dashed crosshair line at that x, draw a filled dot on the curve, and render a tooltip (small rounded rect or a `<div>` overlay positioned via state) showing the weight and label. On leave, re-draw without the crosshair.

## Relevant files
- `frontend/screens/Report.js:80-103`
- `frontend/screens/Report.js:363-375`
- `frontend/screens/Discover.js:94-145,463-464,627`
- `frontend/components/charts/WeightChart.js`
- `frontend/context/AppSettingsContext.js`
- `frontend/app/page.js:170-200,286-288`