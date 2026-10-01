# Local Music Player

A lightweight, client-side web music player built with **React** and **Vite**. Load audio files straight from your machine into the browser and play them back with standard controls, progress tracking, and volume adjustment. No server-side processing and no external database required.

## Features

- **Local file loading**: select multiple audio files via a custom "Load files" button; newly selected files are appended to the current playlist
- **Playback controls**: play/pause, previous, next, shuffle, and repeat (with active-state highlighting)
- **Seek slider**: interactive progress bar with time displayed as `M:SS`
- **Volume control**: custom-styled slider with a live percentage readout
- **Track title display**: the active filename is shown prominently, with long names truncated cleanly with an ellipsis
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

1. Click **Load files** and choose one or more audio files from your computer. Selecting more files later adds them to the end of the current playlist; it does not replace tracks already loaded.
2. Press play, or use the previous/next buttons to move through the loaded tracks.
3. Use the seek slider to jump within a song and the volume slider to adjust loudness.
4. Toggle **Shuffle** or **Repeat** to change how playback advances.

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

- **File handling**: a hidden `<input type="file" multiple accept="audio/*">` is triggered by the "Load files" button.
- **Blob URLs**: each `File` is converted to a local memory URL with `URL.createObjectURL(file)`, so nothing is uploaded anywhere.
- **Audio engine**: the native HTML5 `<audio>` element, controlled through a React `useRef`.
- **State** (in `App.jsx`):
  - `tracks`: loaded tracks, `[{ name, url }]`
  - `currentTrack`: zero-based index of the active track
  - `isPlaying`: whether audio is currently playing
  - `currentTime` / `duration`: seconds, synced from the audio element's `onTimeUpdate` and `onLoadedMetadata` events
  - `volume`: a value from `0.0` to `1.0`
  - `isShuffle` / `isRepeat`: playback mode toggles

## Known Issues

- [ ] **Memory leaks**: object URLs are not released with `URL.revokeObjectURL` when the component unmounts.

## Roadmap

### Phase 1: Core Reliability & Refactoring

- [ ] Revoke object URLs to prevent memory leaks on large playlists

### Phase 2: Quality of Life

- [ ] **ID3 metadata**: read artist, album, and cover art with `music-metadata-browser` or `jsmediatags`
- [ ] **Playlist drawer / queue view**: collapsible track list with active-track highlight and click-to-play
- [ ] **Drag & drop**: drop audio files anywhere in the browser window
- [ ] **Keyboard shortcuts**: `Space` play/pause, `←`/`→` seek ±5s, `↑`/`↓` volume
- [ ] **Local storage persistence**: remember volume and last played track between sessions

## Contributing

Issues and pull requests are welcome. Please run `npm run lint` before submitting changes.

## License

Add your license of choice here (for example, MIT).
