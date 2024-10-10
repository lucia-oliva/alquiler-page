// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { PropTypes } from "prop-types";


export const ProtectedRoute = ({ children, adminRoute }) => {
  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    adminRoute: PropTypes.bool, // Nueva prop para indicar si la ruta es de admin
  };

  const { user } = useAuth();
  console.log("Usuario en ProtectedRoute:", user); // Para depuración

  if (!user) {
    return <Navigate to="/login" />;
  }


  if (adminRoute && !user.admin) {
    return <Navigate to="/reservation" />;  // Si intenta acceder a una ruta admin y no lo es
  }

  return children;
};

