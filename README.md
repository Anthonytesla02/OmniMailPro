# OmniMail Pro — Multi-Inbox Business Suite for Expo & Codemagic.io

OmniMail Pro is an enterprise-grade multi-account email client built with React and Expo, engineered to run **10+ business Gmail, Google Workspace, and IMAP inboxes** simultaneously with seamless switching, custom folder organization, per-inbox push notifications, and automated CI/CD packaging via **Codemagic.io**.

---

## 🚀 Codemagic.io Quick Start Guide

This repository includes a production-ready `codemagic.yaml` pre-configured to build:
- **Android Release APK** (for direct testing and side-loading)
- **Android Release App Bundle (AAB)** (for Google Play Store distribution)
- **iOS Release IPA** (for TestFlight and Apple App Store)

### 1. Push this Repository to Git
Push your code to **GitHub**, **GitLab**, or **Bitbucket**:
```bash
git init
git add .
git commit -m "Fix: Valid app.json syntax and Node 22.14.0 for Codemagic"
git remote add origin https://github.com/your-username/omnimail-expo.git
git push -u origin main
```

### 2. Connect to Codemagic.io
1. Go to [https://codemagic.io](https://codemagic.io) and sign in.
2. Click **"Add application"** > select your Git provider (GitHub / GitLab / Bitbucket).
3. Select this repository (`omnimail-expo`).
4. Codemagic automatically detects the root `codemagic.yaml` file.

### 3. Build Environment Configuration
The updated `codemagic.yaml` now specifies:
- **Node.js**: `22.14.0` (resolves all outdated engine warnings and `@react-native/dev-middleware` requirements)
- **Java**: `17`
- **Expo SDK**: Pinned to stable `^52.0.0` with `react-native@0.76.2` to prevent npx from pulling unverified experimental builds.
- **app.json**: Validated syntax and localized assets (`./assets/icon.png`, `./assets/splash.png`, `./assets/adaptive-icon.png`).

### 4. Trigger Cloud Build
1. In Codemagic, click **"Start new build"**.
2. Select the workflow:
   - `expo-android-release` (Linux x2 VM)
   - `expo-ios-release` (macOS Apple Silicon VM)
3. Codemagic will run `npx expo prebuild --platform android --clean --no-install`, build native binaries with Gradle / Xcode, sign artifacts, and automatically send download links to `buybesttraffic@gmail.com`.
