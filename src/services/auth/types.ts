
import { User } from '@/types/user';

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  isProfileIncomplete?: boolean;
  requiresEmailConfirmation?: boolean;
}

export interface AuthService {
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, name: string, planType?: string) => Promise<AuthResult>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  getCurrentUser: () => Promise<User | null>;
  getSession: () => Promise<{ session: any | null; error?: string }>;
  refreshSession: () => Promise<{ success: boolean; error?: string }>;
  isSessionValid: () => Promise<boolean>;
  checkUserRoleAndSubscription: () => Promise<{ 
    isLoggedIn: boolean; 
    role: string | null; 
    subscription: string | null 
  }>;
}
