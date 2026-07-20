import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Force password change check
  if (user.role === 'BANK_ADMIN' && !user.isPasswordChanged && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
