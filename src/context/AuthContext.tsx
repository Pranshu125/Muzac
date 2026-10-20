import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  login: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { username: string; email: string; password: string; displayName?: string; avatar?: string }) => Promise<{ success: boolean; error?: string }>;
  continueAsGuest: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const DEFAULT_GUEST_USER: UserProfile = {
  id: 'usr_guest',
  username: 'guest_listener',
  displayName: 'Guest Explorer',
  email: 'guest@muzac.app',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  tier: 'Free Hi-Fi',
  createdAt: new Date().toISOString(),
  listeningHours: 12,
  favoriteGenres: ['Synthwave', 'Indie', 'Lo-Fi Chill']
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('muzac_user');
      if (saved) return JSON.parse(saved);
      return DEFAULT_GUEST_USER;
    } catch {
      return DEFAULT_GUEST_USER;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('muzac_token');
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Sync session with local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('muzac_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('muzac_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('muzac_token', token);
    } else {
      localStorage.removeItem('muzac_token');
    }
  }, [token]);

  // Attempt to revalidate session on start
  useEffect(() => {
    if (token && user && user.id !== 'usr_guest') {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setUser(data.user);
          }
        })
        .catch(() => {
          // Offline or network error - retain cached user
        });
    }
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
      setUser(data.user);
      setToken(data.token);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      // Offline fallback for demo user
      if (usernameOrEmail.toLowerCase().includes('listener') && password === 'password123') {
        const demoUser: UserProfile = {
          id: 'usr_demo_1',
          username: 'muzac_listener',
          displayName: 'Hi-Fi Explorer',
          email: 'listener@muzac.app',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          tier: 'Master Studio',
          createdAt: '2026-01-15T00:00:00.000Z',
          listeningHours: 148,
          favoriteGenres: ['Synthwave', 'Indie Alternative', 'Hi-Res Jazz']
        };
        setUser(demoUser);
        setToken(`mzc_demo_${Date.now()}`);
        setIsAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, error: err.message || 'Network error occurred during login' };
    }
  };

  const register = async (data: { username: string; email: string; password: string; displayName?: string; avatar?: string }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, error: resData.error || 'Failed to create account' };
      }
      setUser(resData.user);
      setToken(resData.token);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      // Local fallback if API is unreachable
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        username: data.username,
        displayName: data.displayName || data.username,
        email: data.email,
        avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        tier: 'Master Studio',
        createdAt: new Date().toISOString(),
        listeningHours: 0,
        favoriteGenres: ['Pop', 'R&B']
      };
      setUser(newUser);
      setToken(`mzc_local_${Date.now()}`);
      setIsAuthModalOpen(false);
      return { success: true };
    }
  };

  const continueAsGuest = () => {
    setUser(DEFAULT_GUEST_USER);
    setToken(null);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(DEFAULT_GUEST_USER);
    setToken(null);
    setIsProfileModalOpen(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      return updated;
    });
  };

  const isAuthenticated = Boolean(user && user.id !== 'usr_guest');
  const isGuest = !isAuthenticated;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isGuest,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        login,
        register,
        continueAsGuest,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
