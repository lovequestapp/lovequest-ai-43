
import { hashPassword, isTokenValid, generateAuthToken } from '@/utils/security';
import { User } from '@/context/UserContext';

interface AuthCredentials {
  email: string;
  password: string;
}

// Mock database of users for demo purposes
// In a real app, this would be stored on a secure backend
const DEMO_USERS: Record<string, { passwordHash: string; userData: User }> = {
  // Default admin account
  "hunainm.qureshi@gmail.com": {
    passwordHash: hashPassword("LoveQuest14"),
    userData: {
      id: "admin-user-1",
      name: "Admin User",
      age: 30,
      email: "hunainm.qureshi@gmail.com",
      photos: [],
      bio: "System Administrator",
      location: "System",
      interests: ["Administration", "System Management"],
      gender: "male",
      interestedIn: ["female"],
      popularityPoints: 0,
      premiumStatus: 'vip',
      giftInventory: { rose: 10, heart: 10, teddy: 10 },
      receivedGifts: { rose: 0, heart: 0, teddy: 0 },
      compatibilityScore: 0,
      personalityTraits: ["organized", "analytical", "detail-oriented"],
      role: "admin" // This is important to access admin dashboard
    }
  }
};

export const authService = {
  /**
   * Register a new user account
   */
  register: async (credentials: AuthCredentials, userData: Partial<User>): Promise<User | null> => {
    try {
      // Check if user already exists
      if (DEMO_USERS[credentials.email]) {
        throw new Error('User already exists');
      }

      // Create user ID and basic user object
      const userId = `user-${Date.now()}`;
      const passwordHash = hashPassword(credentials.password);
      
      // Create the user object with provided data
      const user: User = {
        id: userId,
        name: userData.name || 'New User',
        age: userData.age || 25,
        email: credentials.email,
        photos: userData.photos || [],
        bio: userData.bio || '',
        location: userData.location || '',
        interests: userData.interests || [],
        gender: userData.gender as 'male' | 'female' | 'non-binary' || 'non-binary',
        interestedIn: userData.interestedIn || [],
        popularityPoints: 0,
        premiumStatus: 'basic',
        giftInventory: { rose: 0, heart: 0, teddy: 0 },
        receivedGifts: { rose: 0, heart: 0, teddy: 0 },
        compatibilityScore: 0,
        personalityTraits: [],
        role: userData.role || 'subscriber', // Default to subscriber role
      };

      // Save user to mock database
      DEMO_USERS[credentials.email] = {
        passwordHash,
        userData: user
      };

      // Store auth token in localStorage
      const token = generateAuthToken(userId);
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  },

  /**
   * Log in a user with email and password
   */
  login: async (credentials: AuthCredentials): Promise<User | null> => {
    try {
      const userRecord = DEMO_USERS[credentials.email];
      
      // For demo purposes, if the user doesn't exist in our mock DB,
      // we'll check if there's a saved user in localStorage
      if (!userRecord) {
        const savedUser = localStorage.getItem('currentUser');
        const savedEmail = savedUser ? JSON.parse(savedUser).email : null;
        
        if (savedEmail === credentials.email) {
          // Allow login with any password for demo purposes
          // In a real app, we would validate the password
          const user = JSON.parse(savedUser);
          const token = generateAuthToken(user.id);
          localStorage.setItem('authToken', token);
          return user;
        }
        
        throw new Error('Invalid email or password');
      }

      // Check password
      const passwordHash = hashPassword(credentials.password);
      if (passwordHash !== userRecord.passwordHash) {
        throw new Error('Invalid email or password');
      }

      // Generate and store token
      const token = generateAuthToken(userRecord.userData.id);
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(userRecord.userData));
      
      return userRecord.userData;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },

  /**
   * Log out the current user
   */
  logout: (): void => {
    localStorage.removeItem('authToken');
    // We don't remove currentUser data for demo purposes
    // so we can "remember" the user for next login
  },

  /**
   * Check if user is logged in
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('authToken');
    return token !== null && isTokenValid(token);
  },

  /**
   * Get the current user from storage
   */
  getCurrentUser: (): User | null => {
    try {
      if (!authService.isAuthenticated()) return null;
      
      const userData = localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * Update user data and persist to storage
   */
  updateUserData: (userData: Partial<User>): User | null => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) return null;
      
      const updatedUser = { ...currentUser, ...userData };
      
      // Update in mock DB if exists
      if (DEMO_USERS[currentUser.email]) {
        DEMO_USERS[currentUser.email].userData = updatedUser;
      }
      
      // Update in localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user data:', error);
      return null;
    }
  }
};
