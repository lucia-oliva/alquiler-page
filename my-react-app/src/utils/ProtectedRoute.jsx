// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { PropTypes } from "prop-types";

export const ProtectedRoute = ({ children }) => {
  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};
