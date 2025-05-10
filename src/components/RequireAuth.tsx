
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navigation from "./Navigation";

interface RequireAuthProps {
  children: JSX.Element;
  adminOnly?: boolean;
}

const RequireAuth = ({ children, adminOnly = false }: RequireAuthProps) => {
  const { isAuthenticated, userType } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires admin access and user is not admin
  if (adminOnly && userType !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If authenticated, show the navigation and the protected component
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

export default RequireAuth;
