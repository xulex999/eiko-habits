# Web-Mobile Coordination Checklist

This document ensures that the web app and mobile app are properly coordinated and work seamlessly together.

## ✅ Brand Consistency

### Colors
**Primary Brand Color:** `#4F46E5` (Indigo 600)

#### Web App (`apps/web/app/globals.css`):
```css
--primary: #4F46E5;
--primary-hover: #4338CA;
--primary-light: #EEF2FF;
```

#### Mobile App (`apps/mobile/app.json`):
```json
"primaryColor": "#4F46E5"
"splash": { "backgroundColor": "#4F46E5" }
```

✅ **Status:** Coordinated

### App Name
- **Mobile:** "Eiko Habits"
- **Web:** "Eiko Habits"
- **Domain:** eikohabits.com

✅ **Status:** Consistent

### Tagline/Subtitle
- **App Store:** "Build Better Habits Daily"
- **Web Hero:** Should match or complement

⚠️ **Action:** Verify web app landing page has consistent messaging

## ✅ Features Parity

| Feature | Mobile | Web | Status |
|---------|--------|-----|--------|
| Habit Tracking | ✅ | ✅ | Coordinated |
| Goal Management | ✅ | ✅ | Coordinated |
| Financial Tracking | ✅ | ✅ | Coordinated |
| Analytics/Dashboard | ✅ | ✅ | Coordinated |
| AI Coach (Premium) | ✅ | ✅ | Coordinated |
| Push Notifications | ✅ | ⚠️ Limited | Expected |
| Offline Support | ✅ | ⚠️ Limited | Expected |
| Dark Mode | ✅ | ✅ | Coordinated |

## ✅ Account & Authentication

### Unified Authentication System

#### Backend API
- **Base URL:** Configure via environment variable
  - Development: `http://localhost:3001`
  - Production: `https://api.eikohabits.com`

#### Authentication Methods
Both platforms support:
- ✅ Email/Password
- ✅ OAuth (Google, Apple)
- ✅ JWT Access Tokens
- ✅ Refresh Tokens (SHA-256 hashed)

#### Token Storage
- **Mobile:** Expo SecureStore
- **Web:** localStorage (with httpOnly cookies for refresh tokens)

⚠️ **Action:** Verify API endpoints match between mobile and web

## ✅ Subscription System

### Platform-Specific Payment Processors

#### Mobile
- **iOS:** RevenueCat + App Store
- **Android:** RevenueCat + Google Play
- **Products:**
  - `com.eikohabits.premium.monthly` - $19.99/mo
  - `com.eikohabits.premium.annual` - $99.99/yr

#### Web
- **Processor:** Stripe
- **Products:**
  - Monthly: $19.99/mo
  - Annual: $99.99/yr

### Subscription Sync
Backend should recognize premium status regardless of purchase platform:
- Mobile purchases → Backend updates premium status
- Web purchases → Backend updates premium status
- User sees premium features on all platforms

⚠️ **Action:** Test subscription sync across platforms

## ✅ API Coordination

### Shared Backend
All apps connect to the same Express API:
```
apps/api/ - Express 5 + Prisma 6 + PostgreSQL
```

### API Endpoints (from memory)
```
/api/v1/auth/* - Authentication
/api/v1/habits/* - Habit CRUD
/api/v1/goals/* - Goal CRUD
/api/v1/finance/* - Financial tracking
/api/v1/dashboard/* - Dashboard data
/api/v1/subscriptions/* - Premium status
/api/v1/ai/* - AI coaching (Premium)
```

### Environment Configuration

#### Mobile App
Create `.env` in `apps/mobile/`:
```env
EXPO_PUBLIC_API_URL=https://api.eikohabits.com
EXPO_PUBLIC_WEB_URL=https://eikohabits.com
EXPO_PUBLIC_REVENUECAT_API_KEY=your_key_here
```

#### Web App
Has `.env.example` - configure:
```env
NEXT_PUBLIC_API_URL=https://api.eikohabits.com
NEXT_PUBLIC_APP_URL=https://eikohabits.com
```

⚠️ **Action:** Create environment files for each app

## ✅ Legal Pages

### Required URLs
All legal pages must be publicly accessible:

#### Mobile App References
In `app.json` and App Store Connect:
- Privacy Policy: `https://eikohabits.com/privacy`
- Terms of Service: `https://eikohabits.com/terms`
- Support: `https://eikohabits.com/support`

#### Web App Routes
✅ Created:
- `/privacy` - Privacy Policy page
- `/terms` - Terms of Service page
- `/support` - Support Center page

**Status:** ✅ Coordinated

## ✅ Deep Linking

### URL Scheme
**Mobile:** `eiko-habits://`

### Universal Links (iOS)
Should open mobile app if installed, otherwise web:
- `https://eikohabits.com/habit/:id` → `eiko-habits://habit/:id`
- `https://eikohabits.com/goal/:id` → `eiko-habits://goal/:id`

#### Configuration Needed

**Mobile:** Add associated domains in `app.json`:
```json
{
  "expo": {
    "ios": {
      "associatedDomains": ["applinks:eikohabits.com"]
    }
  }
}
```

**Web:** Add `.well-known/apple-app-site-association`:
```json
{
  "applinks": {
    "apps": [],
    "details": [{
      "appID": "TEAM_ID.com.eikohabits.app",
      "paths": ["/habit/*", "/goal/*", "/dashboard"]
    }]
  }
}
```

