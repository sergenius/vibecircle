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

## Executive Summary

Your authentication flow has **structural integration issues** with Supabase that will cause login/registration failures. The main problems are:

1. **CRITICAL**: Auth context is looking for `profiles` table data, but your primary user data is in a new `public.users` table
2. **CRITICAL**: ProtectedRoute in App.tsx is bypassed, exposing app to unauthenticated access
3. **HIGH**: Database schema mismatch between migrations and actual implementation
4. **HIGH**: RLS policies are not optimized and will impact performance at scale
5. **MEDIUM**: Email confirmation flow not properly handled in registration

---

## Issue Details

### 🔴 CRITICAL ISSUE #1: Database Schema Mismatch

**Problem:**  
Your `AuthContext.tsx` references a `profiles` table for user data, but the actual implementation uses two different table structures:

- **Initial Migration** (`20250128_initial_schema.sql`): Creates `profiles` table with `id` as PK referencing `auth.users(id)`
- **Actual Database**: Now has a `public.users` table (newer design) with completely different structure

**Evidence:**
```
AuthContext tries to fetch: SELECT * FROM profiles WHERE id = authData.user.id
But database now has: public.users table with email, username, display_name, etc.
Also still has: public.profiles table (if it exists)
```

**Impact:**
- Registration will fail because profile creation won't work with `public.users` table
- Login will fail because it can't find user profile data
- Profile updates will target wrong table

**Solution Required:**
1. Decide which user table is authoritative (profiles vs users)
2. Update AuthContext to use correct table
3. Fix the trigger that creates profiles on signup

---

### 🔴 CRITICAL ISSUE #2: ProtectedRoute Bypass

**Location:** `src/App.tsx` lines 26-50

**Problem:**
```typescript
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // TEMPORARY: Bypass authentication to view the app
  return <>{children}</>;  // ← Commented out actual auth check!
```

**Impact:**
- ANY unauthenticated user can access all protected routes
- Authentication is completely bypassed
- Anyone can navigate to `/` and see the full app

**Fix Required:**
Uncomment the proper auth checking logic:
```typescript
const { isAuthenticated, isLoading } = useAuth();

if (isLoading) {
  return <LoadingSpinner />;
}

if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}

return <>{children}</>;
```

---

### 🟠 HIGH ISSUE #3: Registration Email Confirmation Not Handled

**Location:** `src/contexts/AuthContext.tsx` lines 202-206

**Problem:**
```typescript
if (!authData.session) {
  console.warn('No session returned - email confirmation is required');
  dispatch({ type: 'LOGOUT' });
  throw new Error('Account created successfully! ...');
}
```

Currently:
- Registration requires email confirmation
- But app logs user out after signup
- User must check email and confirm before logging in again
- No redirect to verification screen

**Current Flow:** Signup → Email sent → User logged out → User must click email link → User logs in

**Issue:** User experience is poor, and no verification screen guides them

---

### 🟠 HIGH ISSUE #4: Profile Creation Trigger Issues

**Problem:**
Your trigger in migrations assumes `profiles` table structure, but actual implementation has changed:

```sql
INSERT INTO public.profiles (id, email, username, display_name, age)
```

But current database might:
- Not have email column in profiles
- Have different column names
- Be using public.users table instead

**Evidence:** 
- `fix_profiles_trigger.sql` exists and was created to fix issues
- This indicates the trigger had problems

---

### 🟠 HIGH ISSUE #5: RLS Policies Not Optimized

**Supabase Advisors Report:**
- 40+ RLS policies are re-evaluating `auth.uid()` for each row
- Should use `(SELECT auth.uid())` instead for performance

**Affected Tables:**
- public.users, public.vibes, public.vibe_comments, public.circles, public.circle_members, public.connections, public.messages, public.events, public.notifications, public.matches, public.vibe_likes, public.blocks, public.reports

**Example of Problem:**
```sql
-- ❌ CURRENT (inefficient):
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- ✅ SHOULD BE:
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING ((SELECT auth.uid()) = id);
```

---

### 🟡 MEDIUM ISSUE #6: Supabase Security Warnings

**From Security Advisors:**
1. **Leaked Password Protection Disabled** - Enable HaveIBeenPwned checking
2. **Insufficient MFA Options** - Enable more MFA methods (TOTP, WebAuthn, etc.)

---

### 🟡 MEDIUM ISSUE #7: Unused Indexes

**From Performance Advisors:**
39 unused indexes found across tables. These consume resources without benefit:
- idx_connections_user_id
- idx_messages_sender_id
- idx_users_email
- idx_vibes_user_id
- etc.

**Foreign Key Indexes Missing:**
Some foreign key columns don't have covering indexes:
- public.reports (4 foreign keys without indexes)

---

## Supabase Database Status

### Extensions Installed ✅
- UUID generation (uuid-ossp)
- Supabase Vault
- pg_graphql
- pg_stat_statements
- pgcrypto

### Tables Present
- auth.users (Supabase managed) - 2 users
- public.users - 1 user
- public.profiles - 0 users (if exists)
- public.vibes, circles, connections, messages, events, notifications, etc.

### RLS Status ✅
All tables have RLS enabled, which is good for security

