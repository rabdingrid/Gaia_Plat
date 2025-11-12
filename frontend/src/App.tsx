import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './app/HomePage';
import MCQPage from './app/Candidate/MCQPage';
import CodingTestPage from './app/Candidate/CodingTestPage';
import SystemDesignPage from './app/Candidate/SystemDesignPage';
import TourMCQPage from './app/tour/TourMCQPage';
import TourCodingPage from './app/tour/TourCodingPage';
import TourSystemDesignPage from './app/tour/TourSystemDesignPage';
import LoginPage from './app/Auth/LoginPage';
import CallbackPage from './app/Auth/CallbackPage';
import Admin from './pages/Admin';
import Recruiter from './pages/Recruiter';
import TestScheduledPage from './app/Candidate/TestScheduledPage';
import TestPermissionsPage from './app/Candidate/TestPermissionsPage';
import TestOverviewPage from './app/Candidate/TestOverviewPage';
import TestCompletedPage from './app/Candidate/TestCompletedPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  const userData = localStorage.getItem('user_data');

  // Check if user is authenticated or has stored user data
  const isAuth = isAuthenticated || (userData !== null);

  if (!isAuth) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

// Root route handler - redirects to login if not authenticated, otherwise based on user type
const RootRoute = () => {
  const { isAuthenticated, user } = useAuth();
  const userData = localStorage.getItem('user_data');
  const isAuth = isAuthenticated || (userData !== null);

  if (isAuth) {
    // Get user type from context or localStorage
    let userType: string | undefined;
    if (user?.userType) {
      userType = user.userType;
    } else if (userData) {
      try {
        const parsed = JSON.parse(userData);
        userType = parsed.userType;
      } catch {
        // Fallback to home if parsing fails
      }
    }

    // Redirect based on user type
    if (userType === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    if (userType === 'recruiter') {
      return <Navigate to="/recruiter" replace />;
    }
    // Default to test/scheduled for candidates or unknown types
    return <Navigate to="/test/scheduled" replace />;
  }

  return <Navigate to="/auth/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<CallbackPage />} />
      
      {/* Root route - redirects based on auth status */}
      <Route path="/" element={<RootRoute />} />
      
      {/* Protected Routes - require authentication */}
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      <Route path="/recruiter" element={<ProtectedRoute><Recruiter /></ProtectedRoute>} />
      <Route path="/test/scheduled" element={<ProtectedRoute><TestScheduledPage /></ProtectedRoute>} />
      <Route path="/test/permissions" element={<ProtectedRoute><TestPermissionsPage /></ProtectedRoute>} />
      <Route path="/test-overview" element={<ProtectedRoute><TestOverviewPage /></ProtectedRoute>} />
      <Route path="/test/completed" element={<ProtectedRoute><TestCompletedPage /></ProtectedRoute>} />
      
      {/* Tutorial/Mock Test Pages */}
      <Route path="/tutorial/mcq" element={<TourMCQPage />} />
      <Route path="/tutorial/coding" element={<TourCodingPage />} />
      <Route path="/tutorial/system-design" element={<TourSystemDesignPage />} />
      
      {/* Original Test Pages */}
      <Route path="/candidate/mcq" element={<ProtectedRoute><MCQPage /></ProtectedRoute>} />
      <Route path="/candidate/coding" element={<ProtectedRoute><CodingTestPage /></ProtectedRoute>} />
      <Route path="/candidate/system-design" element={<ProtectedRoute><SystemDesignPage /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
