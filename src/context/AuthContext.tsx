import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// JWT token management utilities
const TOKEN_KEY = 'authToken';
const USER_KEY = 'user';

const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token from localStorage:', error);
    return null;
  }
};

const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error setting token in localStorage:', error);
  }
};

const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token from localStorage:', error);
  }
};

const getUser = (): User | null => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    removeToken();
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

const setUser = (user: User): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error setting user in localStorage:', error);
  }
};

const removeUser = (): void => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing user from localStorage:', error);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Track state changes for debugging
  useEffect(() => {
    console.log('AuthContext - State changed:', { 
      isAuthenticated: !!token && !!user,
      userName: user?.name,
      userEmail: user?.email,
      hasToken: !!token,
      hasUser: !!user,
      loading 
    });
  }, [user, token, loading]);

  // Restore session on app load
  useEffect(() => {
    const restoreSession = () => {
      try {
        const storedToken = getToken();
        const storedUser = getUser();

        // Check if token is a mock token and exclude it
        if (storedToken && storedToken.startsWith('mock-')) {
          console.log('Found mock token, clearing and skipping session restore');
          removeToken();
          removeUser();
          setLoading(false);
          return;
        }

        if (storedToken && storedUser) {
          setTokenState(storedToken);
          setUserState(storedUser);
          console.log('Session restored for user:', storedUser.email);
        } else {
          console.log('No valid session found');
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        // Clear corrupted data
        removeToken();
        removeUser();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      
      let userData: User;
      let jwtToken: string;

      try {
        // Try backend API first
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Backend response:', data);
          
          // Validate response data
          if (!data.success || !data.data || !data.data.user || !data.data.token) {
            throw new Error('Invalid response from backend');
          }
          
          userData = data.data.user;
          jwtToken = data.data.token;
          console.log('Backend login successful, user:', userData.name);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Backend login failed');
        }
      } catch (backendError: any) {
        console.error('Backend login failed:', backendError);
        
        // Only fallback to mock if it's a network error, not authentication errors
        if (backendError.message.includes('Failed to fetch') || backendError.message.includes('Network')) {
          console.warn('Backend unavailable, using mock data:', backendError);
          
          // Fallback to mock data
          const mockUserData = {
            id: "mock-" + Date.now(),
            name: email.split('@')[0] || "Test User",
            email: email,
            role: "student" as const,
            institution: "Test Institution",
            preferences: {
              subjects: [],
              languages: ["English"],
            },
            progress: {
              savedNotes: 0,
              completedTopics: 0,
            },
          };
          
          userData = mockUserData;
          jwtToken = 'mock-jwt-token-' + Date.now();
          console.log('Mock login successful, user:', userData.name);
        } else {
          // For authentication errors, don't fallback to mock
          throw backendError;
        }
      }

      // Final validation before storing
      if (!userData || !userData.name || !userData.email) {
        throw new Error('Invalid user data structure');
      }

      // Store JWT token and user data in localStorage and React state (only if not mock)
      if (!jwtToken.startsWith('mock-')) {
        setToken(jwtToken);
        setUser(userData);
      }
      setTokenState(jwtToken);
      setUserState(userData);

      console.log('Login completed, session stored');
      console.log('Auth state after login:', { 
        token: jwtToken, 
        user: userData.name, 
        isAuthenticated: !!jwtToken && !!userData 
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    try {
      // Clear all auth data
      removeToken();
      removeUser();
      setTokenState(null);
      setUserState(null);

      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAuthenticated = !!token && !!user;

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  // Debug token state before providing to consumers
  console.log('AuthContext - Providing to consumers:', {
    token: token ? 'exists' : 'missing',
    tokenLength: token?.length || 0,
    tokenStart: token?.substring(0, 20) + '...',
    isAuthenticated,
    userEmail: user?.email
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
