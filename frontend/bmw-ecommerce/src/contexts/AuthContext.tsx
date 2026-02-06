import {
  createContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { IAuthContext, IUser } from "../types/auth.d";
import { getMe } from "../services/authApi";
import { useNavigate } from "react-router-dom";
/* eslint-disable react-refresh/only-export-components */
export const AuthContext = createContext<IAuthContext | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (isMounted) setAuthLoading(false);
        return;
      }

      try {
        const userRes = await getMe(token);
        // backend may return a Mongoose document with `_id` — normalize to `id`
        const normalized = userRes
          ? {
              id: userRes._id || userRes.id,
              name: userRes.name,
              email: userRes.email,
              role: userRes.role || "user",
            }
          : null;
        if (isMounted) setUser(normalized);
      } catch {
        localStorage.removeItem("token");
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback((userData: IUser, token: string) => {
    setUser(userData);
    localStorage.setItem("token", token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/");
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
