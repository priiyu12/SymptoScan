import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PrivateRoute;
