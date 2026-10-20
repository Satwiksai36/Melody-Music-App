import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'in.melody.music',
  appName: 'Melody',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  backgroundColor: '#0d0c14',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: '#0d0c14',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    StatusBar: {
      overlaysWebView: false,
      style: 'DARK',
      backgroundColor: '#0d0c14',
    },
    App: {
      // Handles deep links like melody://callback for Spotify OAuth return
    },
  },
};

export default config;
