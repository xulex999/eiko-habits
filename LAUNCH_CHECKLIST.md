# Eiko Habits Launch Checklist 🚀

Complete checklist for launching Eiko Habits to production.

## Executive Summary

**Current Status:** ✅ Apps are configured and ready for asset creation and payment setup

**What's Done:**
- ✅ iOS mobile app fully configured for iOS 15+
- ✅ Web app updated with Next.js 15 and all features
- ✅ Legal pages created (Privacy, Terms, Support)
- ✅ App Store metadata prepared
- ✅ Build configuration ready (EAS + Docker)
- ✅ Documentation complete

**What's Needed Before Launch:**
- ⚠️ Create app icons and screenshots
- ⚠️ Set up payment systems (RevenueCat + Stripe)
- ⚠️ Deploy backend API to production
- ⚠️ Configure environment variables
- ⚠️ End-to-end testing

**Estimated Time to Launch:** 1-2 weeks

---

## Phase 1: Assets & Design (2-3 days)

### App Icons
- [ ] Design 1024x1024px app icon
  - **Recommendation:** Hire on Fiverr ($50-200) or use Canva
  - Color: #4F46E5 (indigo) as primary
  - Keep it simple and recognizable
- [ ] Create adaptive icon for Android (1024x1024px with transparency)
- [ ] Create splash screen icon (512x512px+)
- [ ] Create favicon (512x512px)
- [ ] Add all icons to `apps/mobile/assets/`

**Resources:**
- [ASSETS_GUIDE.md](/Users/xulex999/eiko-habits/ASSETS_GUIDE.md)
- Icon generators: appicon.co, icon.kitchen
- Hire designer: Fiverr, Upwork

### Screenshots
- [ ] Install Xcode (required for iOS Simulator)
- [ ] Build app on simulator: `npx expo run:ios`
- [ ] Capture 5+ iPhone 6.7" screenshots (1290 x 2796 px):
  1. Habit tracking screen
  2. Goal progress dashboard
  3. Analytics/insights
  4. AI coach (Premium feature)
  5. Dashboard overview
- [ ] Capture 2+ iPad 12.9" screenshots (2048 x 2732 px):
  1. Dashboard view
  2. Habit management
- [ ] Optional: Create app preview video (15-30s)

---

## Phase 2: Payment Systems (1-2 days)

### RevenueCat Setup (Mobile Subscriptions)
- [ ] Create RevenueCat account: https://revenuecat.com
- [ ] Create project for Eiko Habits
- [ ] Configure iOS products:
  - `com.eikohabits.premium.monthly` - $19.99/mo
  - `com.eikohabits.premium.annual` - $99.99/yr
- [ ] Add RevenueCat API keys to mobile app `.env`:
  ```
  EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_key
  EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=your_key
  ```
- [ ] Test subscription flow in sandbox mode
- [ ] Configure webhook to backend API

### Stripe Setup (Web Subscriptions)
- [ ] Create Stripe account: https://stripe.com
- [ ] Create products:
  - Premium Monthly - $19.99/mo
  - Premium Annual - $99.99/yr
- [ ] Add Stripe keys to web app `.env`:
  ```
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
  STRIPE_SECRET_KEY=sk_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  ```
- [ ] Set up webhook endpoint at `api.eikohabits.com/webhooks/stripe`
- [ ] Test checkout flow in test mode

### Backend Integration
- [ ] Implement subscription webhook handlers
- [ ] Test premium status sync across platforms
- [ ] Verify premium features unlock correctly

---

## Phase 3: Production Deployment (1-2 days)

### Backend API
- [ ] Choose hosting provider:
  - **Option 1:** Railway (easiest)
  - **Option 2:** Render
  - **Option 3:** AWS/GCP (most scalable)
  - **Option 4:** VPS (cheapest, more work)
- [ ] Set up PostgreSQL database
- [ ] Deploy API to production
- [ ] Configure domain: `api.eikohabits.com`
- [ ] Set up SSL certificate
- [ ] Configure environment variables:
  ```
  DATABASE_URL=postgresql://...
  JWT_SECRET=...
  ANTHROPIC_API_KEY=...
  OPENAI_API_KEY=...
  STRIPE_SECRET_KEY=...
  REVENUECAT_WEBHOOK_SECRET=...
  ```
