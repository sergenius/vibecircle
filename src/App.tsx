import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Layout } from './components/layout/Layout';

// Pages
import { Home } from './pages/Home';
import { Discover } from './pages/Discover';
import { Circles } from './pages/Circles';
import { CreateVibe } from './pages/CreateVibe';
import { Connections } from './pages/Connections';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';
import { Events } from './pages/Events';
import { SearchPage } from './pages/Search';
import { Settings } from './pages/Settings';
import { Safety } from './pages/Safety';
import { Help } from './pages/Help';

// Auth components
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';

/**
 * CURRENT APPLICATION STATUS: ~35% FUNCTIONAL
 * 
 * This application is currently a MOCKUP with mostly non-functional UI elements.
 * For a comprehensive analysis of all underdeveloped sections, see CLAUDE.md
 * 
 * SUMMARY:
 * ✅ UI/UX: 95% complete (beautiful, production-ready design)
 * ❌ Functionality: 35% complete (mostly mock data, non-persisting)
 * ❌ Backend Integration: 15% complete (needs full integration)
 * ❌ Real-time Features: 0% complete (not implemented)
 * 
 * CRITICAL ISSUES (Must Fix First):
 * - All button actions use mock data or don't do anything
 * - No data persistence across page reloads
 * - Database schema incomplete
 * - Missing API integration layer
 * - No real authentication backend
 * - No WebSocket for real-time features
 * 
 * See CLAUDE.md for detailed breakdown of 100+ action items
 */
// Development flag: Set to true to bypass auth for UI testing
// Should ALWAYS be false in production
const BYPASS_AUTH = import.meta.env.MODE === 'development' && false;

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Allow bypass in dev mode when flag is true
  if (BYPASS_AUTH) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={
        <AuthRoute>
          <LoginForm />
        </AuthRoute>
      } />
      <Route path="/register" element={
        <AuthRoute>
          <RegisterForm />
        </AuthRoute>
      } />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="discover" element={<Discover />} />
        <Route path="circles" element={<Circles />} />
        <Route path="create-vibe" element={<CreateVibe />} />
        <Route path="connections" element={<Connections />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="events" element={<Events />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="settings" element={<Settings />} />
        <Route path="safety" element={<Safety />} />
        <Route path="help" element={<Help />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router basename="/vibecircle">
            <AppRoutes />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;