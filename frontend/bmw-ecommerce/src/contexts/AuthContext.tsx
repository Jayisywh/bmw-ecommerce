import { createContext, useEffect, useState, type ReactNode } from "react";
import type { IAuthContext, IUser } from "../types/auth.d";
/* eslint-disable react-refresh/only-export-components */
export const AuthContext = createContext<IAuthContext | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`http://127.0.0.1:8000/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthroized");
        return res.json();
      })
      .then((user) => setUser(user))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      });
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
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
