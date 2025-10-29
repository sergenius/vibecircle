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
