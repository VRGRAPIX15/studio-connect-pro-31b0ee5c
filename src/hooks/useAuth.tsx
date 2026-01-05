import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, AuthState } from '@/types';
import { API_CONFIG } from '@/config/api';
import { toast } from 'sonner';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('crm_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        // Convert dates
        if (user.createdAt) user.createdAt = new Date(user.createdAt);
        if (user.lastLogin) user.lastLogin = new Date(user.lastLogin);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem('crm_user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          action: 'login',
          email,
          password,
        }),
      });

      const result = await response.json();

      if (result.success && result.user) {
        const user: User = {
          id: result.user.Id,
          email: result.user.Email,
          name: result.user.Name,
          phone: result.user.Phone || '',
          role: result.user.Role as 'owner' | 'manager' | 'staff',
          avatar: result.user.Avatar || '',
          createdAt: new Date(result.user.CreatedAt),
          lastLogin: new Date(),
          isActive: result.user.IsActive,
        };

        localStorage.setItem('crm_user', JSON.stringify(user));
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        toast.success(`Welcome back, ${user.name}!`);
        return true;
      } else {
        toast.error(result.error || 'Invalid email or password');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Unable to connect to server. Please try again.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('crm_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast.success('Logged out successfully');
  };

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      localStorage.setItem('crm_user', JSON.stringify(updatedUser));
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
