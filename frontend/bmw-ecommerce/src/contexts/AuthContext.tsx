import { createContext, useEffect, useState, type ReactNode } from "react";
import type { IAuthContext, IUser } from "../types/auth.d";
/* eslint-disable react-refresh/only-export-components */
export const AuthContext = createContext<IAuthContext | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (isMounted) setAuthLoading(false);
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          if (isMounted) setUser(null);
          return;
        }

        if (!res.ok) {
          console.error("Auth check failed:", res.status, await res.text());
          return;
        }
        const userData = await res.json();
        if (isMounted) setUser(userData);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // fetch was aborted; ignore
        } else {
          console.error("Auth check network error:", err);
        }
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const login = (userData: IUser, token: string) => {
    setUser(userData);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
