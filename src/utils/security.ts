
// Basic security utilities for password handling and validation

/**
 * Hash a password (simulated for frontend demo)
 * Note: In a real application, this would be done on the backend
 */
export const hashPassword = (password: string): string => {
  // This is a simplified frontend hash for demo purposes
  // In production, use bcrypt or similar on a secure backend
  return btoa(password + "salt") + ".simulated-hash";
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  message: string;
} => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long"
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    return {
      isValid: false,
      message: "Password must include uppercase, lowercase, number, and special character"
    };
  }

  return {
    isValid: true,
    message: "Password is strong"
  };
};

/**
 * Simple token handling for authentication
 */
export const generateAuthToken = (userId: string): string => {
  const payload = {
    userId,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days expiration
  };
  // Again, this is a frontend simulation
  return btoa(JSON.stringify(payload));
};

export const getTokenExpirationDate = (token: string): Date | null => {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp) {
      return new Date(payload.exp);
    }
  } catch (e) {
    console.error("Invalid token format", e);
  }
  return null;
};

export const isTokenValid = (token: string): boolean => {
  const expirationDate = getTokenExpirationDate(token);
  return expirationDate !== null && expirationDate > new Date();
};
