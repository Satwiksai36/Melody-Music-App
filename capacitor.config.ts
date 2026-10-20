import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'in.melody.music',
  appName: 'Melody',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  backgroundColor: '#fcf8ff',
};

export default config;
