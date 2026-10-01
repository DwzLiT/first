# Context: Local Music Player

## 1. Project Overview
A lightweight, client-side web music player built with **React** and **Vite**. The application allows users to load local audio files directly from their machine into browser memory and play them back with standard controls, progress tracking, and volume adjustment without requiring server-side processing or external database backends.

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

4. Current Functionality & Architecture
Audio & File Handling

    File Upload: Uses a hidden <input type="file" multiple accept="audio/*"> triggered by a custom "Load files" button.

    Blob URLs: File objects are converted into local memory URLs using URL.createObjectURL(file).

    HTML5 Audio Engine: Managed via a React useRef(null) bound to a hidden <audio> element.

State Management (App.jsx)

    tracks: Array of loaded track objects ([{ name, url }]).

    currentTrack: Zero-based index of the active song in tracks.

    isPlaying: Boolean tracking active audio playback state.

    currentTime & duration: Numbers (in seconds) sync’d to the <audio> element events (onTimeUpdate, onLoadedMetadata).

    volume: Floating number between 0.0 and 1.0.

    isShuffle & isRepeat: Booleans toggled for player playback logic.

User Interface Features

    Minimalist dark-mode theme (#111119 background).

    Track title display with automatic CSS text truncation (text-overflow: ellipsis).

    Interactive seek slider (<input type="range">) formatted to M:SS.

    Custom-styled volume control with live percentage readouts.

    Responsive playback buttons with active state highlighting for Shuffle & Repeat.

5. Known Issues & Code Debt (To Fix)

When working on this project, be aware of the following bug fixes needed in App.jsx:

    Track Auto-Advance Logic (handleEnded): Currently ignores the isShuffle and isRepeat flags when a song ends naturally.

    Memory Leaks: URL.createObjectURL references are not revoked (URL.revokeObjectURL) when loading new files or unmounting.

6. Incremental Roadmap & Future Goals
Phase 1: Core Reliability & Refactoring

    [ ] Fix state setter bug in playPrevious and playNext.

    [ ] Unify handleEnded logic with shuffle/repeat behavior.

    [ ] Add URL object revocation to prevent memory leaks on large playlists.

Phase 2: Quality of Life (QoL) Improvements

    [ ] ID3 Metadata Extraction: Integrate music-metadata-browser or jsmediatags to read embedded artist names, album titles, and embedded album art.

    [ ] Playlist Drawer / Queue View: Display a collapsible list of loaded songs with active track highlights and click-to-play support.

    [ ] Drag & Drop: Allow dragging audio files directly into the browser window.

    [ ] Keyboard Shortcuts: Spacebar (Play/Pause), Left/Right Arrows (Seek ±5s), Up/Down Arrows (Volume).

    [ ] Local Storage Persistence: Save recent volume level and last played index across browser sessions.