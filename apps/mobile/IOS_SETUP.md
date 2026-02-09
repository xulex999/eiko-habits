# iOS Setup & Testing Guide

## Current Status

✅ **iOS App Configuration Complete:**
- iOS 15+ deployment target set
- Expo SDK 52 compatible packages
- iOS permissions configured
- EAS Build ready for simulator and device builds

⚠️ **Xcode.app Required:** Full Xcode installation needed for iOS Simulator testing.

---

## Option 1: Install Xcode for Simulator Testing (Recommended)

### Install Xcode

1. **Via App Store** (Recommended):
   - Open Mac App Store
   - Search for "Xcode"
   - Download and install (~13GB)

2. **Via Command Line**:
   ```bash
   xcode-select --install
   ```

3. **Accept Xcode License**:
   ```bash
   sudo xcodebuild -license accept
   ```

4. **Set Xcode Path**:
   ```bash
   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
   ```

5. **Verify Installation**:
   ```bash
   xcrun simctl list devices
   ```

### Run on iOS Simulator

Once Xcode is installed:

```bash
cd /Users/xulex999/eiko-habits/apps/mobile

# Option A: Auto-build and run on simulator
npx expo run:ios

# Option B: Start dev server and press 'i' for iOS
npx expo start
# Then press 'i' in terminal to open iOS simulator
```

---

## Option 2: Test with Expo Go (No Xcode Required)

### Setup

1. Install **Expo Go** on your iPhone:
   - Download from App Store
   - https://apps.apple.com/app/expo-go/id982107779

2. Start the dev server:
   ```bash
   cd /Users/xulex999/eiko-habits/apps/mobile
   npx expo start
   ```

3. Scan the QR code with your iPhone camera

### Limitations
- Some native features may not work in Expo Go
- Custom native modules require a development build

---

## Option 3: Build Development Build (Full Features)

For testing all features including custom native modules:

```bash
cd /Users/xulex999/eiko-habits/apps/mobile

# Build for iOS Simulator (requires Xcode)
npx eas build --profile development --platform ios --local

# OR build for physical device
npx eas build --profile development --platform ios
```

Then install the build on your device via TestFlight or direct install.

---

## Option 4: Test Web Version

The Expo app can run in a web browser:

```bash
cd /Users/xulex999/eiko-habits/apps/mobile
npx expo start
# Press 'w' to open in web browser
```

**Note:** Web version has limited mobile features (no push notifications, camera, etc.)

---

## Troubleshooting

### "xcrun simctl help exited with non-zero code: 72"
- **Cause:** Xcode.app not installed or not properly configured
- **Solution:** Install full Xcode.app (not just Command Line Tools)

### Package Version Warnings
If you see warnings about package versions:
```bash
cd /Users/xulex999/eiko-habits
rm -rf apps/mobile/node_modules
rm pnpm-lock.yaml
pnpm install
cd apps/mobile
npx expo install --fix
```

### Metro Bundler Cache Issues
```bash
cd /Users/xulex999/eiko-habits/apps/mobile
npx expo start --clear
```

### Simulator Not Found
```bash
# List available simulators
xcrun simctl list devices

# Boot a specific simulator
xcrun simctl boot "iPhone 15 Pro"

# Open Simulator.app
open -a Simulator
```

---

## Quick Start Commands

### After Xcode Installation:
```bash
cd /Users/xulex999/eiko-habits/apps/mobile
npx expo run:ios
```

### Without Xcode (Expo Go):
```bash
cd /Users/xulex999/eiko-habits/apps/mobile
npx expo start
# Scan QR with Expo Go app
```

### Web Testing:
```bash
cd /Users/xulex999/eiko-habits/apps/mobile
npx expo start --web
```

---

## iOS Compatibility

✅ **Supported iOS Versions:** iOS 15.0+

✅ **Supported Devices:**
- iPhone 6s and newer
- iPad (5th generation) and newer
- iPad Pro (all models)
- iPad Air 2 and newer
- iPad mini 4 and newer

✅ **Features:**
- Push notifications
- Haptic feedback
- Secure storage
- Camera access
- Photo library access
- Background modes

---

## Next Steps

1. Choose your testing method from the options above
2. Install Xcode (if using simulator)
3. Run the app with one of the commands
4. Report any issues or errors

For production builds, see the EAS Build documentation.
