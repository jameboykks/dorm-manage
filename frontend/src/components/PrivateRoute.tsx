
import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { ReactNode } from 'react';

interface PrivateRouteProps {
  requireAdmin?: boolean;
  children: ReactNode;
}

const PrivateRoute = ({ requireAdmin = false, children }: PrivateRouteProps) => {
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && currentUser.user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute; 