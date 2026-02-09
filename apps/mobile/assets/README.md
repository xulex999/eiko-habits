# App Assets

This directory contains all visual assets for the Eiko Habits mobile app.

## Required Assets

### ⚠️ IMPORTANT: You need to add these files before publishing

1. **icon.png** (1024x1024px)
   - Main app icon for iOS and Android
   - No transparency, RGB color space
   - Will be used to generate all sizes automatically

2. **adaptive-icon.png** (1024x1024px, Android only)
   - Foreground layer with transparent background
   - Icon should fit within 672x672px safe area

3. **splash-icon.png** (512x512px or larger)
   - Logo shown on splash screen
   - Will be centered on #4F46E5 background

4. **favicon.png** (512x512px)
   - For web version of the app

## Creating Your Icons

### Option 1: Design Tool
Use Figma, Sketch, or Adobe Illustrator to create your icon:
- Start with 1024x1024px canvas
- Use brand color #4F46E5 (indigo) as primary
- Keep design simple and recognizable
- Export as PNG (no transparency for main icon)

### Option 2: Icon Generator
Use online tools:
- https://appicon.co - Generate all sizes
- https://icon.kitchen - Material Design icons
- Canva - Templates for app icons

### Option 3: Hire Designer
Fiverr or Upwork - $50-200 for professional app icon

## Current Status

❌ icon.png - **MISSING** - Create 1024x1024px PNG
❌ adaptive-icon.png - **MISSING** - Create 1024x1024px PNG with transparency
❌ splash-icon.png - **MISSING** - Create 512x512px+ PNG
❌ favicon.png - **MISSING** - Create 512x512px PNG

## After Adding Icons

1. Test in development:
   ```bash
   npx expo start
   ```

2. Build for production:
   ```bash
   eas build --platform ios --profile production
   ```

See [ASSETS_GUIDE.md](/Users/xulex999/eiko-habits/ASSETS_GUIDE.md) for complete specifications and guidelines.
