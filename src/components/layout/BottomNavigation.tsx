import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'home', label: 'Home', icon: 'home', path: '/home' },
    { id: 'search', label: 'Search', icon: 'search', path: '/search' },
    { id: 'library', label: 'Library', icon: 'library_music', path: '/library' },
    { id: 'profile', label: 'Profile', icon: 'person', path: '/profile' },
  ];

  return (
    <nav
      className="w-full pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(24,24,36,0.04)] pointer-events-auto"
      data-active-classes="text-primary font-bold"
    >
      <div className="flex justify-around items-center h-16 px-space-xs w-full" id="bottom-nav">
        {tabs.map((tab) => {
          const isActive =
            location.pathname === tab.path ||
            (tab.id === 'profile' && location.pathname === '/settings') ||
            (tab.path === '/home' && location.pathname === '/');

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              aria-current={isActive ? 'page' : undefined}
              className={`nav-item flex flex-col items-center justify-center gap-space-xs w-16 h-12 transition-colors cursor-pointer active:scale-95 ${
                isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              <span className="font-label-sm text-label-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