- [ ] Test all API endpoints
- [ ] Set up monitoring and error tracking

### Web App
- [ ] Deploy to Vercel (recommended):
  ```bash
  cd apps/web
  vercel --prod
  ```
- [ ] Configure domain: `eikohabits.com`
- [ ] Set environment variables in Vercel:
  ```
  NEXT_PUBLIC_API_URL=https://api.eikohabits.com
  NEXT_PUBLIC_APP_URL=https://eikohabits.com
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
  ```
- [ ] Verify all pages work (/, /privacy, /terms, /support, /pricing)
- [ ] Test authentication and subscriptions
- [ ] Set up analytics (PostHog, Google Analytics)

### Mobile App Environment
- [ ] Create `.env` in `apps/mobile/`:
  ```
  EXPO_PUBLIC_API_URL=https://api.eikohabits.com
  EXPO_PUBLIC_WEB_URL=https://eikohabits.com
  EXPO_PUBLIC_REVENUECAT_IOS_KEY=...
  EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=...
  ```

---

## Phase 4: App Store Preparation (2-3 days)

### Apple Developer Account
- [ ] Enroll in Apple Developer Program ($99/year)
- [ ] Create App ID: `com.eikohabits.app`
- [ ] Create Certificates:
  - iOS Development
  - iOS Distribution
- [ ] Create Provisioning Profiles:
  - Development
  - App Store Distribution
- [ ] Configure Push Notifications certificate

### App Store Connect
- [ ] Create app in App Store Connect
- [ ] Link bundle ID: `com.eikohabits.app`
- [ ] Fill in App Information:
  - Name: Eiko Habits
  - Subtitle: Build Better Habits Daily
  - Category: Productivity (primary), Health & Fitness (secondary)
- [ ] Add App Store metadata (use [APP_STORE_METADATA.md](/Users/xulex999/eiko-habits/APP_STORE_METADATA.md))
- [ ] Upload screenshots (all required sizes)
- [ ] Set pricing: Free (with in-app purchases)
- [ ] Select availability: All countries
- [ ] Fill App Privacy details
- [ ] Configure in-app purchases:
  - Create subscription group
  - Add monthly subscription ($19.99)
  - Add annual subscription ($99.99)
- [ ] Set age rating: 4+
- [ ] Add demo account credentials
- [ ] Fill review information

---

## Phase 5: Build & Submit (1 day)

### EAS Build Setup
- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Login: `eas login`
- [ ] Configure project ID in `app.json`
- [ ] Update `eas.json` with your Apple ID and team ID

### Build for Production
- [ ] Build iOS app:
  ```bash
  cd apps/mobile
  eas build --platform ios --profile production
  ```
- [ ] Wait for build to complete (~15-20 minutes)
- [ ] Download and test IPA on TestFlight

### TestFlight Beta Testing (Recommended)
- [ ] Upload build to TestFlight (automatic with EAS)
- [ ] Add internal testers
- [ ] Test all features thoroughly
- [ ] Fix any critical bugs
- [ ] Build again if needed

### Submit to App Review
- [ ] In App Store Connect, select your build
- [ ] Review all metadata and screenshots
- [ ] Click "Submit for Review"
- [ ] Wait for review (typically 1-3 days)

---

## Phase 6: Testing & QA (Ongoing)

### Pre-Launch Testing
- [ ] **Authentication**
  - Create account (email/password)
  - Sign in with Google
  - Sign in with Apple
  - Password reset
  - Sign out / Sign in
- [ ] **Habit Tracking**
  - Create daily habit
  - Create weekly habit
  - Create custom schedule habit
  - Complete check-in
  - View streak
  - Edit habit
  - Delete habit
- [ ] **Goals**
  - Create financial goal
  - Create general goal
  - Link habit to goal
  - Track progress
  - Complete goal
- [ ] **Premium Features**
  - Subscribe (monthly/annual)
  - Access AI Coach
  - Test AI responses
  - Cancel subscription
  - Restore purchases
- [ ] **Cross-Platform**
  - Create habit on web → see on mobile
  - Complete habit on mobile → see on web
  - Subscribe on iOS → verify premium on web
  - Subscribe on web → verify premium on mobile
