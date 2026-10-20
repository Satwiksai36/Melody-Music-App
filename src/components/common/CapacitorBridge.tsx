import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen as CapSplashScreen } from '@capacitor/splash-screen';

/**
 * CapacitorBridge handles mobile-native Android integrations:
 * - Status bar styling & safe background
 * - Splash screen dismiss after initial render
 * - Android hardware back button navigation
 * - Deep linking (e.g. melody://callback for Spotify OAuth)
 */
export const CapacitorBridge: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // 1. Configure Android status bar
    StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    StatusBar.setBackgroundColor({ color: '#0d0c14' }).catch(() => {});

    // 2. Hide native splash screen smoothly
    CapSplashScreen.hide().catch(() => {});

    // 3. Handle App deep links (e.g., OAuth redirects)
    const urlListener = CapApp.addListener('appUrlOpen', (event) => {
      try {
        const url = new URL(event.url);
        // Handle custom scheme: melody://callback?code=...
        if (url.protocol === 'melody:' || url.host === 'in.melody.music') {
          const path = url.pathname || (url.host === 'callback' ? '/callback' : '');
          const search = url.search || '';
          navigate(path + search);
        }
      } catch (err) {
        console.warn('Failed to parse incoming deep link URL:', event.url, err);
      }
    });

    // 4. Handle Android hardware back button
    const backListener = CapApp.addListener('backButton', () => {
      // If at root pages, let user minimize app
      if (location.pathname === '/home' || location.pathname === '/splash') {
        CapApp.minimizeApp().catch(() => {});
      } else {
        navigate(-1);
      }
    });

    return () => {
      urlListener.then((h) => h.remove()).catch(() => {});
      backListener.then((h) => h.remove()).catch(() => {});
    };
  }, [navigate, location]);

  return null;
};
