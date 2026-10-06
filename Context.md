# Context: Local Music Player

## 1. Project Overview
A lightweight, client-side web music player built with **React** and **Vite**. The application allows users to load local audio files directly from their machine into browser memory (file picker or drag & drop) and play them back with standard controls, a managed queue, progress tracking, and volume adjustment without requiring server-side processing or external database backends.

---

## 2. Tech Stack & Dependencies
* **Framework:** React 19 (`react`, `react-dom`)
* **Build Tool:** Vite 8 (`vite`, `@vitejs/plugin-react`)
* **Styling:** Plain CSS (`App.css`, `index.css`)
* **Icons / Assets:** Native Unicode characters / SVGs inside `public/`
* **Linter:** ESLint 10 with React hooks/refresh plugins

---

## 3. Project Structure
```text
music-player/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── App.css          # Dark-themed UI layout and custom control styles
│   ├── App.jsx          # Primary application component & player logic
│   ├── index.css        # Base HTML/body setup
│   └── main.jsx         # React root entry point
├── eslint.config.js
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

---

## 4. Current Functionality & Architecture

### Audio & File Handling
* **File Upload:** Hidden `<input type="file" multiple accept="audio/*">` triggered by a custom "Load files" button. New files are appended to the existing queue.
* **Drag & Drop:** Audio files can be dropped anywhere on the window; a dashed overlay appears while dragging. Files are filtered by MIME type or extension (`mp3, wav, ogg, oga, m4a, aac, flac, opus, wma`).
* **Blob URLs:** File objects are converted into local memory URLs using `URL.createObjectURL(file)`. All created URLs are tracked in `trackUrlsRef` (a `Set`).
* **HTML5 Audio Engine:** Managed via a React `useRef(null)` bound to a hidden `<audio>` element.
* **Source switching:** The audio `src` effect depends on the current track's **URL** (`tracks[currentTrack]?.url`), not on the whole `tracks` array. Adding or removing other tracks therefore never restarts the song that is playing.

### State Management (`App.jsx`)
* `tracks`: Array of loaded track objects (`[{ name, url }]`).
* `currentTrack`: Zero-based index of the active song in `tracks`.
* `isPlaying`: Boolean tracking active audio playback state (also synced from the `<audio>` `onPlay` / `onPause` events).
* `currentTime` & `duration`: Numbers (in seconds) synced to the `<audio>` element events (`onTimeUpdate`, `onLoadedMetadata`).
* `volume`: Float between 0.0 and 1.0, **persisted to `localStorage`** (`music-player-volume`) and restored on load.
* `isMuted`: Boolean; muting does not change the stored volume.
* `isShuffle` & `isRepeat`: Booleans toggled for player playback logic. Shuffle is intentionally fully random (`Math.random()`), so the same track may play again on a skip. This is a deliberate choice, not a bug.
* `isPlaylistOpen`: Whether the queue drawer is expanded.
* `isDraggingFiles`: Whether files are currently being dragged over the window.

### Queue Management
* **Queue drawer:** Collapsible list showing track number, name, and a "Playing" / "Selected" badge on the active row. Click a row to play it.
* **Remove track (✕):** Each row has a remove button (a sibling of the row button, since buttons can't be nested). `removeTrack(index)`:
  * revokes the track's blob URL and deletes it from `trackUrlsRef`;
  * if a track *before* the current one is removed, `currentTrack` shifts down by one so the same song keeps playing;
  * if the *current* track is removed, the next track slides into its index (wrapping to the first when the last one is removed) and keeps playing if playback was active;
  * if the queue becomes empty, playback stops, state resets, and the `<audio>` source is cleared.

### User Interface Features
* Minimalist dark-mode theme (`#111119` background, purple accents).
* Track title display with automatic CSS text truncation (`text-overflow: ellipsis`) and a "Track X of Y" counter.
* Interactive seek slider (`<input type="range">`), time formatted as M:SS.
* Volume slider with live percentage readout and a mute/unmute button.
* Responsive playback buttons with active state highlighting for Shuffle & Repeat.
* Drop overlay when dragging files over the window.

---

## 5. Known Issues & Code Debt (To Fix)

When working on this project, be aware of the following:

**Fixed**
* ~~Track auto-advance (`handleEnded`) ignoring repeat/shuffle~~: now respects `isRepeat` and `isShuffle`.
* ~~Memory leaks~~: object URLs are revoked on unmount and when a track is removed.
* ~~Whole-queue audio reload~~: the source effect now depends on the current URL only.

**Still open**
* **Unhandled `audio.play()` rejections** in `togglePlay` and `playNext` (repeat branch). `handleEnded` and the source effect already catch them.
* **`aria-label` coverage is partial**: queue rows, mute, volume, and the queue toggle are labelled; Shuffle, Previous, Play/Pause, Next, Repeat, and "Load files" still rely on emoji glyphs only.
* **`App.css` cleanup:**
  * `.controls` is declared three times (duplicates can be merged).
  * `.control-button` is unused (the JSX uses `.control-btn`).
  * `span.volume-icon { display: none; }` hides a leftover 🔊 span that can be deleted from `App.jsx`.
