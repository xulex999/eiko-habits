# App Assets Guide for Eiko Habits

This guide outlines all required assets for publishing Eiko Habits to the App Store and Google Play.

## App Icon Requirements

### iOS App Icon (Required)
- **Main Icon:** 1024x1024px PNG (no transparency, no alpha channel)
- **Format:** PNG
- **Color Space:** RGB
- **No rounded corners** (iOS applies them automatically)

### Generated Sizes (Expo handles automatically)
- 20x20pt (2x, 3x)
- 29x29pt (2x, 3x)
- 40x40pt (2x, 3x)
- 60x60pt (2x, 3x)
- 76x76pt (1x, 2x) - iPad
- 83.5x83.5pt (2x) - iPad Pro

## Current Icon Status

Your app currently references:
- **Main Icon:** `./assets/icon.png` (1024x1024)
- **Adaptive Icon (Android):** `./assets/adaptive-icon.png`
- **Splash Icon:** `./assets/splash-icon.png`
- **Favicon:** `./assets/favicon.png`

### ⚠️ Action Required

Check if these files exist and meet requirements:

```bash
cd /Users/xulex999/eiko-habits/apps/mobile
ls -la assets/
```

If missing, you need to create:

1. **icon.png** (1024x1024px)
   - Main app icon
   - Should feature your brand logo/mark
   - Background color: #4F46E5 (indigo)
   - Clean, recognizable design

2. **adaptive-icon.png** (1024x1024px, Android)
   - Foreground layer with transparent background
   - Centered icon within safe area (672x672px)

3. **splash-icon.png** (Splash screen)
   - Simple logo/icon for splash screen
   - Recommended: 512x512px to 1024x1024px
   - Will be centered on #4F46E5 background

4. **favicon.png** (Web)
   - 512x512px PNG
   - For web app

## Screenshot Requirements

### iOS Screenshots (REQUIRED)

#### iPhone 6.7" Display (iPhone 15 Pro Max)
- **Resolution:** 1290 x 2796 pixels
- **Format:** PNG or JPG
- **Count:** Minimum 3, maximum 10
- **Required:** YES

**Recommended Screenshots:**
1. **Habit Tracking** - Main screen with habits and check-in UI
2. **Goal Progress** - Goal dashboard showing progress
3. **Analytics** - Charts and insights
4. **AI Coach** - AI coaching feature (highlight Premium)
5. **Dashboard Overview** - Stats, streaks, consistency

#### iPad Pro 12.9" (3rd/4th/5th/6th gen)
- **Resolution:** 2048 x 2732 pixels
- **Format:** PNG or JPG
- **Count:** Minimum 2, maximum 10
- **Required:** YES (since app supports iPad)

**Recommended Screenshots:**
1. **Dashboard View** - Full iPad layout
2. **Habit Management** - Creating/editing habits

### Optional Sizes (Backward Compatibility)

#### iPhone 6.5" Display (iPhone 11 Pro Max, XS Max)
- **Resolution:** 1242 x 2688 pixels

#### iPhone 5.5" Display (iPhone 8 Plus)
- **Resolution:** 1242 x 2208 pixels

## Creating Screenshots

### Method 1: iOS Simulator (Recommended)

1. **Install Xcode** (if not already)
2. **Build app for simulator:**
   ```bash
   cd /Users/xulex999/eiko-habits/apps/mobile
   npx expo run:ios
   ```
3. **Take screenshots:**
   - Open Simulator
   - Navigate to each screen
   - Press `Cmd + S` to save screenshot
   - Screenshots saved to Desktop

4. **Recommended Screens to Capture:**
   - Login/Onboarding (if attractive)
   - Habits List with some completed habits
   - Goal Detail with progress bar
   - Analytics page with charts
   - AI Coach conversation (Premium feature)
   - Settings/Profile page

### Method 2: Design Tool (Figma, Sketch)

1. Create frames with exact dimensions
2. Design screenshots with:
   - Real UI elements
   - Sample data that looks realistic
   - Key features highlighted
   - Consistent branding

3. Add text overlays (optional):
   - Feature callouts
   - Benefit statements
   - "Premium" badges

### Method 3: Fastlane Snapshot (Automated)

```bash
# Install fastlane
gem install fastlane

# Set up snapshot
fastlane snapshot init

# Configure and run
fastlane snapshot
```

## Screenshot Best Practices

✓ **Show Real Features** - No mockups or concepts
✓ **Use Realistic Data** - Not "Lorem ipsum" or "Test Habit"
✓ **Highlight Key Benefits** - Show what makes your app unique
✓ **Consistent Branding** - Use brand colors and style
✓ **High Quality** - No pixelation or artifacts
✓ **Localized** (if supporting multiple languages)
✓ **Status Bar** - Can show or hide (hiding often looks cleaner)

✗ **Don't** include competitor references
✗ **Don't** show pricing unless accurate
✗ **Don't** make false claims or show unreleased features
✗ **Don't** include device frames (App Store shows them)

## App Preview Video (Optional)

### Specifications
- **Length:** 15-30 seconds
- **Resolution:**
  - iPhone: 1080 x 1920 pixels (9:16)
  - iPad: 1200 x 1600 pixels (3:4)