### Row Level Security (RLS) Policies
- 40+ policies configured
- Need optimization for performance (see Issue #5)

---

## Authentication Flow Analysis

### Current Login Flow
```
1. User enters email/password in LoginForm
2. Supabase authenticates with auth.signInWithPassword()
3. If successful, fetch profile from profiles table
4. Convert profile to User object with badges
5. Dispatch LOGIN_SUCCESS
6. App renders main layout
```

**Current Status:** ❌ BROKEN
- Profiles table may not exist or have wrong structure
- Badge fetching assumes profiles exist

### Current Registration Flow
```
1. User fills 3-step form (account, personal, interests)
2. Supabase creates auth user with signUp()
3. If email confirmation required: logout user
4. Wait for profile creation via trigger
5. Update profile with interests
6. Fetch complete profile
7. Convert to User object
8. Dispatch LOGIN_SUCCESS
```

**Current Status:** ❌ BROKEN
- Email confirmation flow not handled
- Profile trigger has issues
- User logged out after signup

### Session Initialization
```
1. On app mount, useEffect runs
2. Get existing session with getSession()
3. If session exists, fetch profile and login
4. Setup auth state change listener
5. Cleanup subscription on unmount
```

**Current Status:** ⚠️ PARTIALLY WORKING
- Will fail if profile table wrong structure
- But listener setup is correct

---

## TypeScript Compilation Issues

**Status:** ❌ 141 TypeScript errors

**Major Categories:**
1. **React imports not used** (39 errors) - Minor, just cleanup
2. **Path resolution issues** - Uses `@/` aliases that may not be configured
3. **Component type mismatches** - Button onDrag prop conflict with framer-motion
4. **Module missing declarations** - React Native modules not installed for web
5. **Zod validation** - Incorrect use of `required_error` in number schema

---

## Security Assessment

### ✅ What's Good
- RLS policies are enabled on all tables
- Supabase auth is properly initialized
- Auth context uses proper error handling
- Email confirmation requirement enabled

### ⚠️ What's Missing
- Leaked password protection disabled
- Insufficient MFA options configured
- No rate limiting on auth endpoints
- Password requirements could be stronger

### ❌ What's Broken
- Auth bypass in ProtectedRoute
- Database schema inconsistency
- Email verification flow incomplete

---

## Recommendations

### 🔴 CRITICAL - Fix Immediately

**1. Fix Database Schema Consistency**
- **Action**: Run the fix_profiles_trigger.sql to ensure profile creation works
- **Timeline**: Immediate
- **SQL Location**: `supabase/migrations/fix_profiles_trigger.sql`

**2. Fix ProtectedRoute Auth Check**
- **Action**: Uncomment the proper auth checking in `src/App.tsx` lines 30-48
- **Timeline**: Immediate  
- **File**: `src/App.tsx`

**3. Verify Profile/User Table Structure**
- **Action**: Check which table is authoritative (profiles vs users)
- **Commands**:
  ```sql
  SELECT column_name, data_type FROM information_schema.columns 
  WHERE table_name = 'profiles';
  
  SELECT column_name, data_type FROM information_schema.columns 
  WHERE table_name = 'users' AND table_schema = 'public';
  ```

### 🟠 HIGH - Fix This Sprint

**4. Handle Email Confirmation Flow**
- **Action**: Create VerificationScreen that guides users after signup
- **File to Create**: `src/screens/VerificationScreen.tsx`
- **Flow**: After signup → Show verification UI → Email link re-authenticates → Auto-login

**5. Optimize RLS Policies**
- **Action**: Update all RLS policies to use `(SELECT auth.uid())` format
- **File**: Create new migration `fix_rls_performance.sql`
- **Impact**: Significant performance improvement at scale

**6. Enable Security Features**
- **Action**: Enable in Supabase dashboard:
  - Leaked password protection
  - MFA (at least TOTP)
  - Stronger password requirements
- **Location**: Supabase Project Settings → Authentication

### 🟡 MEDIUM - Fix Next Sprint

**7. Clean Up Unused Indexes**
- **Action**: Remove 39 unused indexes found by advisor
- **File**: Create migration `cleanup_unused_indexes.sql`
- **Performance Impact**: Faster writes, lower storage

**8. Fix TypeScript Compilation**
- **Action**: 
  - Add missing React imports where needed
  - Configure path aliases properly
  - Fix framer-motion Button type conflicts
- **Files**: Multiple `src/` files

---

## Quick Start: Get Auth Working

### Step 1: Verify Your Setup (5 minutes)
```bash
# Check Supabase client version
npm list @supabase/supabase-js
# Should show: @supabase/supabase-js@2.57.4 ✓ (Good version)

# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
# Both should have values
```

### Step 2: Apply Fix Migrations (10 minutes)
```bash
# Navigate to Supabase project → SQL Editor
# Run: supabase/migrations/fix_profiles_trigger.sql
# This fixes profile creation on signup
```

### Step 3: Fix ProtectedRoute (5 minutes)
Edit `src/App.tsx` and uncomment lines 30-48 to restore auth checking

### Step 4: Test Auth Flow (10 minutes)
```bash
npm run dev
# Try to access / without login → Should redirect to /login
# Try to login → Should show user data if DB is correct
```

---

## Testing Checklist

- [ ] Can access `/login` without auth
- [ ] Cannot access `/` without auth (redirects to login)
- [ ] Can register with valid email/password
- [ ] Email confirmation required message shows
- [ ] After confirmation, can login
- [ ] Profile loads with interests
- [ ] Badges load correctly
- [ ] Logout works
- [ ] Session persists on page refresh
- [ ] Invalid credentials show error

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