* **Emoji rendering varies by OS/browser** (🔀︎ 🔁︎ ⏮ ⏭ may look different or fall back to colour emoji). See visual goals below.

---

## 6. Incremental Roadmap & Future Goals

### Phase 1: Core Reliability & Refactoring
- [x] Fix state setter bug in `playPrevious` and `playNext`.
- [x] Unify `handleEnded` logic with shuffle/repeat behavior.
- [x] Add URL object revocation to prevent memory leaks on large playlists.

### Phase 2: Quality of Life (QoL) Improvements
- [ ] **ID3 Metadata Extraction:** Integrate `music-metadata-browser` or `jsmediatags` to read embedded artist names, album titles, and embedded album art.
- [x] **Playlist Drawer / Queue View:** Collapsible list of loaded songs with active track highlights and click-to-play support.
- [x] **Remove tracks from the queue** (✕ button per row, with correct index handling).
- [x] **Drag & Drop:** Drag audio files directly into the browser window.
- [x] **Mute toggle** that preserves the chosen volume.
- [x] **Volume persistence** across browser sessions (`localStorage`).
- [ ] **Last played index persistence** (see note in section 7: blob URLs can't survive a reload).
- [ ] **Keyboard Shortcuts:** Spacebar (Play/Pause), Left/Right Arrows (Seek ±5s), Up/Down Arrows (Volume).

---

## 7. Possible Future Small Updates

### Bug-fix style
- [ ] Add descriptive `aria-label` values to playback, shuffle, repeat, and load buttons.
- [ ] Handle `audio.play()` promise rejections consistently in playback controls.
- [ ] Merge duplicate `.controls` rules and remove unused CSS / the hidden volume icon span.

### Quality-of-life ideas
- [ ] **Clear queue** button (with a confirm or an undo).
- [ ] **Undo toast** after removing a track ("Track removed: Undo").
- [ ] **Reorder queue** by dragging rows (or up/down buttons).
- [ ] **Show track durations** in the queue rows.
- [ ] **Queue search / filter** box for long playlists.
- [ ] **Auto-scroll** the queue to the active track when it changes.
- [ ] **Duplicate detection:** skip or warn when the same file is added twice.
- [ ] **Toast feedback:** "Added 5 tracks" / "Skipped 2 unsupported files".
- [ ] **Page title shows the current track** (`document.title`).
- [ ] **Media Session API** so OS media keys and lock-screen controls work.
- [ ] **Extra shortcuts:** `M` mute, `N`/`P` next/previous, `S` shuffle, `R` repeat, `Q` toggle queue.
- [ ] **Playback speed** control (0.75x to 2x).
- [ ] **Sleep timer.**
- [ ] **Remember the queue across reloads** by storing the files in IndexedDB (blob URLs can't be persisted, so this is the only way to restore the last played track).
- [ ] **Installable PWA** for offline use.

---

## 8. Visual Goals

Ordered roughly from small to ambitious.

### Quick visual wins
- [ ] **Replace emoji icons with inline SVG icons** for play, pause, previous, next, shuffle, repeat, and volume, so every OS renders them the same and they inherit the theme colour.
- [ ] **Filled seek bar:** show the played portion in the accent colour (CSS gradient driven by a `--progress` variable) instead of the default range track.
- [ ] **Volume icon that reflects level** (muted / low / high) and a matching filled volume track.
- [ ] **Smooth queue open/close animation** (height/opacity transition instead of an instant toggle).
- [ ] **Track removal animation** (row fades/slides out).
- [ ] **Animated "now playing" indicator** (small equalizer bars) on the active queue row instead of the text badge.
- [ ] **Marquee scroll** for long titles on hover, instead of only truncating with an ellipsis.
- [ ] **Nicer empty state:** illustration plus a hint ("Drop audio files here or click Load files").
- [ ] **Consistent hover / focus / pressed states** across all buttons.

### Medium
- [ ] **Album art panel** with a placeholder cover when no art exists (pairs with the ID3 task).
- [ ] **Accent colour from album art:** tint the progress bar, glow, and active states from the cover.
- [ ] **Theme options:** light theme plus a few accent palettes, saved in `localStorage`; respect `prefers-color-scheme`.
- [ ] **Mobile-first layout pass:** larger touch targets, safe-area padding, and a bottom-docked controls bar on small screens.
- [ ] **Compact "mini player" mode.**

### Ambitious
- [ ] **Audio visualizer:** a canvas bar or waveform display driven by a Web Audio `AnalyserNode`.
- [ ] **Static waveform seek bar** generated by decoding the file with the Web Audio API.
- [ ] **Blurred album-art background** that fades between tracks.