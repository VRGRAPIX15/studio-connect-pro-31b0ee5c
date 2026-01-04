import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'owner@varnika.studio',
    name: 'Varnika Owner',
    phone: '+91 9876543210',
    role: 'owner',
    createdAt: new Date('2024-01-01'),
    isActive: true,
  },
  {
    id: '2',
    email: 'manager@varnika.studio',
    name: 'Studio Manager',
    phone: '+91 9876543211',
    role: 'manager',
    createdAt: new Date('2024-01-15'),
    isActive: true,
  },
  {
    id: '3',
    email: 'staff@varnika.studio',
    name: 'Staff Member',
    phone: '+91 9876543212',
    role: 'staff',
    createdAt: new Date('2024-02-01'),
    isActive: true,
  },
];

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
    // Demo login - in production this would call your backend
    const user = DEMO_USERS.find(u => u.email === email);
    
    if (user && password === 'demo123') {
      const loggedInUser = { ...user, lastLogin: new Date() };
      localStorage.setItem('crm_user', JSON.stringify(loggedInUser));
      setAuthState({
        user: loggedInUser,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem('crm_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
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
