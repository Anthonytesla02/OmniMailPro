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
git commit -m "Initial commit for OmniMail Expo app"
git remote add origin https://github.com/your-username/omnimail-expo.git
git push -u origin main
```

### 2. Connect to Codemagic.io
1. Go to [https://codemagic.io](https://codemagic.io) and sign in.
2. Click **"Add application"** > select your Git provider (GitHub / GitLab / Bitbucket).
3. Select this repository (`omnimail-expo`).
4. Codemagic automatically detects the root `codemagic.yaml` file.

### 3. Configure Environment Variables (Optional for Signing)
In Codemagic under **Teams / Applications > Environment Variables**:
- For Google Play: Add group `google_play` with `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` (JSON key).
- For iOS: Upload your App Store Connect API Key or Certificate in Codemagic's **Code Signing identities**.

### 4. Trigger Cloud Build
1. In Codemagic, click **"Start new build"**.
2. Select the workflow:
   - `expo-android-release` (Linux x2 VM)
   - `expo-ios-release` (macOS Apple Silicon VM)
3. Codemagic runs `expo prebuild`, builds native binaries with Gradle / Xcode, signs artifacts, and automatically sends download links to `buybesttraffic@gmail.com`.

---

## 📱 Features

- **10+ Multi-Account Management**: Connect 10, 15, 20+ accounts with distinct color badges, category tags, signatures, and unread counts.
- **Unified Multi-Inbox**: Stream all business emails into one unified feed with account pills.
- **Collapsible Mobile Drawer**: Access all accounts, folders, and custom business categories.
- **Native Bottom Navigation**: 5-tab mobile navigation (`Inboxes`, `Accounts`, `Folders`, `Alerts`, `Codemagic`).
- **Push Notifications Engine**: Individual notification rules per inbox (VIP only, sound chime, quiet hours, Web Push API).
- **Custom Business Folders**: Organize emails into *Invoices & Billing*, *VIP Clients*, *Contracts*, *Deliveries*, plus custom folders.
- **Business Composer**: Send emails from any connected account with pre-built business templates.
