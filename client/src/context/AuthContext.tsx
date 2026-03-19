import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authApi } from "../api/auth.api";

interface AuthContextType {
  isLoggedIn: boolean;
  email: string | null;
  role: "admin" | "student" | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<"admin" | "student" | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedEmail = localStorage.getItem("userEmail");
        const storedRole = localStorage.getItem("userRole") as
          | "admin"
          | "student"
          | null;
        if (storedEmail && storedRole) {
          setEmail(storedEmail);
          setRole(storedRole);
          setIsLoggedIn(true);
        }
      } catch (err) {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        setIsLoggedIn(false);
        setEmail(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (loginEmail: string, password: string) => {
    setLoading(true);
    try {
      const response = await authApi.login(loginEmail, password);
      const userRole = response.role || "student";
      setEmail(loginEmail);
      setRole(userRole);
      setIsLoggedIn(true);
      localStorage.setItem("userEmail", loginEmail);
      localStorage.setItem("userRole", userRole);
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerEmail: string, password: string) => {
    setLoading(true);
    try {
      await authApi.register(registerEmail, password);
      const response = await authApi.login(registerEmail, password);
      const userRole = response.role || "student";
      setEmail(registerEmail);
      setRole(userRole);
      setIsLoggedIn(true);
      localStorage.setItem("userEmail", registerEmail);
      localStorage.setItem("userRole", userRole);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
      setEmail(null);
      setRole(null);
      setIsLoggedIn(false);
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userRole");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, email, role, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