- **Format:** M4V, MP4, or MOV
- **Frame Rate:** 25-30 fps
- **Bitrate:** Minimum 5 Mbps

### Content Ideas
1. **Opening:** App icon animation (2s)
2. **Quick tour:** Habit creation → Check-in → Streak (8s)
3. **Goal tracking:** Setting and achieving a goal (5s)
4. **Analytics:** Viewing insights (3s)
5. **AI Coach:** Quick interaction (5s)
6. **Closing:** App icon + tagline (2s)

### Tools for Video
- **iMovie** (Mac, free)
- **Final Cut Pro** (Mac, paid)
- **Screen Recording:** QuickTime + editing
- **Design Tool:** After Effects, Figma + plugins

## Marketing Assets

### Website Graphics
- **Hero Image:** 1920x1080px (landing page)
- **Feature Images:** 800x600px (feature sections)
- **Social Media Graphics:**
  - Twitter: 1200x675px
  - Facebook: 1200x630px
  - Instagram: 1080x1080px

### Press Kit
- App icon (various sizes)
- Screenshots
- App description
- Feature list
- Company logo
- Media contact

## Asset Checklist

### Mobile App
- [ ] App Icon (1024x1024px)
- [ ] Adaptive Icon (Android, 1024x1024px)
- [ ] Splash Screen Icon (512x512px+)
- [ ] iPhone 6.7" Screenshots (3+ required)
- [ ] iPad 12.9" Screenshots (2+ required)
- [ ] App Preview Video (optional)

### Web App
- [ ] Favicon (512x512px)
- [ ] Open Graph Image (1200x630px)
- [ ] Apple Touch Icon (180x180px)
- [ ] PWA Icons (various sizes)

### Marketing
- [ ] Website Hero Image
- [ ] Feature Screenshots
- [ ] Social Media Graphics
- [ ] Press Kit Assets

## Generating Icons from Base Image

If you have a base SVG or high-res PNG:

### Using Expo
```bash
# Expo will automatically generate all sizes
# Just ensure your icon.png is 1024x1024
```

### Using Online Tools
- **App Icon Generator:** https://appicon.co
- **Icon Maker:** https://icon.kitchen
- **Figma Plugin:** "App Icon Generator"

### Using ImageMagick (CLI)
```bash
# Resize base image
convert icon-source.png -resize 1024x1024 icon.png

# Generate multiple sizes
for size in 20 29 40 60 76 83.5; do
  convert icon.png -resize ${size}x${size} icon-${size}.png
done
```

## Asset Storage

Store all assets in:
```
/Users/xulex999/eiko-habits/assets/
├── app-icon/
│   ├── icon.png (1024x1024)
│   ├── adaptive-icon.png (1024x1024)
│   └── generated/ (various sizes)
├── screenshots/
│   ├── iphone-6.7/
│   │   ├── 01-habits.png
│   │   ├── 02-goals.png
│   │   ├── 03-analytics.png
│   │   ├── 04-ai-coach.png
│   │   └── 05-dashboard.png
│   └── ipad-12.9/
│       ├── 01-dashboard.png
│       └── 02-habits.png
├── splash/
│   └── splash-icon.png
└── marketing/
    ├── hero.png
    ├── features/
    └── social/
```

## Next Steps

1. **Check Existing Assets:**
   ```bash
   cd /Users/xulex999/eiko-habits/apps/mobile
   ls -la assets/
   ```

2. **Create Missing Assets:**
   - Design or commission app icon
   - Take screenshots using simulator
   - Create adaptive icon for Android
   - Generate splash screen

3. **Optimize Assets:**
   ```bash
   # Install ImageOptim or use CLI
   optipng icon.png
   jpegoptim screenshots/*.jpg
   ```

4. **Validate Assets:**
   - Check dimensions
   - Verify file sizes
   - Test in app (expo start)
   - Preview in simulator

5. **Upload to App Store Connect:**
   - Log in to appstoreconnect.apple.com
   - Navigate to your app
   - Upload screenshots to each device size
   - Save and submit

## Resources

- **Apple Human Interface Guidelines:** https://developer.apple.com/design/human-interface-guidelines/app-icons
- **Screenshot Specifications:** https://help.apple.com/app-store-connect/#/devd274dd925
- **App Preview Specifications:** https://help.apple.com/app-store-connect/#/dev4e413fcb8
- **Expo Asset Configuration:** https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/

## Tips

1. **Icon Design:**
   - Keep it simple and recognizable
   - Test at small sizes (60x60px)
   - Avoid text or fine details
   - Use contrasting colors
   - Consider dark mode appearance

2. **Screenshots:**
   - First screenshot is most important
   - Show your best feature first
   - Use consistent UI throughout
   - Consider adding captions/overlays
   - Update regularly with new features

3. **Video:**
   - Keep it short and engaging
   - No sound required (auto-muted)
   - Show actual app footage
   - Highlight unique features
   - End with clear call-to-action

---

**Need Help?**
- Hire a designer on Fiverr or Upwork
- Use template tools like Canva
- Contact our support: design@eikohabits.com
