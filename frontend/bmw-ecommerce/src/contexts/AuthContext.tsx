import { createContext, useEffect, useState, type ReactNode } from "react";
import type { IAuthContext, IUser } from "../types/auth";
/* eslint-disable react-refresh/only-export-components */
export const AuthContext = createContext<IAuthContext | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      Promise.resolve().then(() => setUser(JSON.parse(userData)));
    }
  }, []);
  const login = (userData: IUser, token: string) => {
    setUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
