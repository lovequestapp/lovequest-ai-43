
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.lovequest-dating',
  appName: 'LoveQuest Dating',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#FFFFFF",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#EB5489",
      splashFullScreen: true,
      splashImmersive: true
    }
  },
  server: {
    url: "https://a0e035d3-b5a3-43c7-9e01-ab69c5797013.lovableproject.com?forceHideBadge=true",
    cleartext: true
  }
};

export default config;
