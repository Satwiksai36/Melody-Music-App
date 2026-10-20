import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { MOCK_TRACKS } from '../data/mockData';
import { FullScreenPlayer } from '../components/player/FullScreenPlayer';

interface PlayerScreenProps {
  initialLyricsMode?: 'line' | 'word';
  openLyrics?: boolean;
}

export const PlayerScreen: React.FC<PlayerScreenProps> = ({
  initialLyricsMode,
  openLyrics = false,
}) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentTrack,
    playTrack,
    setFullScreenPlayerOpen,
    setLyricsOpen,
    setLyricsMode,
  } = usePlayer();

  useEffect(() => {
    // If specific track ID provided in URL, switch to it
    if (id && id !== currentTrack.id) {
      const found = MOCK_TRACKS.find((t) => t.id === id);
      if (found) {
        playTrack(found);
      }
    }

    setFullScreenPlayerOpen(true);

    const isLyricsPath = location.pathname.includes('/lyrics');
    if (openLyrics || isLyricsPath) {
      setLyricsOpen(true);
      if (initialLyricsMode) {
        setLyricsMode(initialLyricsMode);
      } else if (location.pathname.includes('/word-sync')) {
        setLyricsMode('word');
      } else {
        setLyricsMode('line');
      }
    } else {
      setLyricsOpen(false);
    }

    return () => {
      setFullScreenPlayerOpen(false);
      setLyricsOpen(false);
    };
  }, [id, location.pathname, initialLyricsMode, openLyrics]);

  const handleBack = () => {
    setFullScreenPlayerOpen(false);
    setLyricsOpen(false);
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-surface">
      <FullScreenPlayer onBack={handleBack} forceOpen={true} />
    </div>
  );
};

export default PlayerScreen;
