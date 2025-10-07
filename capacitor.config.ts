import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'UNK Bekasi',
  webDir: 'www',
  android: {
    includePlugins: [
       "@capacitor/status-bar",
        "@capacitor/haptics",
        "@capacitor/keyboard",
        "@capacitor/preferences",
        "@capawesome/capacitor-file-picker",
        "@capacitor/app",
        "@capacitor/splash-screen",
    ],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: "#59AC77",
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      androidSplashResourceName: "splash",
    },
    StatusBar: {
      style: 'LIGHT',
      overlaysWebView: false,
      backgroundColor: '#59AC77'
    }
  }
};

export default config;