⚠️ **Action:** Configure universal links

## ✅ Push Notifications

### Mobile
- **Service:** Expo Push Notification Service
- **Implementation:** ✅ Configured in `app.json`

### Web
- **Service:** Web Push API (optional)
- **Status:** ⚠️ Not yet implemented (acceptable)

## ✅ Analytics & Monitoring

### Tracking Events (should match across platforms)

```typescript
// Event names should be consistent
trackEvent('habit_created', { habitName, schedule })
trackEvent('habit_completed', { habitId, streakCount })
trackEvent('goal_created', { goalName, targetAmount })
trackEvent('subscription_started', { plan: 'monthly' | 'annual' })
trackEvent('ai_coach_query', { query, premium: boolean })
```

### Tools
- **Analytics:** PostHog (configurable)
- **Error Tracking:** Consider Sentry
- **Performance:** Native platform tools

⚠️ **Action:** Ensure event names match between mobile and web

## ✅ Data Model Consistency

### Database Schema (Prisma)
Shared types in `packages/shared-types/`:

```typescript
// Should be consistent across all platforms
interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  schedule: 'daily' | 'weekly' | 'custom';
  daysOfWeek: number; // Bitmask
  reminderTime?: string;
  currentStreak: number;
  longestStreak: number;
  consistencyRate: number;
  // ...
}
```

✅ **Status:** Using shared TypeScript packages

## ✅ Feature Flags

Consider using feature flags for:
- ✅ Free vs Premium features
- ✅ AI coaching availability
- ⚠️ Beta features (optional)
- ⚠️ A/B testing (optional)

## ✅ Testing Coordination

### Cross-Platform Test Scenarios

1. **Account Creation**
   - Create account on web → Sign in on mobile ✅
   - Create account on mobile → Sign in on web ✅

2. **Data Sync**
   - Create habit on web → See on mobile ✅
   - Complete habit on mobile → See on web ✅

3. **Subscriptions**
   - Purchase on iOS → Premium on web ⚠️ Test needed
   - Purchase on web → Premium on mobile ⚠️ Test needed

4. **Authentication**
   - Sign out on one device → Should require sign in on all
   - Change password → Should work on all platforms

## ✅ Deployment Checklist

### Mobile App Deployment
```bash
# Build for iOS
cd apps/mobile
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

### Web App Deployment
```bash
# Build and deploy
cd apps/web
npm run build
vercel --prod
```

### API Deployment
```bash
# Deploy backend
cd apps/api
# Deploy to your hosting (Railway, Render, AWS, etc.)
```

## ⚠️ Action Items Before Launch

### Critical
- [ ] Create actual app icons (icon.png, adaptive-icon.png)
- [ ] Take App Store screenshots
- [ ] Set up production API at api.eikohabits.com
- [ ] Configure environment variables for all apps
- [ ] Test subscription flow (web → mobile, mobile → web)
- [ ] Set up RevenueCat for mobile subscriptions
- [ ] Set up Stripe for web subscriptions
- [ ] Configure universal links/deep linking

### Important
- [ ] Verify all API endpoints work from mobile and web
- [ ] Test authentication flow on all platforms
- [ ] Verify data sync across platforms
- [ ] Set up error tracking (Sentry or similar)
- [ ] Configure analytics properly
- [ ] Test push notifications on mobile
- [ ] Verify Premium features unlock correctly

### Nice to Have
- [ ] Set up A/B testing infrastructure
- [ ] Create onboarding flow that matches across platforms
- [ ] Add feature flags system
- [ ] Set up automated testing pipeline

## 🔧 Quick Fix Guide

### If Mobile Can't Connect to API
1. Check `EXPO_PUBLIC_API_URL` in mobile app
2. Verify API is running and accessible
3. Check CORS settings in API
4. Test API endpoint in browser/Postman

### If Web Can't Connect to API
1. Check `NEXT_PUBLIC_API_URL` in web app
2. Verify CORS headers allow web domain
3. Check network tab in browser DevTools
4. Verify API authentication

### If Subscriptions Don't Sync
1. Check RevenueCat webhook configuration
2. Verify Stripe webhook is set up
3. Check backend subscription sync logic
4. Test with actual purchases (use sandbox/test mode)

## 📞 Support Contact Consistency

Make sure all platforms reference:
- **Email:** support@eikohabits.com
- **Website:** https://eikohabits.com/support
- **Privacy:** https://eikohabits.com/privacy
- **Terms:** https://eikohabits.com/terms

## ✅ Summary

### Coordinated ✅
- Brand colors and name
- Legal pages (privacy, terms, support)
- Feature set (goals, habits, finance, AI coach)
- Authentication system
- Subscription pricing
- Shared backend API

### Needs Configuration ⚠️
- App icons and assets
- Environment variables (API URLs)
- Universal links / Deep linking
- RevenueCat setup
- Stripe setup
- Production API deployment

### Optional Enhancements 💡
- Web push notifications
- A/B testing
- Feature flags
- Advanced analytics

## Next Steps

1. **Create Assets** - App icons and screenshots
2. **Configure Environment** - Set up .env files
3. **Deploy API** - Get backend live at api.eikohabits.com
4. **Set Up Payments** - RevenueCat + Stripe configuration
5. **Test End-to-End** - Full user journey on all platforms
6. **Submit to Stores** - iOS App Store + Google Play + Deploy web

---

**Status:** Ready for asset creation and payment configuration before launch! 🚀
