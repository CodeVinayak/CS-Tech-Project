import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (isAuthenticated) {
    return element;
  } else {
    // Redirect to the login page if not authenticated
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute; 