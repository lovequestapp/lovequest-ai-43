
import supabaseAuthService from './supabaseAuthService';
import { AuthService } from './types';

// Export the auth service instance as default
export default supabaseAuthService as AuthService;

// Re-export types for convenience
export * from './types';
