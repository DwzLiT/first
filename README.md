# Local Music Player

A lightweight, client-side web music player built with **React** and **Vite**. Load audio files straight from your machine into the browser (file picker or drag & drop) and play them back with standard controls, a managed queue, progress tracking, and volume adjustment. No server-side processing and no external database required.

## Features

- **Local file loading**: select multiple audio files via a custom "Load files" button; newly selected files are appended to the current queue
- **Drag & drop**: drop audio files anywhere in the browser window to add them to the queue
- **Queue view**: collapsible list of loaded tracks with the active track highlighted and click-to-play
- **Remove tracks**: a ✕ button on every queue row removes that track without interrupting the song that is playing
- **Playback controls**: play/pause, previous, next, shuffle, and repeat (with active-state highlighting)
- **Seek slider**: interactive progress bar with time displayed as `M:SS`
- **Volume control**: custom-styled slider with a live percentage readout and a mute button; your volume is remembered between sessions
- **Track title display**: the active filename is shown prominently, with long names truncated cleanly with an ellipsis, plus a "Track X of Y" counter
- **Dark theme**: minimalist UI built with plain CSS

## Tech Stack

| Area      | Technology                                      |
| --------- | ----------------------------------------------- |
| Framework | React 19 (`react`, `react-dom`)                 |
| Build     | Vite 8 (`vite`, `@vitejs/plugin-react`)         |
| Styling   | Plain CSS (`App.css`, `index.css`)              |
| Icons     | Native Unicode characters / SVGs in `public/`   |
| Linting   | ESLint 10 with React Hooks and Refresh plugins  |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (a current LTS version is recommended)
- npm (included with Node.js)

### Installation

```bash
git clone <your-repo-url>
cd music-player
npm install
```

### Development

```bash
npm run dev
```

Then open the local URL printed in the terminal (usually `http://localhost:5173`).

### Production Build

```bash
npm run build
npm run preview
```

### Linting

```bash
npm run lint
```

## Usage

1. Click **Load files** and choose one or more audio files from your computer, or drag audio files into the window. Adding more files later appends them to the end of the queue; it does not replace tracks already loaded.
2. Press play, or use the previous/next buttons to move through the loaded tracks.
3. Open the **Queue** to see all tracks. Click a row to play it, or click **✕** to remove it.
4. Use the seek slider to jump within a song, the volume slider to adjust loudness, and the speaker button to mute.
5. Toggle **Shuffle** or **Repeat** to change how playback advances.

> Files live in browser memory only. Reloading the page clears the queue (your volume setting is kept).

## Project Structure

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

## How It Works

- **File handling**: a hidden `<input type="file" multiple accept="audio/*">` is triggered by the "Load files" button; dropped files go through the same path and are filtered by type/extension.
- **Blob URLs**: each `File` is converted to a local memory URL with `URL.createObjectURL(file)`, so nothing is uploaded anywhere. URLs are revoked when a track is removed and when the player unmounts.
- **Audio engine**: the native HTML5 `<audio>` element, controlled through a React `useRef`. The audio source only changes when the *current track's URL* changes, so adding or removing other tracks never restarts playback.
- **State** (in `App.jsx`):
  - `tracks`: loaded tracks, `[{ name, url }]`
  - `currentTrack`: zero-based index of the active track
  - `isPlaying`: whether audio is currently playing
  - `currentTime` / `duration`: seconds, synced from the audio element's `onTimeUpdate` and `onLoadedMetadata` events
  - `volume` / `isMuted`: volume from `0.0` to `1.0` (saved to `localStorage`) and the mute flag
  - `isShuffle` / `isRepeat`: playback mode toggles
  - `isPlaylistOpen` / `isDraggingFiles`: UI state for the queue drawer and drop overlay

## Known Issues

- [ ] **Unhandled play() rejections**: `togglePlay` and the repeat branch of `playNext` don't catch a rejected `audio.play()` promise.
- [ ] **Partial accessibility labels**: shuffle, previous, play/pause, next, repeat, and "Load files" need descriptive `aria-label`s.
- [ ] **CSS cleanup**: duplicate `.controls` rules and an unused `.control-button` class in `App.css`.
- [ ] **Emoji icons** can render differently across operating systems.

## Roadmap

### Phase 1: Core Reliability & Refactoring

- [x] Fix state setter bug in `playPrevious` and `playNext`
- [x] Unify `handleEnded` logic with shuffle/repeat behavior
- [x] Revoke object URLs to prevent memory leaks on large playlists

### Phase 2: Quality of Life

- [x] **Playlist drawer / queue view**: collapsible track list with active-track highlight and click-to-play
- [x] **Remove tracks from the queue**
- [x] **Drag & drop**: drop audio files anywhere in the browser window
- [x] **Mute toggle** that keeps your chosen volume
- [x] **Volume persistence** between sessions
- [ ] **ID3 metadata**: read artist, album, and cover art with `music-metadata-browser` or `jsmediatags`
- [ ] **Keyboard shortcuts**: `Space` play/pause, `←`/`→` seek ±5s, `↑`/`↓` volume
- [ ] **Remember the last played track** between sessions (needs IndexedDB, since blob URLs don't survive a reload)

### Phase 3: Small Updates

- [ ] Add `aria-label`s to all playback buttons
- [ ] Handle `audio.play()` rejections consistently
- [ ] Clear queue button, and an undo toast after removing a track
- [ ] Reorder the queue (drag rows or up/down buttons)
- [ ] Show track durations in the queue and auto-scroll to the active track
- [ ] Queue search / filter
- [ ] Skip or warn about duplicate files; toast feedback such as "Added 5 tracks"
- [ ] Show the current track in the page title
- [ ] Media Session API (OS media keys and lock-screen controls)
- [ ] More shortcuts: `M` mute, `N`/`P` next/previous, `S` shuffle, `R` repeat, `Q` toggle queue
- [ ] Playback speed control and a sleep timer
- [ ] Installable PWA with offline support

## Visual Goals

### Quick visual wins

- [ ] Replace emoji with consistent inline SVG icons (play, pause, previous, next, shuffle, repeat, volume)
- [ ] Filled seek bar that shows progress in the accent colour
- [ ] Volume icon that reflects the level (muted / low / high)
- [ ] Smooth queue open/close animation and a fade-out when removing a track
- [ ] Animated equalizer bars on the active queue row
- [ ] Marquee scroll for long track titles on hover
- [ ] A friendlier empty state ("Drop audio files here or click Load files")
- [ ] Consistent hover, focus, and pressed states across all buttons

### Medium

- [ ] Album art panel with a placeholder cover (pairs with ID3 metadata)
- [ ] Accent colour pulled from the album art
- [ ] Light theme and accent palettes, respecting `prefers-color-scheme`
- [ ] Mobile-first layout with larger touch targets and a docked controls bar
- [ ] Compact "mini player" mode

### Ambitious

- [ ] Audio visualizer (canvas bars or waveform) using a Web Audio `AnalyserNode`
- [ ] Waveform-style seek bar generated from the decoded audio
- [ ] Blurred album-art background that fades between tracks

## Contributing

Issues and pull requests are welcome. Please run `npm run lint` before submitting changes.

## License

Add your license of choice here (for example, MIT).

Test for git