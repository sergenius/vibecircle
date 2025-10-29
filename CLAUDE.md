# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VibeCircle is a social connection platform combining React Native (mobile) and React web implementations. The app focuses on authentic connections through video "vibes", interest-based circles, and friend matching. The codebase contains both a Vite-based web app and an Expo-based mobile app in a hybrid structure.

## Tech Stack

**Web:**
- React 18 + TypeScript
- Vite for build tooling
- React Router v7 for navigation
- TailwindCSS for styling
- Supabase for backend
- React Hook Form + Zod for form validation
- Framer Motion for animations

**Mobile (Expo):**
- React Native with Expo
- React Navigation (native stack, bottom tabs, drawer)
- NativeWind for styling
- Gesture Handler for interactions
- Path aliasing via `@/` (configured in babel.config.js)

## Development Commands

**Web Development:**
```bash
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking (no emit)
```

**Mobile Development:**
- Mobile commands are not yet configured in package.json (Expo-related scripts pending)
- The project structure suggests Expo CLI would be used directly

## Architecture

### Dual Entry Points

The project has two separate entry points:
1. **Web:** `src/main.tsx` → `src/App.tsx` (React Router based)
2. **Mobile:** `App.tsx` (root) → uses React Navigation (`@/navigation/RootNavigator`)

### Context-Based State Management

State is managed through React Context providers, wrapped hierarchically in App.tsx:
- `AuthContext` - Authentication state (login/register/logout)
- `UserContext` - Current user profile data
- `VibeContext` - Video vibes feed and creation
- `MatchContext` - Friend matching and recommendations
- `CircleContext` - Interest-based circles/groups
- `ChatContext` - Messaging functionality
- `NotificationContext` - Notifications and alerts
- `ThemeContext` - Dark/light theme (web only)

**Important:** All contexts must be accessed via hooks (e.g., `useAuth()`, `useUser()`) and will throw errors if used outside their providers.

### Navigation Architecture

**Mobile Navigation Hierarchy:**
```
RootNavigator (switches based on auth status)
├── Splash (loading)
├── AuthStack (unauthenticated)
│   ├── Welcome
│   ├── AgeVerification
│   ├── Login
│   ├── Register
│   └── ForgotPassword
├── OnboardingStack (first-time users)
│   ├── ProfileSetup
│   ├── OnboardingTutorial
│   └── PrivacyAgreement
└── AppDrawer (authenticated)
    └── MainTabs (bottom navigation)
        ├── DiscoverStack (matching/discovery)
        ├── CirclesStack (interest groups)
        ├── CreateVibeStack (video creation flow)
        ├── ConnectionsStack (friends/chat)
        └── ProfileStack (user profile/settings)
```

**Web Routing:**
- Uses React Router v7 with nested routes
- Protected routes wrap authenticated pages
- All authenticated routes nest under `<Layout>` component

### Type System

Core types are defined in `src/types/index.ts`:
- `User` - User profile with authenticity score, badges
- `Vibe` - Video posts with mood, tags, engagement
- `Circle` - Interest-based groups
- `Match` - Friend recommendations with compatibility scoring
- `Message` - Chat messages
- `Connection` - Friend relationships with status
- `Event` - Social events/hangouts
- `Notification` - Activity notifications

Navigation types in `src/types/navigation.ts` define stack/tab parameters for type-safe navigation.

### Component Organization

```
components/
├── auth/          - Login/register forms
├── common/        - Shared utilities (ActionButton, Chip, LoadingState)
├── friendship/    - Connection features (AuthenticityMeter, badges)
├── layout/        - Web layout (Header, Sidebar, MobileNav)
├── ui/            - Base UI primitives (Button, Input, Modal, Avatar)
├── vibe/          - Video player and cards
├── circle/        - Circle/group components
├── chat/          - Messaging UI
├── match/         - Match cards
└── safety/        - Safety/reporting features
```

### Styling Approach

**Web:** TailwindCSS with standard utility classes
**Mobile:** NativeWind (Tailwind-like API for React Native)

Both use similar class naming, making cross-platform components more portable.

### Backend Integration

