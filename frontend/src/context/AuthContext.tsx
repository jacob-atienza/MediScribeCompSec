
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

// This is a simplified auth context that will be replaced with Supabase Auth
// when the integration is ready

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is stored in localStorage (for demo purposes)
    const storedUser = localStorage.getItem('medicalUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Sign in function (mock for now, will integrate with Supabase)
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      // This is where Supabase auth would go
      // For now, we'll mock it
      const mockUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
      };
      
      localStorage.setItem('medicalUser', JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: "Login successful",
        description: "Welcome back to Patient Records Assistant",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive"
      });
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign up function (mock for now, will integrate with Supabase)
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      // This is where Supabase auth would go
      const mockUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        name,
      };
      
      localStorage.setItem('medicalUser', JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: "Account created",
        description: "Welcome to Patient Records Assistant",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: "Please try again with a different email",
        variant: "destructive"
      });
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      // This is where Supabase auth would go
      localStorage.removeItem('medicalUser');
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
