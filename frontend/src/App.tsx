import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import SchemeMatcher from './pages/SchemeMatcher';
import FinancialDNA from './pages/FinancialDNA';
import LoanDetector from './pages/LoanDetector';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChangePassword from './pages/ChangePassword';
import SuperAdminDashboard from './pages/super/SuperAdminDashboard';
import BranchManagement from './pages/super/BranchManagement';
import AdminManagement from './pages/super/AdminManagement';
import AdminDashboard from './pages/admin/AdminDashboard';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const showNavbar = !['/login', '/signup', '/change-password'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-pure-black text-white font-sans m-0 antialiased selection:bg-white selection:text-black">
      {showNavbar && <Navbar />}
      <main>
        {children}
      </main>
    </div>
  );
};

function App() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
            
            {/* Protected Routes */}
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/schemes" element={<ProtectedRoute><SchemeMatcher /></ProtectedRoute>} />
            <Route path="/dna" element={<ProtectedRoute><FinancialDNA /></ProtectedRoute>} />
            <Route path="/loan-detector" element={<ProtectedRoute><LoanDetector /></ProtectedRoute>} />
            
            {/* Bank Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['BANK_ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/scoring" element={<AdminDashboard />} />
              <Route path="/admin/applications" element={<AdminDashboard />} />
            </Route>

            {/* Super Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
              <Route path="/super/dashboard" element={<SuperAdminDashboard />} />
              <Route path="/super/branches" element={<BranchManagement />} />
              <Route path="/super/admins" element={<AdminManagement />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
