import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MelodyAnimatedLogo } from './MelodyAnimatedLogo';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack = false }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 left-0 right-0 z-40 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] w-full">
      <div className="h-16 px-margin flex items-center justify-between gap-space-sm w-full">
        <div className="flex items-center gap-space-xs">
          {showBack ? (
            <button
              aria-label="Go back"
              onClick={() => navigate(-1)}
              className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-primary active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : null}

          <div
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
          >
            {/* Animated Melody Sonic Logo */}
            <MelodyAnimatedLogo size="sm" />

            {title ? (
              <h1 className="font-headline-sm text-headline-sm text-on-surface truncate ml-1">
                {title}
              </h1>
            ) : (
              <img
                alt="Melody"
                className="h-6 w-auto object-contain cursor-pointer"
                src="/melody-logo.png"
              />
            )}
          </div>
        </div>

        <div className="flex items-center gap-space-xs">
          {!title && (
            <button
              aria-label="Search"
              onClick={() => navigate('/search')}
              className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[24px]">search</span>
            </button>
          )}

          <button
            aria-label="Profile"
            onClick={() => navigate('/profile')}
            className="w-11 h-11 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
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
  );
};
