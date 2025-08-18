import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <p className="text-xl">Checking session...</p>
    </div>;
  }

  if (user) {
    return <Navigate to="/user" replace />;
  }

  return children;
}
