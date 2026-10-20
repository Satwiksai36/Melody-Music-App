import React from 'react';
import { usePlayer } from '../../context/PlayerContext';

export const MiniPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    progressPercent,
    togglePlayPause,
    nextTrack,
    seekPercent,
    setFullScreenPlayerOpen,
  } = usePlayer();

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    seekPercent(pct);
  };

  return (
    <div className="px-margin pb-space-xs pointer-events-auto w-full">
      <div
        id="mini-player"
        onClick={() => setFullScreenPlayerOpen(true)}
        className="relative overflow-hidden rounded-xl bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_8px_20px_rgba(255,94,58,0.22)] border border-outline-variant/20 flex items-center gap-space-sm p-space-xs pr-space-md transition-all duration-300 cursor-pointer active:scale-[0.99]"
      >
        {/* Soft Lavender Rounded Square with Purple Music Note (matching Stitch design) */}
        <div className="w-10 h-10 rounded-default bg-surface-container-high flex-shrink-0 flex items-center justify-center overflow-hidden cursor-pointer active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-primary text-[22px]" id="mini-player-album-icon">
            music_note
          </span>
        </div>

        {/* Track Title & Artist */}
        <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
          <p className="font-label-lg text-label-lg text-on-surface truncate font-semibold" id="mini-player-title">
            {currentTrack.title || 'Samajavaragamana'}
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant truncate" id="mini-player-artist">
            {currentTrack.artist || 'Sid Sriram • Ala Vaikunthapurramuloo'}
          </p>
        </div>

        {/* Action Controls: Circular Coral Play/Pause + Skip Next */}
        <div className="flex items-center gap-space-xs flex-shrink-0">
          {/* Play/Pause Button */}
          <button
            aria-label="Play or Pause"
            id="mini-play-btn"
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-secondary-container text-on-secondary shadow-[0_4px_12px_rgba(254,93,57,0.3)] transition-transform active:scale-90 hover:scale-105 cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              id="mini-play-icon"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Next Track Button */}
          <button
            aria-label="Next Track"
            onClick={(e) => {
              e.stopPropagation();
              nextTrack();
            }}
            className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors active:scale-90 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">skip_next</span>
          </button>
        </div>

        {/* Progress Bar scrubber at the bottom */}
        <div
          onClick={handleScrubberClick}
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-surface-container-high cursor-pointer"
        >
          <div
            className="h-full bg-secondary-container rounded-full transition-all duration-300"
            id="mini-player-progress"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
