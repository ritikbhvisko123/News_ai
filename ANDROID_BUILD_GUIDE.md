# Indore & Beyond News — Android APK / AAB Build Guide

This project is architected as a Progressive Web App (PWA) with complete offline caching, and is pre-configured to build directly into a high-performance native Android application using **Capacitor**.

---

## 1. Prerequisites
- **Node.js**: v18+ or v20+
- **Android Studio**: Android Studio Hedgehog / Iguana / Ladybug or newer
- **Java Development Kit (JDK)**: JDK 17 (bundled with Android Studio)
- **Android SDK**: API Level 34+

---

## 2. Environment Variables (.env)
Create or verify your `.env` file in the root directory:
```env
# Port & URL
PORT=3000
APP_URL="https://your-domain.com"

# Optional: Real News APIs (the app already integrates rich live RSS feeds
# from Dainik Bhaskar, Free Press Journal Indore, The Hindu, Times of India, etc.)
GNEWS_API_KEY=""
NEWS_API_KEY=""
NEWSDATA_API_KEY=""
```

---

## 3. Step-by-Step Android Build Commands

### Step 1: Install Capacitor Dependencies
Run the following in the project root:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/status-bar @capacitor/splash-screen @capacitor/push-notifications
```

### Step 2: Build the Web App Production Assets
```bash
npm run build
```
This generates the optimized, production-ready single-page application and service worker into the `/dist` directory.

### Step 3: Add the Android Native Platform
```bash
npx cap add android
```
This creates the `/android` directory with the native Gradle project.

### Step 4: Generate Splash Screens and App Icons
Capacitor provides an automated asset generator. Run:
```bash
npm install -g @capacitor/assets
npx @capacitor/assets generate --iconBackgroundColor '#dc2626' --splashBackgroundColor '#dc2626'
```
*Note: The generator uses `public/icon.svg` and `public/pwa-512x512.png` to create all standard Android `mipmap` densities (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi) and splash screens.*

### Step 5: Sync Assets with Native Android Project
Whenever you update code or assets, sync with:
```bash
npx cap sync
```

### Step 6: Open Project in Android Studio
```bash
npx cap open android
```

---

## 4. Status Bar and Navigation Bar Theming
The `capacitor.config.json` is already configured with:
- **Status Bar Color**: `#dc2626` (Crimson brand color)
- **Style**: Dark text / icons or translucent mode
- **Splash Screen**: 2000ms fade duration with brand crimson background

In `android/app/src/main/res/values/styles.xml`, ensure your `AppTheme.NoActionBar` uses:
```xml
<item name="android:statusBarColor">#dc2626</item>
<item name="android:navigationBarColor">#0b0f19</item>
```

---

## 5. Firebase Cloud Messaging (FCM) Push Notifications Setup

To enable daily 6:00 AM IST morning digest notifications and breaking news alerts:

1. Go to the [Firebase Console](https://console.firebase.google.com).
2. Create or select your project and click **Add Android App**.
3. Set the Android package name to:
   ```
   com.indorebeyond.news
   ```
4. Download the generated `google-services.json` file.
5. Place `google-services.json` into:
   ```
   android/app/google-services.json
   ```
6. In `android/build.gradle`:
   ```gradle
   buildscript {
       dependencies {
           classpath 'com.google.gms:google-services:4.4.1'
       }
   }
   ```
7. In `android/app/build.gradle`, apply the plugin at the bottom:
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   ```

---

## 6. Generating the APK or Play Store Bundle (AAB)

### Option A: Generate Debug APK (For immediate phone testing)
In Android Studio:
1. Select **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
2. Once the build finishes, click **locate** to open the APK file:
   `android/app/build/outputs/apk/debug/app-debug.apk`.
3. Transfer this `.apk` to your Android device to install and test.

Or via terminal:
```bash
cd android && ./gradlew assembleDebug
```

### Option B: Generate Signed Release AAB / APK (For Google Play Store)
1. In Android Studio, go to **Build** > **Generate Signed Bundle / APK**.
2. Select **Android App Bundle** (or **APK**) and click **Next**.
3. Choose or create a new KeyStore (`.jks` file).
4. Select `release` build variant and click **Finish**.
5. Your signed bundle will be ready for submission to Google Play Developer Console.

---

## 7. Native Hardware Features Enabled
- **Text-To-Speech (TTS)**: Reads articles aloud in native Hindi and English.
- **Offline Reading**: IndexedDB/LocalStorage cache allows opening previously loaded articles on airplanes or without mobile data.
- **Eye-Care Themes**: Light, Dark, and warm Sepia modes with auto night detection.
- **Haptic & Share**: Native Android Share Sheet support for WhatsApp, Telegram, and standard apps.