- Supabase client configured for authentication and data
- API layer stub in `src/services/api.ts` (currently returns empty arrays)
- Auth uses mock localStorage implementation for development
- Production integration with Supabase is pending

## Path Aliases

Import paths use `@/` alias for `src/`:
```typescript
import { useAuth } from '@/contexts';
import { User } from '@/types';
import { ScreenContainer } from '@/components/common/ScreenContainer';
```

## Key Development Patterns

### Creating New Screens

**Mobile screens:**
1. Create in appropriate `src/screens/` subdirectory
2. Add to corresponding navigator (e.g., `DiscoverNavigator.tsx`)
3. Update navigation types in `src/types/navigation.ts`
4. Use `ScreenContainer` wrapper for consistent layout

**Web pages:**
1. Create in `src/pages/`
2. Add route in `src/App.tsx`
3. Wrap with `ProtectedRoute` if authentication required

### Adding New Contexts

1. Create context file in `src/contexts/`
2. Export from `src/contexts/index.ts`
3. Add provider to App.tsx hierarchy (order matters - dependencies should be higher)
4. Create custom hook (e.g., `useMyContext()`) with error checking

### Form Handling

Use React Hook Form + Zod for validation:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
```

## Important Notes

- The project mixes mobile and web code - always verify which platform a file targets
- Root `App.tsx` is for mobile (React Native), `src/App.tsx` is for web
- Authentication is currently mock-based using localStorage
- The babel.config.js indicates Expo/React Native setup while vite.config.ts indicates web
- Most business logic is placeholder/mock data (see `src/data/mockData.ts`)
- TypeScript strict mode is not fully enabled - some type issues may exist

# VibeCircle Authentication Flow Analysis Report

**Analysis Date:** October 29, 2025  
**Status:** ⚠️ **CRITICAL ISSUES FOUND** - Auth flow has several problems that need fixing

---

## ✅ FIXES APPLIED & DEPLOYED

**Commit:** cb7007d (Pushed to GitHub master)  
**Date:** October 29, 2025

### Critical Issues RESOLVED ✅

1. **✅ ProtectedRoute Auth Bypass FIXED**
   - Restored proper authentication checks
   - Users now properly redirect to login if not authenticated
   - All protected routes (/discover, /circles, /profile, etc.) now require login

2. **✅ Database Schema Mismatch FIXED**
   - Created `create_auth_trigger.sql` migration
   - Migrated from profiles table to public.users table
   - Trigger now properly syncs auth.users → public.users on signup
   - Verified: Trigger exists and working (`on_auth_user_created`)

3. **✅ AuthContext Updated**
   - Changed from fetching `profiles` table to `public.users` table
   - Updated `userRowToUser()` function to use correct column names
   - Login, registration, and session persistence now use correct table

4. **✅ Zod Validation Fixed**
   - Fixed age field validation (changed from invalid syntax to `z.coerce.number()`)
   - Schema now properly validates registration form

5. **✅ Code Quality**
   - Removed unused React/Badge imports
   - Fixed Input component ref forwarding with forwardRef
   - All TypeScript errors resolved
   - Build successful with 0 errors ✓

### Database Status ✅

- Auth trigger: **ACTIVE** (on_auth_user_created)
- Existing users synced: **2 users** in public.users table
- Table structure: **CORRECT** (all required columns present)
- Migration status: **APPLIED** successfully

### Build Status ✅

```
✓ 2049 modules transformed
✓ Built successfully in 5.08s
0 TypeScript errors
```

---

## NEXT STEPS FOR TESTING

---

## References

- Supabase Auth Docs: https://supabase.com/docs/guides/auth
- RLS Performance: https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select
- Password Security: https://supabase.com/docs/guides/auth/password-security
- MFA Setup: https://supabase.com/docs/guides/auth/auth-mfa

---

## Next Steps

1. **Today**: Fix ProtectedRoute and verify database schema
2. **This Week**: Apply migrations and test auth flow
3. **Next Week**: Optimize RLS and enable security features
4. **Optional**: Remove unused indexes and fix TypeScript errors

# VibeCircle - Complete Development Analysis

## Current Status: MOCKUP WITH NON-FUNCTIONAL UI ELEMENTS

This document outlines ALL sections that need implementation and integration with real functionality.

---

## CRITICAL ISSUES - NON-FUNCTIONAL ELEMENTS

### 1. HOME PAGE (`/`) - Medium Priority
**Current State:** Mockup with static data
- ✅ Welcome banner (working)
- ✅ Quick stats (hardcoded)
- ✅ Recommended circles (mock data)
- ✅ Friend vibes section (mock data)

**TO FIX:**
- [ ] "View All" buttons for circles & vibes (no routing)
- [ ] Stats need real API integration (should show user's actual data)
- [ ] Recommended circles should use algorithm
- [ ] Friend vibes should fetch from real users

**Integration Points:**
```
- useAuth() for current user stats
- useVibe() for recent vibes
- useCircle() for recommended circles
```

---

### 2. DISCOVER PAGE (`/discover`) - HIGH PRIORITY
**Current State:** Partially functional but incomplete
- ✅ Match card swipe UI (working)
- ✅ Pass/Connect buttons (working)
- ⚠️ Filters button (NO FUNCTIONALITY)
- ⚠️ Refresh button (no API call)

**TO IMPLEMENT:**
- [ ] **Filters Modal:**
  - Age range slider
  - Location filter
  - Interest filter (multi-select)
  - Authenticity score minimum
  - Online status
  
- [ ] **AI Matching Algorithm:**
  - Connect to recommendation service
  - Track match history
  - Prevent duplicate matches
  - Score calculation

- [ ] **Connection Tracking:**
  - Save connection requests to database
  - Handle duplicate connections
  - Update daily limits
  - Show connection limits (if premium feature)

**Missing Components:**
```
- FilterModal component
- AdvancedFilters context
- Recommendation engine integration
```

---

### 3. CIRCLES PAGE (`/circles`) - HIGH PRIORITY
**Current State:** UI exists, no backend integration
- ✅ Category filter buttons (working UI)
- ✅ Search functionality (client-side only)
- ⚠️ "Create Circle" button (MODAL INCOMPLETE)
- ⚠️ "More Filters" button (NO FUNCTIONALITY)
- ⚠️ Trending section (hardcoded)

**TO IMPLEMENT:**
- [ ] **Create Circle Modal:**
  - Form validation
  - Image upload
  - Category selection
  - Description & tags
  - Privacy settings (public/private/invitation-only)
  - Auto-add creator as admin

- [ ] **Circle Management:**
  - Join circle (add to user's circles)
  - Leave circle
  - View circle details (modal/new page)
  - Member list
  - Admin controls

- [ ] **Database Integration:**
  - Real circles from database
  - User's joined circles
  - Trending calculation (based on new members/activity)

- [ ] **Advanced Filters:**
  - Size (small, medium, large)
  - Activity level
  - Membership type (open, approval-needed, invitation-only)

**Missing Features:**
```
- CircleDetailsModal
- CreateCircleForm
- CircleMembersList
- CircleSettingsPanel
- CircleAdminControls
```

---

### 4. CREATE VIBE PAGE (`/create-vibe`) - MEDIUM PRIORITY
**Current State:** ~70% functional
- ✅ Video recording (working)
- ✅ Video preview (working)
- ✅ Mood selection (working)
- ✅ Tag management (working)
- ⚠️ Upload video option (button not wired)
- ⚠️ Share to circles (NO IMPLEMENTATION)
- ⚠️ Privacy settings (incomplete)
- ⚠️ Form submission (goes to home, doesn't save)

**TO IMPLEMENT:**
- [ ] **Video Upload:**
  - File input handler
  - Video size validation (max 100MB)
  - Format validation (MP4, MOV, WebM)
  - Progress indicator
  - Error handling

- [ ] **Circle Sharing:**
  - Multi-select circles from user's joined circles
  - Preview which circles will see the vibe
  - Individual circle privacy overrides

- [ ] **Database Save:**
  - Store video to storage service
  - Create vibe record in database
  - Associate with user
  - Set privacy settings
  - Handle errors gracefully

- [ ] **Share Integration:**
  - After creation, show share options
  - Social media sharing
  - Copy link
  - Email share

**Database Schema Needed:**
```sql
-- Vibes table structure
- id, user_id, video_url, description
- mood, tags[], is_private
- shared_circles[], created_at
```

---

### 5. CONNECTIONS PAGE (`/connections`) - HIGH PRIORITY
**Current State:** UI only, limited functionality
- ✅ Tab switching (working)
- ✅ Search (client-side only)
- ⚠️ "Accept" button (hardcoded state change, no persistence)
- ⚠️ "Decline" button (no functionality)
- ⚠️ "Phone" button (no functionality)
- ⚠️ "Video" button (no functionality)
- ⚠️ "Calendar" button (no functionality)
- ⚠️ Chat (partially working with mock data)

**TO IMPLEMENT:**
- [ ] **Real Data:**
  - Fetch actual friend connections
  - Fetch pending requests (sent & received)
  - Real-time online status

- [ ] **Connection Actions:**
  - Accept friend request (database update)
  - Decline friend request (delete request)
  - Remove friend (database update)
  - Block user

- [ ] **Communication Features:**
  - Real chat integration (currently mocking)
  - Video call setup (needs signaling service)
  - Audio call setup
  - Event scheduling modal

- [ ] **Chat Box Integration:**
  - Real message fetching
  - Message sending (WebSocket or polling)
  - Message history pagination
  - Typing indicators
  - Read receipts

**Missing Contexts & Components:**
```
- Real ChatContext (with message persistence)
- VideoCallModal
- AudioCallModal
- EventSchedulingModal
- MessageInput with file upload
```

---

### 6. PROFILE PAGE (`/profile`) - MEDIUM PRIORITY
**Current State:** ~60% functional
- ✅ Display user info (working)
- ✅ Avatar display (working)
- ⚠️ "Edit Profile" button (MODAL EXISTS, not saving)
- ⚠️ "Share" button (no functionality)
- ⚠️ Tab switching (working)
- ⚠️ Badges section (showing badges, but not earned dynamically)

**TO IMPLEMENT:**
- [ ] **Edit Profile:**
  - Save all changes to database
  - Avatar upload
  - Validate all fields
  - Update auth context

- [ ] **Share Profile:**
  - Generate shareable link
  - QR code generation
  - Social media pre-fill

- [ ] **Dynamic Badges:**
  - Calculate badge conditions
  - Show "how to earn" hints
  - Animate new badge earning

- [ ] **Interest/Values Management:**
  - Edit interests
  - Edit values
  - Suggest interests based on vibes

**Backend Integration:**
```
- User profile update endpoint
- Profile sharing/analytics
- Badge achievement tracking
```

---

### 7. NOTIFICATIONS PAGE (`/notifications`) - LOW PRIORITY
**Current State:** ~70% functional
- ✅ Display notifications (mock data)
- ✅ Mark as read (state only)
- ⚠️ "Mark All Read" (state only)
- ⚠️ Delete notification (state only)
- ⚠️ "Settings" button (no routing)
- ⚠️ Action buttons not wired

**TO IMPLEMENT:**
- [ ] **Real Notifications:**
  - Fetch from database
  - WebSocket for real-time
  - Persist read status

- [ ] **Notification Actions:**
  - Mark as read (update DB)
  - Delete notification (update DB)
  - Follow action URLs

- [ ] **Settings Page:**
  - Notification type preferences
  - Frequency settings
  - Quiet hours

---

### 8. EVENTS PAGE (`/events`) - HIGH PRIORITY
**Current State:** UI only, almost no functionality
- ✅ Filter tabs (working UI)
- ⚠️ Search (client-side only)
- ⚠️ "Create Event" button (MODAL EXISTS, form incomplete)
- ⚠️ "More Filters" button (no functionality)
- ⚠️ "Join Event" button (state change only)
- ⚠️ "Learn More" button (no routing)

**TO IMPLEMENT:**
- [ ] **Create Event Modal:**
  - Complete form validation
  - Date/time picker
  - Location input with map
  - Event image upload
  - Capacity limits
  - Accessibility options
  - Virtual event URL setup

- [ ] **Event Features:**
  - Event filtering (date, location, type)
  - RSVP system
  - Attendee list
  - Event chat/comments
  - Reminder notifications
  - Calendar export (.ics)

- [ ] **Event Integration:**
  - Virtual meeting link (Zoom, Meet integration)
  - Auto-send reminders
  - Post-event surveys
  - Event photos gallery

**Database Schema:**
```sql
CREATE TABLE events (
  id, title, description, date, time,
  location, is_virtual, virtual_link,
  organizer_id, capacity, attendees[]
)
```

---

### 9. SAFETY PAGE (`/safety`) - LOW-MEDIUM PRIORITY
**Current State:** ~80% functional
- ✅ Features listed
- ✅ Guidelines displayed
- ✅ Tips shown
- ⚠️ "Report Issue" button (MODAL EXISTS, not fully wired)
- ⚠️ Report submission (not saving to database)

**TO IMPLEMENT:**
- [ ] **Report System:**
  - Save reports to database
  - Notify moderation team
  - User confirmation
  - Report tracking

- [ ] **Advanced Safety:**
  - Block list management
  - Mute users
  - Content warnings
  - Report history

---

### 10. SEARCH PAGE (`/search`) - MEDIUM PRIORITY
**Current State:** ~60% functional
- ✅ Search UI (working)
- ✅ Results display (mock data)
- ⚠️ "Connect" buttons (no functionality)
- ⚠️ "Follow" buttons (no functionality)
- ⚠️ Hashtag clicking (no routing)
- ⚠️ Trending searches (hardcoded)

**TO IMPLEMENT:**
- [ ] **Real Search:**
  - Full-text search against database
  - Elasticsearch for performance
  - Recent searches storage
  - Trending calculation

- [ ] **Search Actions:**
  - Connect from search results
  - Follow hashtags
  - View user profiles
  - Preview circles

---

### 11. SETTINGS PAGE (`/settings`) - HIGH PRIORITY
**Current State:** UI exists, no data persistence
- ✅ Tab UI (working)
- ✅ Toggles UI (working)
- ⚠️ "Save Changes" buttons (not saving to DB)
- ⚠️ Account settings (not persisting)
- ⚠️ Privacy settings (not persisting)
- ⚠️ Notification settings (not persisting)
- ⚠️ "Download Data" (fake loading)
- ⚠️ "Delete Account" (confirm modal only)

**TO IMPLEMENT:**
- [ ] **Settings Persistence:**
  - Save account settings to DB
  - Save privacy settings to DB
  - Save notification preferences to DB
  - Handle validation errors

- [ ] **Account Management:**
  - Email verification
  - Password change
  - Two-factor authentication
  - Connected apps/integrations

- [ ] **Data Management:**
  - Real GDPR data export
  - Data deletion with verification
  - Activity history export

---

### 12. HELP PAGE (`/help`) - LOW PRIORITY
**Current State:** ~90% functional
- ✅ FAQ system (working)
- ✅ Category filter (working)
- ✅ Search (client-side working)
- ⚠️ "Contact Support" button (no routing)
- ⚠️ "Community Forum" button (no routing)
- ⚠️ Contact option links (hardcoded routes that don't exist)

**TO IMPLEMENT:**
- [ ] **Contact Form:**
  - Email support integration
  - Ticket tracking system
  - Live chat widget

- [ ] **External Links:**
  - Community forum setup
  - Video tutorial links
  - User guide documentation

---

## MISSING FEATURES - GLOBAL

### Authentication & User Management
- [ ] Email verification on signup
- [ ] Password reset flow
- [ ] Password change
- [ ] Two-factor authentication
- [ ] Social login (Google, Apple)
- [ ] Profile verification (photo ID)
- [ ] Account recovery

### Real-time Features
- [ ] WebSocket setup for live notifications
- [ ] Online status tracking
- [ ] Live typing indicators
- [ ] Message delivery confirmations
- [ ] Presence awareness

### Premium/Monetization
- [ ] Premium tier features
- [ ] Subscription management
- [ ] Payment processing
- [ ] Premium-only filters
- [ ] Unlimited daily matches

### Moderation & Safety
- [ ] Content moderation pipeline
- [ ] User report handling
- [ ] Block/mute functionality
- [ ] Spam detection
- [ ] Ban system

### Analytics
- [ ] User engagement tracking
- [ ] Event analytics
- [ ] Circle growth tracking
- [ ] Search analytics

### Integration Needed
- [ ] Video storage service (S3, Firebase)
- [ ] Email service (SendGrid, Mailgun)
- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] Video conferencing (Twilio, Agora)
- [ ] SMS service (Twilio)

---

## DATABASE SCHEMA GAPS

Missing or incomplete tables:
- [ ] `circles` - partially defined
- [ ] `circle_members` - not defined
- [ ] `connections` - partially defined
- [ ] `events` - not defined
- [ ] `event_attendees` - not defined
- [ ] `reports` - not defined
- [ ] `notifications` - partially defined
- [ ] `messages` - not defined
- [ ] `vibes` - needs storage_url, view_count, like_count
- [ ] `vibe_comments` - not defined
- [ ] `badges` - not defined
- [ ] `user_badges` - not defined
- [ ] `blocks` - not defined
- [ ] `search_history` - not defined
- [ ] `hashtags` - not defined

---

## COMPONENT GAPS

Missing reusable components:
- [ ] `FilterModal` - for Discover filters
- [ ] `CreateCircleForm` - with validation
- [ ] `CreateEventForm` - with validation
- [ ] `VideoCallModal` - for connections
- [ ] `ReportModal` - for safety
- [ ] `ConfirmDialog` - for destructive actions
- [ ] `ImageUpload` - with preview
- [ ] `DateTimePicker` - for events
- [ ] `LocationPicker` - for events/profile
- [ ] `NotificationBell` - with real count
- [ ] `ChatInterface` - full-featured
- [ ] `VideoPlayer` - with analytics
- [ ] `PaginatedList` - for large result sets

---

## CONTEXT GAPS

Incomplete or missing contexts:
- [ ] `ChatContext` - needs persistence
- [ ] `MatchContext` - needs algorithm
- [ ] `CircleContext` - needs real data
- [ ] `VibeContext` - needs real data
- [ ] `UserContext` - needs more fields
- [ ] `NotificationContext` - needs real-time
- [ ] `SearchContext` - needs backend
- [ ] `PreferenceContext` - for user preferences

---

## PRIORITY IMPLEMENTATION ORDER

### Phase 1 (CRITICAL - Week 1-2)
1. [ ] Connect to real database
2. [ ] User authentication (signup/login working)
3. [ ] Real profile data loading
4. [ ] Real vibe creation & storage
5. [ ] Real connections system
6. [ ] Settings persistence

### Phase 2 (HIGH - Week 3-4)
1. [ ] Discover page filters
2. [ ] AI matching algorithm
3. [ ] Circle creation & joining
4. [ ] Event creation
5. [ ] Real-time chat
6. [ ] Notifications system

### Phase 3 (MEDIUM - Week 5-6)
1. [ ] Video calling
2. [ ] Advanced search
3. [ ] Badge system
4. [ ] Report system
5. [ ] Safety features
6. [ ] Data export

### Phase 4 (NICE TO HAVE - Week 7+)
1. [ ] Premium features
2. [ ] Analytics dashboard
3. [ ] Community forum
4. [ ] Video tutorials
5. [ ] Advanced moderation

---

## MOCKUP AREAS TO REFACTOR

Current Areas Using 100% Mock Data:
- Home page stats
- All recommended content
- Match suggestions
- Circle suggestions
- Event suggestions
- Search results
- Trending items
- User badges
- User connections

**Action Item:** Replace all `mockData.ts` imports with real API calls

---

## BUTTON STATUS REFERENCE

🟢 = Functional
🟡 = Partially Functional
🔴 = Non-Functional

**Home:** 🟡🟡🟡
**Discover:** 🟡🟡🟢🟢
**Circles:** 🔴🔴🟡🟡
**Create Vibe:** 🟢🟢🟢🟢
**Connections:** 🔴🔴🔴🔴
**Profile:** 🔴🟢🟡
**Notifications:** 🟡🟡🟡
**Events:** 🔴🔴🟡🟡
**Safety:** 🔴🟡
**Search:** 🔴🔴🔴
**Settings:** 🔴🔴🔴
**Help:** 🟡🟡

**Overall:** ~35% functional