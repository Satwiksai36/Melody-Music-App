import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';
import { MiniPlayer } from '../player/MiniPlayer';
import { FullScreenPlayer } from '../player/FullScreenPlayer';

export const AppLayout: React.FC = () => {
  const location = useLocation();

  // Hide bottom navigation & mini-player on splash, auth, onboarding, and dedicated player/lyrics routes
  const hideChrome =
    location.pathname === '/' ||
    location.pathname === '/splash' ||
    location.pathname === '/load' ||
    location.pathname === '/melody_app_load_screen' ||
    location.pathname === '/auth' ||
    location.pathname === '/login' ||
    location.pathname === '/onboarding' ||
    location.pathname.startsWith('/player') ||
    location.pathname.startsWith('/lyrics');

  const isDedicatedPlayerRoute =
    location.pathname.startsWith('/player') || location.pathname.startsWith('/lyrics');

  return (
    <div className="w-full min-h-screen bg-[#ede8f5] flex justify-center items-center p-0 sm:py-6">
      {/* Mobile Device Frame */}
      <div className="w-full max-w-[420px] h-[100dvh] sm:h-[844px] bg-surface flex flex-col relative overflow-hidden sm:rounded-[44px] sm:shadow-[0_25px_70px_rgba(66,29,219,0.25)] sm:border-[8px] sm:border-[#181824]">
        {/* Sleek Device Notch Pill for Desktop Simulator View */}
        <div className="hidden sm:flex absolute top-2 left-1/2 -translate-x-1/2 z-50 w-24 h-4 bg-[#181824] rounded-full items-center justify-center gap-2 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#2a2a38]"></span>
          <span className="w-8 h-1 rounded-full bg-[#2a2a38]"></span>
        </div>

        {/* Scrollable Mobile Screen Content */}
        <div className="flex-1 w-full overflow-y-auto no-scrollbar relative flex flex-col">
          <Outlet />
        </div>

        {/* Persistent Floating Mini-Player & Bottom Navigation Dock */}
        {!hideChrome && (
          <div className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none flex flex-col w-full">
            <MiniPlayer />
            <BottomNavigation />
          </div>
        )}

        {/* Full-Screen Player Modal (Contained inside Phone Frame for in-app transitions) */}
        {!isDedicatedPlayerRoute && <FullScreenPlayer />}
      </div>
    </div>
  );
};
