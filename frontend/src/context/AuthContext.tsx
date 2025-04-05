import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";

// This is a simplified auth context that will be replaced with Supabase Auth
// when the integration is ready

type User = {
  id: string;
  email: string;
  role: "doctor" | "patient";
  name?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    role: "doctor" | "patient"
  ) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("medicalUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await api.auth.login(email, password);
      const userData = response.data[0];

      localStorage.setItem("medicalUser", JSON.stringify(userData));
      setUser(userData);

      toast({
        title: "Login successful",
        description: "Welcome back to Patient Records Assistant",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    role: "doctor" | "patient"
  ) => {
    try {
      setLoading(true);
      const response = await api.auth.register(email, password, role);
      const userData = response.data[0];

      localStorage.setItem("medicalUser", JSON.stringify(userData));
      setUser(userData);

      toast({
        title: "Registration successful",
        description: "Welcome to Patient Records Assistant",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again",
        variant: "destructive",
      });
      console.error("Sign up error:", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem("medicalUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
