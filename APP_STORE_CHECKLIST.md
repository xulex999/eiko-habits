# App Store Publishing Checklist

Complete checklist for publishing Eiko Habits to the Apple App Store.

## ✅ Technical Requirements

### App Configuration
- [x] Bundle Identifier: `com.eikohabits.app`
- [x] iOS Deployment Target: iOS 15.0+
- [x] Expo SDK: 52.0.0
- [x] Universal App (iPhone + iPad)
- [ ] App Version: 1.0.0 (needs to be verified in app.json)
- [ ] Build Number: 1 (needs to be configured)

### Required Assets
- [ ] App Icon (1024x1024px, no transparency)
- [ ] Various icon sizes (generated from main icon)
- [ ] Launch Screen (configured)
- [ ] Screenshots for App Store:
  - [ ] 6.7" iPhone (1290 x 2796 px) - 3 required
  - [ ] 6.5" iPhone (1242 x 2688 px) - optional
  - [ ] 5.5" iPhone (1242 x 2208 px) - optional
  - [ ] 12.9" iPad Pro (2048 x 2732 px) - 2 required
  - [ ] Optional: App preview videos

### Privacy & Permissions
- [x] NSCameraUsageDescription - configured
- [x] NSPhotoLibraryUsageDescription - configured
- [x] NSUserTrackingUsageDescription - configured
- [x] Background Modes for notifications - configured
- [ ] Privacy Policy URL (required)
- [ ] Terms of Service URL (required)

### Legal Requirements
- [ ] Privacy Policy (hosted publicly)
- [ ] Terms of Service (hosted publicly)
- [ ] Support URL
- [ ] Marketing URL
- [ ] Copyright information
- [ ] App Privacy Details (data collection disclosure)

## 📝 App Store Connect Setup

### Account & Certificates
- [ ] Apple Developer Account ($99/year)
- [ ] App ID registered
- [ ] Provisioning Profiles:
  - [ ] Development
  - [ ] App Store Distribution
- [ ] Push Notification Certificates (if using)
- [ ] Distribution Certificate

### App Store Connect Configuration
- [ ] App created in App Store Connect
- [ ] Bundle ID linked
- [ ] App Store Information:
  - [ ] App Name (30 characters max)
  - [ ] Subtitle (30 characters max)
  - [ ] Primary Language
  - [ ] Category (Primary & Secondary)
  - [ ] Content Rights
  - [ ] Age Rating

### Metadata & Marketing
- [ ] App Description (4000 characters max)
- [ ] Keywords (100 characters max, comma separated)
- [ ] Promotional Text (170 characters, updatable anytime)
- [ ] What's New (4000 characters)
- [ ] Screenshots (all required sizes)
- [ ] App Preview Video (optional)
- [ ] Support URL
- [ ] Marketing URL
- [ ] Copyright

### Pricing & Availability
- [ ] Price Tier selected
- [ ] Countries/Regions selected
- [ ] Pre-order configuration (optional)
- [ ] Educational Discount (optional)

## 💰 In-App Purchases & Subscriptions

Since Eiko Habits has premium subscriptions:

### RevenueCat Setup
- [ ] RevenueCat account configured
- [ ] API keys added to app
- [ ] Products configured:
  - [ ] Monthly subscription ($19.99/mo)
  - [ ] Annual subscription ($99.99/yr)

### App Store Connect Products
- [ ] Subscription Group created
- [ ] Monthly subscription product:
  - [ ] Product ID: com.eikohabits.premium.monthly
  - [ ] Reference Name
  - [ ] Duration: 1 month
  - [ ] Price: $19.99
- [ ] Annual subscription product:
  - [ ] Product ID: com.eikohabits.premium.annual
  - [ ] Reference Name
  - [ ] Duration: 1 year
  - [ ] Price: $99.99
- [ ] Subscription features description
- [ ] Subscription display name
- [ ] Promotional images (optional)

## 🔐 App Privacy Details

Required disclosures for App Store:

### Data Collection
- [ ] Contact Info (email for account)
- [ ] User Content (habits, goals, check-ins)
- [ ] Usage Data (analytics)
- [ ] Identifiers (device ID for push notifications)
- [ ] Financial Info (subscription status)

### Data Use
- [ ] App Functionality
- [ ] Analytics
- [ ] Product Personalization
- [ ] Developer's Advertising or Marketing

