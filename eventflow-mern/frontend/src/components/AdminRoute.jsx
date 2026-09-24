import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

export default function AdminRoute({ children }) {
  const { user, status } = useAuth();

  if (status === "loading") {
    return <Loading />;
  }

  // If not logged in, go to login
  if (!user || status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not admin, go to home
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
