import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../../context/PlayerContext';

export const SyncedLyricsOverlay: React.FC = () => {
  const {
    currentTrack,
    currentTime,
    seekTo,
    isLyricsOpen,
    setLyricsOpen,
    lyricsMode,
    setLyricsMode,
  } = usePlayer();

  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const lyrics = currentTrack.lyrics || [];

  // Find active line index
  const activeLineIndex = lyrics.findIndex(
    (line) => currentTime >= line.startTime && currentTime <= line.endTime
  );

  // Auto-scroll to active lyric
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeLineIndex]);

  if (!isLyricsOpen) return null;

  const hasWordSync = lyrics.some((line) => line.words && line.words.length > 0);

  return (
    <div className="absolute inset-0 z-30 flex flex-col rounded-3xl backdrop-blur-2xl bg-surface/95 border border-outline-variant/30 shadow-2xl p-5 transition-all duration-300">
      {/* Header inside lyrics overlay */}
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-ping"></span>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-primary font-bold tracking-tight">
              Synchronized Lyrics
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {lyricsMode === 'word' && hasWordSync
                ? 'Karaoke Word Sync'
                : lyrics.length > 0
                ? 'Line-by-Line Flow'
                : 'Instrumental Track'}
            </span>
          </div>
        </div>

        {/* Mode Switcher Pill & Close Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-container rounded-full p-0.5">
            <button
              onClick={() => {
                if (hasWordSync) {
                  setLyricsMode('word');
                }
              }}
              title={hasWordSync ? 'Switch to Karaoke word sync' : 'Word-level sync unavailable for this track'}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                lyricsMode === 'word' && hasWordSync
                  ? 'bg-primary text-on-primary shadow-sm'
                  : hasWordSync
                  ? 'text-on-surface-variant hover:text-on-surface'
                  : 'text-outline/40 cursor-not-allowed'
              }`}
            >
              Karaoke {hasWordSync ? '' : '•'}
            </button>
            <button
              onClick={() => setLyricsMode('line')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                lyricsMode === 'line' || !hasWordSync
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Standard
            </button>
          </div>

          <button
            aria-label="Close Lyrics"
            onClick={() => setLyricsOpen(false)}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-transform active:scale-90"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>

      {/* Lyrics Scrollable Reel */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto no-scrollbar lyrics-scroll-mask py-8 px-2 flex flex-col gap-6"
      >
        {lyrics.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2 text-outline">
              music_note
            </span>
            <p className="font-body-md font-semibold text-on-surface">Lossless Instrumental Segment</p>
            <p className="font-body-sm text-outline">Enjoy the melody</p>
          </div>
        ) : (
          lyrics.map((line, idx) => {
            const isCurrentLine = idx === activeLineIndex;
            const isPast = currentTime > line.endTime;

            return (
              <div
                key={line.id}
                ref={isCurrentLine ? activeLineRef : undefined}
                onClick={() => seekTo(line.startTime)}
                className={`cursor-pointer transition-all duration-300 select-none py-1.5 px-2 rounded-xl text-left ${
                  isCurrentLine
                    ? 'scale-105 bg-primary-fixed/20'
                    : isPast
                    ? 'opacity-60'
                    : 'opacity-35 hover:opacity-75'
                }`}
              >
                {/* Word-by-Word Rendering */}
                {lyricsMode === 'word' && line.words && line.words.length > 0 ? (
                  <p className="font-headline-sm text-headline-sm leading-relaxed tracking-tight flex flex-wrap items-center">
                    {line.words.map((w, wIdx) => {
                      const isWordActive =
                        currentTime >= w.startTime && currentTime <= w.endTime;
                      const isWordSung = currentTime > w.endTime;

                      return (
                        <span
                          key={wIdx}
                          className={`karaoke-word ${
                            isWordActive
                              ? 'active-vocal'
                              : isWordSung
                              ? 'sung-word'
                              : 'future-word'
                          }`}
                        >
                          {w.word}
                        </span>
                      );
                    })}
                  </p>
                ) : (
                  /* Standard Line-by-Line Rendering */
                  <p
                    className={`font-headline-sm text-headline-sm leading-relaxed tracking-tight ${
                      isCurrentLine
                        ? 'text-primary font-bold drop-shadow-sm'
                        : isPast
                        ? 'text-on-surface font-semibold'
                        : 'text-on-surface-variant font-medium'
                    }`}
                  >
                    {line.text}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info inside lyrics */}
      <div className="pt-2 flex items-center justify-between text-xs text-outline border-t border-outline-variant/20">
        <span>Tap any line to jump</span>
        <span className="flex items-center gap-1 font-semibold text-primary">
          <span className="material-symbols-outlined text-[14px]">graphic_eq</span>
          Dolby Synced
        </span>
      </div>
    </div>
  );
};
