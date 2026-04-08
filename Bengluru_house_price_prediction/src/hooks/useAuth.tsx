import { useState, useEffect, createContext, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  devSignIn: (email: string) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simplified mock User for demo mode
const createMockUser = (email = "demo@bengaluru-homes.com"): User => ({
  id: "demo-user-id",
  email: email,
  created_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: { full_name: "Demo User" },
  aud: "authenticated",
  role: "authenticated",
} as User);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing dev session
    const devUser = localStorage.getItem("dev_user");
    if (devUser) {
      try {
        setUser(JSON.parse(devUser));
      } catch (e) {
        localStorage.removeItem("dev_user");
        setUser(createMockUser());
      }
    } else {
      // Use demo mode by default
      const mockUser = createMockUser();
      setUser(mockUser);
      localStorage.setItem("dev_user", JSON.stringify(mockUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Mock sign up - just create a local user
    try {
      const mockUser = createMockUser(email);
      localStorage.setItem("dev_user", JSON.stringify(mockUser));
      setUser(mockUser);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    // Mock sign in - just create a local user
    try {
      const mockUser = createMockUser(email);
      localStorage.setItem("dev_user", JSON.stringify(mockUser));
      setUser(mockUser);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const devSignIn = (email: string) => {
    const mockUser = createMockUser(email || "dev@example.com");
    localStorage.setItem("dev_user", JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const signOut = async () => {
    localStorage.removeItem("dev_user");
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, devSignIn, signOut }}>
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
