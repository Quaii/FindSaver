import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  // Show loading or redirect if not authenticated
  if (loading) {
    return <div>Loading...</div>; // Could be replaced with a proper loading component
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;