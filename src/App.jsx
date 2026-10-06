import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    try {
      const savedVolume = localStorage.getItem("music-player-volume");

      if (savedVolume === null) return 1;

      const parsedVolume = Number(savedVolume);
      return Number.isFinite(parsedVolume) && parsedVolume >= 0 && parsedVolume <= 1
        ? parsedVolume
        : 1;
    } catch {
      return 1;
    }
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const trackUrlsRef = useRef(new Set());

  // Release every local file URL when the player unmounts.
  useEffect(() => () => {
    trackUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    trackUrlsRef.current.clear();
  }, []);

  // Keep the audio element and the saved browser preference in sync.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }

    try {
      localStorage.setItem("music-player-volume", String(volume));
    } catch {
      // Continue playing normally when browser storage is unavailable.
    }
  }, [volume]);

  // Add local music files to the current playlist.
  const handleFiles = (event) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    const newTracks = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    newTracks.forEach(({ url }) => trackUrlsRef.current.add(url));

    setTracks((currentTracks) => [...currentTracks, ...newTracks]);

    // Clear the input so selecting the same file again can add another copy.
    event.target.value = "";
  };

  // Change the audio source when the current track changes
  useEffect(() => {
    if (!audioRef.current || tracks.length === 0) return;

    audioRef.current.src = tracks[currentTrack].url;
    audioRef.current.load();

    setCurrentTime(0);
    setDuration(0);

    if (isPlaying) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [currentTrack, tracks]);

  // Play / pause toggle
  const togglePlay = () => {
    if (!audioRef.current || tracks.length === 0) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleShuffle = () => setIsShuffle((prev) => !prev);
  const toggleRepeat = () => setIsRepeat((prev) => !prev);

  // Previous track
  const playPrevious = () => {
    if (tracks.length === 0) return;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrack(randomIndex);
    } else {
      setCurrentTrack((prevIndex) =>
        prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
      );
    }
    setIsPlaying(true);
  };

  // Next track
  const playNext = () => {
    if (tracks.length === 0) return;

    if (isRepeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrack(randomIndex);
    } else {
      setCurrentTrack((prevIndex) => (prevIndex + 1) % tracks.length);
    }
    setIsPlaying(true);
  };

  // Update progress
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    setCurrentTime(audioRef.current.currentTime);
  };

  // Get duration after audio loads
  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;

    setDuration(audioRef.current.duration);
  };

  // Seek through the track
  const handleSeek = (event) => {
    const newTime = Number(event.target.value);

    if (!audioRef.current) return;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (event) => {
    const newVolume = Number(event.target.value);

    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;

      if (newVolume > 0 && audioRef.current.muted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  // Mute or restore the current audio without changing the selected volume.
  const toggleMute = () => {
    if (!audioRef.current || tracks.length === 0) return;

    const shouldMute = !audioRef.current.muted;
    audioRef.current.muted = shouldMute;
    setIsMuted(shouldMute);
  };

  // Automatically move to the next track when a song ends
  const handleEnded = () => {
    if (!audioRef.current || tracks.length === 0) return;

    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setIsPlaying(false));
      return;
    }

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrack(randomIndex);
    } else {
      setCurrentTrack((prevIndex) => (prevIndex + 1) % tracks.length);
    }
    setIsPlaying(true);
  };

  // Format seconds into M:SS
  const formatTime = (time) => {
    if (!Number.isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="app">
      <main className="player">
        <h1>Music player</h1>

        <input
          ref={fileInputRef}
          className="file-input"
          type="file"
          accept="audio/*"
          multiple
          onChange={handleFiles}
        />

        <button
          className="load-button"
          onClick={() => fileInputRef.current.click()}
        >
          Load files
        </button>

        {tracks.length === 0 ? (
          <p className="no-tracks">No tracks loaded</p>
        ) : (
          <>
            <div className="track-info">
              <div className="track-name">{tracks[currentTrack].name}</div>

              <div className="track-counter">
                Track {currentTrack + 1} of {tracks.length}
              </div>
            </div>

            <div className="time-display">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>

            <input
              className="seek-bar"
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              disabled={!duration}
            />

            <div className="controls">
              <button
                className={`control-btn ${isShuffle ? "active" : ""}`}
                onClick={toggleShuffle}
                disabled={tracks.length === 0}
              >
                🔀︎
              </button>

              <button
                className="control-btn"
                onClick={playPrevious}
                disabled={tracks.length === 0}
              >
                ⏮
              </button>

              <button
                className="play-button"
                onClick={togglePlay}
                disabled={tracks.length === 0}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>

              <button
                className="control-btn"
                onClick={playNext}
                disabled={tracks.length === 0}
              >
                ⏭
              </button>

              <button
                className={`control-btn ${isRepeat ? "active" : ""}`}
                onClick={toggleRepeat}
                disabled={tracks.length === 0}
              >
                🔁︎
              </button>
            </div>

            <div className="volume-control">
              <span className="volume-icon">🔊</span>

              <button
                className={`mute-button volume-icon ${isMuted ? "active" : ""}`}
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                aria-pressed={isMuted}
              >
                {isMuted ? "\u{1F507}" : "\u{1F50A}"}
              </button>

              <input
                className="volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                aria-label="Volume"
              />

              <span className="volume-value">{Math.round(volume * 100)}%</span>
            </div>

            <section className="playlist" aria-label="Playlist">
              <button
                className="playlist-toggle"
                type="button"
                onClick={() => setIsPlaylistOpen((isOpen) => !isOpen)}
                aria-expanded={isPlaylistOpen}
                aria-controls="playlist-tracks"
              >
                <span>Queue</span>
                <span className="playlist-count">{tracks.length} tracks</span>
                <span className="playlist-chevron" aria-hidden="true">
                  {isPlaylistOpen ? "−" : "+"}
                </span>
              </button>

              {isPlaylistOpen && (
                <ol className="playlist-tracks" id="playlist-tracks">
                  {tracks.map((track, index) => (
                    <li key={track.url}>
                      <button
                        className={`playlist-track ${index === currentTrack ? "active" : ""}`}
                        type="button"
                        onClick={() => {
                          setCurrentTrack(index);
                          setIsPlaying(true);
                        }}
                        aria-current={index === currentTrack ? "true" : undefined}
                        aria-label={`Play ${track.name}`}
                      >
                        <span className="playlist-track-number">{index + 1}</span>
                        <span className="playlist-track-name">{track.name}</span>
                        {index === currentTrack && (
                          <span className="playlist-now-playing">{isPlaying ? "Playing" : "Selected"}</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </>
        )}

        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </main>
    </div>
  );
}

export default App;
