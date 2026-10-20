import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import { AppLayout } from './components/layout/AppLayout';
import { SplashScreen } from './screens/SplashScreen';
import { AuthScreen } from './screens/AuthScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { LibraryScreen } from './screens/LibraryScreen';
import { AlbumDetailScreen } from './screens/AlbumDetailScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { PlayerScreen } from './screens/PlayerScreen';

export const App: React.FC = () => {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <Routes>
          {/* All screens wrapped in AppLayout for consistent mobile container view */}
          <Route element={<AppLayout />}>
            {/* 1. Splash / Load Screen */}
            <Route path="/" element={<SplashScreen />} />
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/load" element={<SplashScreen />} />
            <Route path="/melody_app_load_screen" element={<SplashScreen />} />

            {/* 2. Authentication Screen */}
            <Route path="/login" element={<AuthScreen />} />
            <Route path="/auth" element={<AuthScreen />} />

            {/* 3. Onboarding / Languages & Artists Setup */}
            <Route path="/discover" element={<OnboardingScreen />} />
            <Route path="/onboarding" element={<OnboardingScreen />} />

            {/* 4. Home & Discover Screen */}
            <Route path="/home" element={<HomeScreen />} />

            {/* 5. Search & Song Results */}
            <Route path="/search" element={<SearchScreen />} />

            {/* 6. Library & Playlists */}
            <Route path="/library" element={<LibraryScreen />} />

            {/* 7. Movie Album & Playlist Screen */}
            <Route path="/album/:id" element={<AlbumDetailScreen />} />

            {/* 8. Now Playing Player */}
            <Route path="/player" element={<PlayerScreen />} />
            <Route path="/player/:id" element={<PlayerScreen />} />

            {/* 9. Synced Line Lyrics */}
            <Route path="/lyrics" element={<PlayerScreen initialLyricsMode="line" openLyrics={true} />} />
            <Route path="/lyrics/:id" element={<PlayerScreen initialLyricsMode="line" openLyrics={true} />} />

            {/* 10. Word-by-Word Synced Karaoke Lyrics */}
            <Route path="/lyrics/:id/word-sync" element={<PlayerScreen initialLyricsMode="word" openLyrics={true} />} />

            {/* 11. Profile & Settings */}
            <Route path="/settings" element={<ProfileScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </PlayerProvider>
  );
};

export default App;
