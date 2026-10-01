# AI Agent Rules & Project Guidelines

This document outlines strict constraints, patterns, and rules that any AI agent or assistant must follow when contributing to this repository.

---

## 1. Core Stack & Constraints

* **Framework:** React 19 (`react`, `react-dom`) using **Vite** as the build tool.
* **State Management:** Standard React Hooks (`useState`, `useRef`, `useEffect`). **Do not add heavy external state management tools** (e.g., Redux, Zustand) unless explicitly requested.
* **Styling:** Vanilla CSS (`App.css`). Maintain the existing dark-mode design palette:
  * Background: `#111119`
  * Secondary / Cards: `#342b46`, `#292333`
  * Primary Accent / Highlights: `#c8a7ff`, `#a987d6`, `#5b3e96`
  * Text: `#f5f3fa`, `#96919f`
* **Dependencies:** Keep the project lightweight. Always favor native Web APIs (e.g., HTML5 Audio API, File API) over third-party libraries whenever possible.

---

## 2. File & Architectural Conventions

* **Component Structure:** Keep small edits centered in `App.jsx` unless introducing a distinct, reusable UI component (e.g., `Playlist.jsx` or `TrackInfo.jsx`).
* **Clean Code & Variable Naming:**
  * Active state setter for track indexing is `setCurrentTrack` (do **not** use `setCurrentTrackIndex`).
  * Always check if `tracks.length === 0` before attempting array indexing or triggering play logic.
* **Memory Management Rule:**
  * Whenever local files are loaded via `URL.createObjectURL(file)`, ensure that unused memory URLs are properly cleaned up using `URL.revokeObjectURL(url)` when resetting or updating track lists to prevent memory leaks.

---

## 3. Audio & Control Logic Rules

When modifying audio playback code in `App.jsx`:

1. **State Synchronization:**
   * React state handles UI values (`currentTime`, `duration`, `volume`, `isPlaying`).
   * The `<audio>` element ref (`audioRef.current`) remains the single source of truth for audio playback.
   * Updates to seek position or volume MUST sync directly to `audioRef.current.currentTime` and `audioRef.current.volume`.

2. **Playback Modes (Shuffle & Repeat):**
   * **Repeat Mode (`isRepeat`):** Must replay the exact current track from 0:00 when triggered or when `onEnded` fires.
   * **Shuffle Mode (`isShuffle`):** Must pick a random index from `tracks` when skipping forward/backward or when `onEnded` fires.
   * **Normal Mode:** Cycles sequentially through tracks (`(currentTrack + 1) % tracks.length`).

3. **Event Handler Guard Clauses:**
   * Always guard against null `audioRef.current` references:
     ```jsx
     if (!audioRef.current || tracks.length === 0) return;
     ```

---

## 4. UI/UX Rules

* **Formatting Time:** Keep the existing `formatTime` helper function output formatted strictly as `M:SS`.
* **Truncation:** Ensure track names continue to use single-line truncation (`overflow: hidden`, `text-overflow: ellipsis`, `white-space: nowrap`) to avoid layout breaks on long filenames.
* **Accessibility:** Always include proper `aria-label` or semantic tags on inputs, sliders, and button controls.

---

## 5. Instructions for Proposing Changes

* **Focus on Small, Incremental Edits:** Work on one task or component at a time (e.g., fix a bug first, then add a feature).
* **Verify Code Integrity:** Double check that variable names match existing state declarations before producing code outputs.