import { type ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

interface AdminRoutesProps {
  children: ReactNode;
}

export default function AdminRoutes({ children }: AdminRoutesProps) {
  const { authLoading, user } = useAuth();
  if (authLoading) return <p>loading ...</p>;
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
