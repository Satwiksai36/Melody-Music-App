# Melody — Android Capacitor Integration & Release Guide

Melody has been packaged as a high-performance native Android application using **Capacitor 6** without altering any Stitch visual designs or frontend architectures.

---

## 1. Application Identity & Configuration

- **App Name**: `Melody`
- **Application ID (Package Name)**: `in.melody.music`
  - *To change before production release*: Update `appId` in `capacitor.config.ts`, `namespace` and `applicationId` in `android/app/build.gradle`, and the package folder structure in `android/app/src/main/java/`.
- **Primary Orientation**: `portrait` (configured in `AndroidManifest.xml`)
- **Theme Color**: `#0d0c14` (Deep Velvet Dark Surface)
- **Web Build Directory**: `dist/`

---

## 2. Prerequisites & Android Studio Setup

### Requirements
1. **Java Development Kit (JDK)**: JDK 17 or JDK 21 (Eclipse Temurin or OpenJDK recommended).
2. **Android Studio**: Android Studio Hedgehog (2023.1.1) or newer / Jellyfish / Ladybug.
3. **Android SDK**:
   - `compileSdk`: 34 (Android 14)
   - `minSdk`: 22 (Android 5.1 Lollipop)
   - `targetSdk`: 34 (Android 14)
4. **Android Build Tools**: 34.0.0+

### Opening the Project in Android Studio
Run:
```bash
npm run cap:open
```
Or open the `android/` directory directly in Android Studio.

---

## 3. Build & Sync Commands

| Command | Action |
|---|---|
| `npm run build` | Compiles TypeScript and builds production web assets to `dist/` |
| `npm run cap:sync` | Builds web app and synchronizes web assets + Capacitor plugins to Android |
| `npm run cap:open` | Launches Android Studio with the `android/` project |
| `npm run android:build` | Syncs and builds an assembleDebug APK via Gradle |

---

## 4. Mobile Native Features Implemented

### A. Android System UI & Safe Areas
- **Status Bar**: Integrated `@capacitor/status-bar` configured with Dark style and background `#0d0c14`.
- **Display Cutouts & Notches**: Supported via CSS `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` through `.pt-safe` and `.pb-safe` classes in `src/index.css`.
- **Hardware Back Button**: Handled in `CapacitorBridge.tsx` via `@capacitor/app`. Pressing Back navigates the router history (`navigate(-1)`) or minimizes the app when at home/splash roots.

### B. App Icon & Splash Screen
- **App Icons**: High-resolution adaptive launcher icons (`ic_launcher.png`, `ic_launcher_round.png`, `ic_launcher_foreground.png`) generated across `mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi` using the official Melody logo.
- **Splash Screen**: Configured with `@capacitor/splash-screen`, centering the Melody branding over `#0d0c14` background with smooth fade-out.

### C. Deep Linking & Authentication Redirects
- **Scheme 1**: `melody://callback`
- **Scheme 2**: `in.melody.music://*`
- When Spotify OAuth authorization completes in Chrome Custom Tabs or browser, the user is redirected back into Melody via `CapacitorBridge`, triggering `SpotifyCallbackScreen` automatically.

### D. Audio Lifecycle & MediaSession Controls
- Implemented `navigator.mediaSession` with full metadata (`title`, `artist`, `album`, `artwork`) and action handlers:
  - Play / Pause
  - Next Track / Previous Track
  - Seek To / Seek Backward (10s) / Seek Forward (10s)
- Displays native Android playback controls on lock screen, notification drawer, and connected Bluetooth audio devices/car displays.
- Required Android Permissions enabled in `AndroidManifest.xml`:
  - `android.permission.INTERNET`
  - `android.permission.ACCESS_NETWORK_STATE`
  - `android.permission.WAKE_LOCK`
  - `android.permission.FOREGROUND_SERVICE`
  - `android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK`

---

## 5. Device Testing Checklist

When deploying to a physical Android device or emulator (`adb install`):

1. **Screen Transitions**: Navigate between Home, Search, Library, Album Details, and Full-screen Player.
2. **Lock Screen Controls**: Lock phone while playing; verify Melody track title, artist, artwork, and play/pause controls appear in the Android lock screen media player.
3. **App Switching / Backgrounding**: Press Home or switch to another app; verify audio continues playing.
4. **Network Reconnection**: Turn off Wi-Fi/data while streaming; observe proper unavailable toast state without UI crash; restore connection and tap Play.
5. **Hardware Back Button**: Press Android Back button on deep screens (e.g. Album Detail or Lyrics) to confirm smooth return navigation.

---

## 6. Release Preparation & APK/AAB Signing

### Step 1: Generate Release Keystore (Do NOT commit to git)
```bash
keytool -genkey -v -keystore melody-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias melody-key
```

### Step 2: Configure Signing in `android/app/build.gradle` (or via Android Studio)
In Android Studio:
1. Go to **Build > Generate Signed Bundle / APK...**
2. Choose **Android App Bundle (AAB)** for Google Play Store, or **APK** for direct testing.
3. Select your `melody-release-key.jks`, enter credentials, and select **release**.

### Step 3: Command-Line Release Build
```bash
cd android
./gradlew bundleRelease
# Or for APK:
./gradlew assembleRelease
```
The output will be generated at `android/app/build/outputs/bundle/release/app-release.aab`.

---

## 7. Platform & Playback Limitations

1. **Spotify Web Playback SDK on Android WebView**:
   - The Spotify Web Playback SDK is designed for desktop/mobile browsers supporting Encrypted Media Extensions (EME / Widevine).
   - In standard Android WebViews, Spotify accounts without Premium access can stream 30-second previews.
   - For unrestricted full playback within Spotify, the Spotify Premium subscription requirement applies.
2. **Offline Local Playback**:
   - Melody's built-in offline engine and cached tracks stream without any Spotify dependency.
3. **Audio Focus Interruption**:
   - Android automatically ducks or pauses audio when a phone call is received, managed gracefully via the browser Audio / MediaSession lifecycle.
