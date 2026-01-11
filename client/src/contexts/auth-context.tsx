import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for persistent auth (7-day token)
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      
      if (storedUser && storedUser !== "undefined" && storedUser !== "null" && storedUser.trim() !== "") {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Verify parsed user has required fields
          if (parsedUser && typeof parsedUser === 'object' && parsedUser.id && parsedUser.role) {
            // Verify token exists and is valid (JWT expiry is handled by backend)
            if (storedToken && storedToken !== "undefined" && storedToken !== "null" && storedToken.trim() !== "") {
              setUser(parsedUser);
            } else {
              // Token missing, clear user
              localStorage.removeItem("user");
              setUser(null);
            }
          } else {
            // Invalid user object, clear it
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
          }
        } catch (e) {
          // corrupted or invalid JSON in localStorage — remove and reset
          console.error('Error parsing stored user:', e);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
        }
      } else {
        // No stored user, ensure state is clean
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
