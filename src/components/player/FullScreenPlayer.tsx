import React, { useRef, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { SyncedLyricsOverlay } from './SyncedLyricsOverlay';
import { MelodyAnimatedLogo } from '../common/MelodyAnimatedLogo';

interface FullScreenPlayerProps {
  onBack?: () => void;
  forceOpen?: boolean;
}

export const FullScreenPlayer: React.FC<FullScreenPlayerProps> = ({ onBack, forceOpen = false }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    progressPercent,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seekPercent,
    isLiked,
    toggleLike,
    isShuffled,
    toggleShuffle,
    repeatMode,
    cycleRepeatMode,
    playbackQueue,
    queueIndex,
    playFromQueue,
    removeFromQueue,
    isFullScreenPlayerOpen,
    setFullScreenPlayerOpen,
    isLyricsOpen,
    setLyricsOpen,
  } = usePlayer();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLyricsExpanded, setIsLyricsExpanded] = useState<boolean>(false);
  const [showDeviceModal, setShowDeviceModal] = useState<boolean>(false);
  const [showQueueModal, setShowQueueModal] = useState<boolean>(false);
  const [currentDevice, setCurrentDevice] = useState<string>('Melody Stream • HD Audio 24-bit');
  const waveformRef = useRef<HTMLDivElement>(null);

  const liked = isLiked(currentTrack.id);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleClose = () => {
    if (onBack) {
      onBack();
    } else {
      setFullScreenPlayerOpen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleWaveformSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    seekPercent(pct);
  };

  // Generate 42 decorative waveform bars
  const totalBars = 36;
  const barHeights = [
    25, 45, 60, 30, 75, 90, 50, 65, 80, 40, 95, 70, 55, 85, 60, 45, 80, 100, 75, 50,
    90, 65, 40, 85, 70, 55, 95, 60, 45, 75, 90, 50, 65, 40, 70, 35,
  ];

  if (!forceOpen && !isFullScreenPlayerOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-surface overflow-y-auto no-scrollbar select-none transition-all duration-300 w-full max-w-[420px] mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[70] px-4 py-2.5 rounded-full bg-inverse-surface/90 backdrop-blur-md text-inverse-on-surface text-body-sm shadow-xl flex items-center gap-2 animate-fadeIn whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">
            verified
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Matching Stitch code.html */}
      <header className="sticky top-0 w-full z-40 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-margin flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs">
            <button
              aria-label="Go back"
              onClick={handleClose}
              className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-primary active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div
              onClick={handleClose}
              className="cursor-pointer active:scale-95 transition-transform"
            >
              <MelodyAnimatedLogo size="sm" isAnimated={true} />
            </div>
            <h1 className="font-headline-sm text-headline-sm text-on-surface truncate ml-space-xs font-bold">
              Now Playing
            </h1>
          </div>
          <div className="flex items-center gap-space-xs">
            <button
              aria-label="Profile"
              onClick={() => showToast('Profile settings')}
              className="w-11 h-11 flex items-center justify-center active:scale-95 transition-transform"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover shadow-[0_2px_8px_rgba(66,29,219,0.15)] ring-2 ring-primary/20"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRqS3qnQM5TbuqkL-P8_DiCnVXHXj3zMndoTzztD80V9GvZGSFXyHg5dOp0tzLlVagK_rs7PcrvURmclXBFOfNt_bXWlcsw9TVsHWd5nSI7tMzMMk6zE8SVzo_WYyKHif98280rTf_JwqEyWAzvRFDgUxLA0N9rrzxjIi0O-t2CgOrIHcPJNuxO6tzc7PINQeMnR9SpOMs7DdU_77pBlA15-K14QAlLePN6ZvtkBmPkNu-w5vnCiKm4w"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Main Ambient Container */}
      <main className="flex-1 flex flex-col relative w-full pb-12 bg-surface">
        {/* Soft Ambient Glow Mesh Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
          <div className="absolute -top-16 -left-12 w-80 h-80 rounded-full bg-secondary-fixed blur-3xl mix-blend-multiply"></div>
          <div className="absolute top-1/4 -right-16 w-88 h-88 rounded-full bg-primary-fixed-dim blur-3xl mix-blend-multiply"></div>
          <div className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full bg-tertiary-fixed blur-3xl opacity-60 mix-blend-multiply"></div>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col w-full px-margin">
          {/* Top Mini Context Action Row */}
          <div className="flex items-center justify-between py-space-sm">
            <button
              aria-label="Minimize Player"
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface shadow-sm active:scale-95 transition-transform hover:bg-surface-container-high"
            >
              <span className="material-symbols-outlined text-[22px]">keyboard_arrow_down</span>
            </button>

            <div
              onClick={() => showToast('Playing from Telugu Melodies playlist')}
              className="flex flex-col items-center max-w-[210px] text-center cursor-pointer active:opacity-75 transition-opacity"
            >
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant/80">
                Playing from playlist
              </span>
              <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate flex items-center gap-1">
                Telugu Melodies
                <span className="material-symbols-outlined text-[14px] text-secondary">
                  verified
                </span>
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                aria-label="Toggle Lyrics"
                onClick={() => setLyricsOpen(!isLyricsOpen)}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-all ${
                  isLyricsOpen
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
                title="Toggle Synchronized Lyrics"
              >
                <span className="material-symbols-outlined text-[20px]">lyrics</span>
              </button>
              <button
                aria-label="Share Song"
                onClick={() => showToast('Song share link copied to clipboard!')}
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface shadow-sm active:scale-95 transition-transform hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined text-[20px]">ios_share</span>
              </button>
            </div>
          </div>

          {/* Hero Signature Album Art Presentation (~45-50% Viewport impact) */}
          <div className="relative w-full my-space-md flex flex-col items-center">
            {/* Layered vinyl record backdrop disc poking out subtly */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto flex items-center justify-center">
              <div
                className={`absolute w-[92%] h-[92%] rounded-full bg-inverse-surface shadow-xl flex items-center justify-center translate-y-2 opacity-40 transition-transform duration-700 ease-out ${
                  isPlaying ? 'rotate-45' : 'rotate-12'
                }`}
              >
                <div className="w-24 h-24 rounded-full bg-surface-variant flex items-center justify-center border-4 border-inverse-surface">
                  <div className="w-8 h-8 rounded-full bg-surface"></div>
                </div>
              </div>

              {/* Main Illustrated Collage Album Plaque */}
              <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden shadow-[0_20px_36px_rgba(91,66,243,0.18)] bg-surface-container-lowest select-none group">
                <div className="relative w-full h-full bg-gradient-to-tr from-secondary-fixed via-tertiary-fixed to-primary-fixed">
                  {/* Arched artistic backdrop cutouts like inspiration image */}
                  <div className="absolute inset-x-4 bottom-0 top-6 rounded-t-full bg-surface-container-high/80 overflow-hidden flex items-end justify-center">
                    {/* Decorative retro sun rays / rainbow arch */}
                    <svg
                      className="absolute -top-6 w-52 h-52 text-secondary/30"
                      fill="none"
                      viewBox="0 0 100 100"
                    >
                      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeDasharray="4 4" strokeWidth="6"></circle>
                      <circle cx="50" cy="50" r="34" stroke="currentColor" strokeWidth="4"></circle>
                      <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="6"></circle>
                    </svg>

                    {/* Central Duotone/Stylized Singer Character Cutout Image */}
                    <img
                      alt={currentTrack.title}
                      className="relative z-10 w-full h-[90%] object-contain object-bottom drop-shadow-lg transition-transform duration-500 ease-out"
                      src={currentTrack.coverUrl}
                    />
                  </div>

                  {/* Top Floating Badge Over Art */}
                  <div
                    onClick={() => showToast('Dolby Atmos • Lossless Master Studio Grade')}
                    className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md shadow-sm active:scale-95 transition-transform cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                    <span className="font-label-sm text-label-sm text-on-surface">
                      Dolby Atmos • Lossless
                    </span>
                  </div>

                  {/* Sparkle Visualizer Badge */}
                  <button
                    aria-label="Visualizer Mode"
                    onClick={() => showToast('Visualizer spatial audio mode active')}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-surface/85 backdrop-blur-md flex items-center justify-center text-secondary shadow-sm active:scale-90 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  </button>
                </div>
              </div>

              {/* Synced Lyrics Overlay (Slides inside album art container) */}
              <SyncedLyricsOverlay />
            </div>
          </div>

          {/* Track Metadata & Quick Action Group */}
          <div className="flex items-center justify-between mt-space-sm mb-space-md">
            <div className="flex-1 min-w-0 pr-space-sm text-left">
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight truncate">
                {currentTrack.title}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant font-medium truncate mt-0.5">
                {currentTrack.artist}{' '}
                {currentTrack.movieOrAlbum && (
                  <>
                    <span className="text-secondary">•</span>{' '}
                    <span className="text-outline text-body-sm">({currentTrack.movieOrAlbum})</span>
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Favorite Button */}
              <button
                aria-label="Favorite Track"
                onClick={() => toggleLike(currentTrack.id)}
                className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-secondary active:scale-90 transition-all shadow-sm"
              >
                <span
                  className={`material-symbols-outlined text-[24px] transition-transform duration-200 ${
                    liked ? 'text-secondary-container' : ''
                  }`}
                  style={liked ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {liked ? 'favorite' : 'favorite_border'}
                </span>
              </button>

              {/* Add to Playlist Button */}
              <button
                aria-label="Add to Playlist"
                onClick={() => showToast(`Saved "${currentTrack.title}" to Telugu Favorites`)}
                className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant active:scale-90 transition-all shadow-sm hover:text-primary"
              >
                <span className="material-symbols-outlined text-[22px]">playlist_add</span>
              </button>
            </div>
          </div>

          {/* Playback Scrubber: Interactive Sound Wave Section */}
          <div className="w-full bg-surface-container-low p-space-md rounded-2xl shadow-sm mb-space-md relative">
            {/* Tactile Waveform Bars */}
            <div
              ref={waveformRef}
              onClick={handleWaveformSeek}
              className="relative w-full h-16 flex items-center justify-between cursor-pointer py-1 touch-none select-none"
              title="Drag or tap to seek position"
            >
              <div className="absolute inset-0 flex items-center justify-between gap-[3px]">
                {barHeights.map((h, i) => {
                  const barProgress = (i / totalBars) * 100;
                  const isPassed = barProgress <= progressPercent;

                  return (
                    <span
                      key={i}
                      className="wave-bar flex-1 rounded-full transition-colors duration-150"
                      style={{
                        height: `${h}%`,
                        backgroundColor: isPassed ? '#fe5d39' : '#dbd8e9',
                        opacity: isPassed ? 1 : 0.6,
                      }}
                    ></span>
                  );
                })}
              </div>

              {/* Dynamic Playhead Beacon */}
              <div
                className="absolute top-0 bottom-0 pointer-events-none flex flex-col items-center justify-center z-20 transition-[left] duration-75"
                style={{ left: `${progressPercent}%` }}
              >
                <div className="relative flex items-center justify-center -top-1">
                  <span className="absolute w-5 h-5 rounded-full bg-secondary-container/30 beacon-ring"></span>
                  <span className="w-3.5 h-3.5 bg-secondary-container rounded-full ring-2 ring-surface-container-lowest shadow-[0_2px_6px_rgba(254,93,57,0.5)]"></span>
                </div>
                <span className="w-1.5 h-12 bg-gradient-to-b from-[#fe5d39] to-[#ea580c] rounded-full shadow-[0_0_12px_rgba(254,93,57,0.7)]"></span>
              </div>
            </div>

            {/* Scrubber Timers */}
            <div className="flex items-center justify-between mt-2 pt-1 font-body-sm text-body-sm">
              <span className="text-secondary font-bold tracking-tight">
                {formatTime(currentTime)}
              </span>
              <div className="flex items-center gap-1 text-on-surface-variant/70 font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[14px]">graphic_eq</span>
                <span>Adaptive Bitrate</span>
              </div>
              <span className="text-on-surface-variant font-medium">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Core Physical Playback Control Hub */}
          <div className="flex items-center justify-between px-space-xs mb-space-lg">
            {/* Shuffle Button (Active glowing state) */}
            <button
              aria-label="Shuffle On"
              onClick={toggleShuffle}
              className={`w-11 h-11 rounded-full flex items-center justify-center relative active:scale-90 transition-transform shadow-sm ${
                isShuffled
                  ? 'bg-primary-fixed text-primary'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">shuffle</span>
              {isShuffled && (
                <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-primary"></span>
              )}
            </button>

            {/* Previous Track */}
            <button
              aria-label="Previous Track"
              onClick={prevTrack}
              className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary active:scale-90 transition-transform"
            >
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                skip_previous
              </span>
            </button>

            {/* Hero Play / Pause Controller Button */}
            <div className="relative flex items-center justify-center">
              {isPlaying && (
                <span className="absolute w-24 h-24 rounded-full bg-primary-container/40 aura-pulse pointer-events-none"></span>
              )}
              <button
                aria-label={isPlaying ? 'Pause Song' : 'Play Song'}
                onClick={togglePlayPause}
                className={`relative z-10 w-20 h-20 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-[0_12px_28px_rgba(91,66,243,0.35)] active:scale-95 hover:bg-primary transition-all duration-200 ${
                  isPlaying ? 'play-pulsing' : ''
                }`}
              >
                <span
                  className="material-symbols-outlined text-[38px] transition-transform duration-150"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
            </div>

            {/* Next Track */}
            <button
              aria-label="Next Track"
              onClick={nextTrack}
              className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary active:scale-90 transition-transform"
            >
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                skip_next
              </span>
            </button>

            {/* Repeat Toggle */}
            <button
              aria-label="Repeat Mode"
              onClick={cycleRepeatMode}
              className={`w-11 h-11 rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-sm ${
                repeatMode !== 'off'
                  ? 'bg-surface-container text-secondary'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {repeatMode === 'one' ? 'repeat_one' : 'repeat'}
              </span>
            </button>
          </div>

          {/* Bottom Audio Utility & Queue Preview Drawer Sheet */}
          <div className="w-full flex flex-col gap-2.5">
            {/* Output Device Routing Chip */}
            <div className="w-full flex items-center justify-between px-space-md py-2.5 rounded-2xl bg-surface-container-low shadow-sm">
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">speaker_group</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant/80 uppercase">
                    Connected Device
                  </span>
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold flex items-center gap-1">
                    {currentDevice}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDeviceModal(true)}
                className="px-3 py-1 rounded-full bg-surface text-on-surface font-label-sm text-label-sm font-bold shadow-xs active:scale-95 transition-transform hover:bg-surface-container"
              >
                Change
              </button>
            </div>

            {/* Quick Lyrics Glance & Up Next Peek Pull Bar */}
            <div className="w-full rounded-2xl bg-surface-container p-space-md shadow-sm flex flex-col gap-space-sm transition-all duration-300">
              <div
                onClick={() => showToast('Opening Playback Queue (14 songs)')}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">
                    queue_music
                  </span>
                  <span className="font-title-md text-title-md text-on-surface font-bold">
                    Up Next: Butta Bomma
                  </span>
                </div>
                <div className="flex items-center gap-1 font-label-md text-label-md text-primary font-bold active:scale-95 transition-transform">
                  <span>Queue (14)</span>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </div>
              </div>

              {/* Lyrics Snippet Peek Line (expandable) */}
              <div
                onClick={() => setIsLyricsExpanded(!isLyricsExpanded)}
                className="px-3 py-2 rounded-xl bg-surface-container-lowest/80 flex flex-col gap-2 cursor-pointer transition-all duration-300 hover:bg-surface-container-lowest text-left"
              >
                <div className="flex items-center justify-between w-full">
                  <p className="font-body-sm text-body-sm text-on-surface-variant italic truncate max-w-[80%]">
                    "Samajavaragamana... Ninu choosi aagagalaana..."
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                      Lyrics
                    </span>
                    <span
                      className={`material-symbols-outlined text-[16px] text-secondary transition-transform duration-300 ${
                        isLyricsExpanded ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Collapsible Accordion Lyrics */}
                {isLyricsExpanded && (
                  <div className="pt-2 border-t border-surface-variant/40 flex flex-col gap-1.5 text-center animate-fadeIn">
                    <p className="font-body-sm text-body-sm text-on-surface-variant/70">
                      Mallela vaanala navvula thoothina vela
                    </p>
                    <p className="font-body-md text-body-md font-bold text-secondary">
                      "Samajavaragamana... Ninu choosi aagagalaana..."
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant/70">
                      Naluguriki thelisela cheppana praanam meeda
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant/60">
                      Gunde layalone nindi unna prema...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Device Routing Selector Modal */}
      {showDeviceModal && (
        <div
          onClick={() => setShowDeviceModal(false)}
          className="absolute inset-0 z-50 flex items-end justify-center bg-inverse-surface/40 backdrop-blur-xs p-0 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-surface-container-lowest rounded-t-3xl p-space-lg shadow-2xl flex flex-col gap-space-md"
          >
            <div className="flex items-center justify-between pb-2 border-b border-surface-variant/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">devices</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Connect to a Device
                </h3>
              </div>
              <button
                aria-label="Close Device Selector"
                onClick={() => setShowDeviceModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setCurrentDevice('Melody Stream • HD Audio 24-bit');
                  setShowDeviceModal(false);
                  showToast('Connected to Melody Stream');
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-surface-container-high/60 border-2 border-primary text-left transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">speaker_group</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-title-md text-title-md font-bold text-on-surface">
                      Melody Stream
                    </span>
                    <span className="font-body-sm text-body-sm text-primary font-medium">
                      HD Audio 24-bit • Connected
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-primary text-[22px]">check_circle</span>
              </button>

              <button
                onClick={() => {
                  setCurrentDevice('Living Room Echo Studio');
                  setShowDeviceModal(false);
                  showToast('Connected to Living Room Echo Studio');
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high text-left transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">speaker</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-title-md text-title-md font-bold text-on-surface">
                      Living Room Echo Studio
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Lossless Spatial Available
                    </span>
    