### Data Linked to User
- [ ] Name
- [ ] Email Address
- [ ] User ID
- [ ] Purchase History

### Tracking
- [ ] Does app use ATT Framework? (Yes - configured)
- [ ] Tracking domains (if any third-party analytics)

## 📱 App Review Information

Required for submission:

- [ ] Demo Account:
  - [ ] Username/Email
  - [ ] Password
  - [ ] Instructions for reviewers
- [ ] Contact Information:
  - [ ] First Name
  - [ ] Last Name
  - [ ] Phone Number
  - [ ] Email
- [ ] Notes for Reviewer (explain features, subscriptions, etc.)
- [ ] Attachments (if needed to explain features)

## 🧪 Testing Requirements

### Pre-Submission Testing
- [ ] Test on physical iOS devices (iPhone & iPad)
- [ ] Test on multiple iOS versions (15, 16, 17, 18)
- [ ] Test all features and user flows
- [ ] Test subscription purchase flow
- [ ] Test notifications
- [ ] Test deep linking
- [ ] Test offline functionality
- [ ] Performance testing (app launch, memory usage)
- [ ] Crash testing (error handling)

### TestFlight Beta Testing (Recommended)
- [ ] Internal testing with team
- [ ] External testing with beta users
- [ ] Gather feedback
- [ ] Fix critical issues

## 📋 App Store Guidelines Compliance

### Design
- [ ] Human Interface Guidelines followed
- [ ] Consistent with iOS design patterns
- [ ] Proper error messages
- [ ] Loading states implemented
- [ ] No placeholder content

### Functionality
- [ ] App is complete and functional
- [ ] No bugs or crashes
- [ ] All features work as described
- [ ] Subscription features clearly marked
- [ ] Restore purchases functionality
- [ ] Account deletion option (required)

### Business
- [ ] Subscription terms clearly stated
- [ ] Auto-renewal terms disclosed
- [ ] Pricing displayed correctly
- [ ] Refund policy stated
- [ ] No misleading claims

### Legal
- [ ] Privacy Policy accessible
- [ ] Terms of Service accessible
- [ ] GDPR compliant (if targeting EU)
- [ ] COPPA compliant (if allowing under 13)
- [ ] Proper data handling

## 🌐 Web App Coordination

- [ ] Web app live and accessible
- [ ] Privacy Policy hosted at: eikohabits.com/privacy
- [ ] Terms of Service hosted at: eikohabits.com/terms
- [ ] Support page at: eikohabits.com/support
- [ ] Matching branding (logo, colors, copy)
- [ ] API endpoints accessible
- [ ] Web subscription flow (Stripe) working

## 🚀 Submission Process

1. [ ] Complete all checklist items
2. [ ] Build release version with EAS:
   ```bash
   eas build --platform ios --profile production
   ```
3. [ ] Upload to App Store Connect (automatic with EAS)
4. [ ] Fill out all App Store Connect metadata
5. [ ] Add screenshots and assets
6. [ ] Configure App Privacy Details
7. [ ] Set pricing and availability
8. [ ] Submit for App Review
9. [ ] Monitor review status
10. [ ] Respond to reviewer feedback if needed
11. [ ] Release when approved!

## ⏱️ Timeline

- **App Review**: Typically 1-3 days
- **Rejection Response**: 24-48 hours to fix and resubmit
- **Total**: Plan for 1-2 weeks from submission to live

## 📞 Support Resources

- **App Store Connect**: https://appstoreconnect.apple.com
- **Apple Developer**: https://developer.apple.com
- **App Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Human Interface Guidelines**: https://developer.apple.com/design/human-interface-guidelines/

## 🎯 Current Status

- ✅ Technical configuration complete
- ✅ iOS 15+ compatibility
- ✅ Permissions configured
- ⏳ Assets need to be created
- ⏳ Legal documents need to be created
- ⏳ App Store Connect setup needed
- ⏳ Subscriptions need configuration
- ⏳ Testing needed

## 🔄 Post-Launch

After app is live:

- [ ] Monitor crash reports
- [ ] Respond to user reviews
- [ ] Track analytics
- [ ] Plan updates and improvements
- [ ] Monitor subscription metrics
- [ ] Update screenshots for new features