- [ ] **Notifications**
  - Set habit reminder
  - Receive push notification
  - Tap notification → opens app
- [ ] **Data Management**
  - Export data
  - Delete account
  - Verify data deleted

### Performance Testing
- [ ] App launch time < 3 seconds
- [ ] No memory leaks
- [ ] Smooth scrolling and animations
- [ ] No crashes during normal use
- [ ] Works on slow network
- [ ] Works offline (basic features)

---

## Phase 7: Post-Launch (Week 1)

### Monitoring
- [ ] Set up crash reporting (Sentry, Bugsnag)
- [ ] Monitor App Store reviews
- [ ] Track analytics:
  - Daily active users
  - Habit completion rate
  - Subscription conversion rate
  - Retention (Day 1, Day 7, Day 30)
- [ ] Monitor API performance and errors
- [ ] Check subscription webhooks working

### Support
- [ ] Monitor support email: support@eikohabits.com
- [ ] Respond to user feedback
- [ ] Address critical bugs immediately
- [ ] Plan first update (bug fixes)

### Marketing
- [ ] Announce launch on social media
- [ ] Submit to app directories (Product Hunt, etc.)
- [ ] Reach out to beta testers
- [ ] Create launch blog post
- [ ] Email marketing campaign (if list exists)

---

## Quick Reference

### Important URLs
- **Web App:** https://eikohabits.com
- **API:** https://api.eikohabits.com
- **Privacy:** https://eikohabits.com/privacy
- **Terms:** https://eikohabits.com/terms
- **Support:** https://eikohabits.com/support

### Contact Emails
- **Support:** support@eikohabits.com
- **Billing:** billing@eikohabits.com
- **Privacy:** privacy@eikohabits.com
- **Legal:** legal@eikohabits.com
- **Feedback:** feedback@eikohabits.com
- **App Store:** appstore@eikohabits.com

### Subscription Pricing
- **Monthly:** $19.99/month
- **Annual:** $99.99/year (save 58%)
- **Free Plan:** Up to 3 goals, 5 habits

### Bundle Identifiers
- **iOS:** com.eikohabits.app
- **Android:** com.eikohabits.app
- **Web:** eikohabits.com

---

## Documentation Reference

All detailed guides are available:

1. **[APP_STORE_CHECKLIST.md](/Users/xulex999/eiko-habits/APP_STORE_CHECKLIST.md)** - Complete App Store requirements
2. **[APP_STORE_METADATA.md](/Users/xulex999/eiko-habits/APP_STORE_METADATA.md)** - Copy-ready metadata for App Store Connect
3. **[ASSETS_GUIDE.md](/Users/xulex999/eiko-habits/ASSETS_GUIDE.md)** - Icon and screenshot specifications
4. **[WEB_MOBILE_COORDINATION.md](/Users/xulex999/eiko-habits/WEB_MOBILE_COORDINATION.md)** - Platform synchronization
5. **[IOS_SETUP.md](/Users/xulex999/eiko-habits/apps/mobile/IOS_SETUP.md)** - iOS development and testing

---

## Estimated Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Assets & Design | 2-3 days | ⏳ Pending |
| Payment Systems | 1-2 days | ⏳ Pending |
| Production Deployment | 1-2 days | ⏳ Pending |
| App Store Preparation | 2-3 days | ⏳ Pending |
| Build & Submit | 1 day | ⏳ Pending |
| App Review | 1-3 days | ⏳ Pending |
| **Total** | **1-2 weeks** | |

---

## Need Help?

- **Technical Issues:** Check the documentation first
- **Design Help:** Hire on Fiverr or Upwork
- **Payment Setup:** RevenueCat and Stripe have excellent docs
- **App Review:** Apple Developer Forums

---

## 🎉 You're Almost There!

Your app is technically complete and ready for launch. The main tasks remaining are:
1. Create visual assets (icons, screenshots)
2. Set up payment systems
3. Deploy to production
4. Submit to App Store

Follow this checklist step-by-step and you'll be live within 1-2 weeks!

Good luck with your launch! 🚀

---

**Last Updated:** {new Date().toISOString().split('T')[0]}
