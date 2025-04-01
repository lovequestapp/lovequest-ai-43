
/**
 * Validates password strength based on multiple criteria
 * @param password The password to validate
 * @returns Object with isValid boolean and message string
 */
export const validatePasswordStrength = (password: string): { isValid: boolean; message: string } => {
  // Check for minimum length
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long'
    };
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter'
    };
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number'
    };
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character'
    };
  }

  return {
    isValid: true,
    message: 'Password strength: Strong'
  };
};

/**
 * Creates a salted hash of a password (mock implementation for client-side)
 * In a real app, this would be done server-side
 * @param password The password to hash
 */
export const hashPassword = async (password: string): Promise<string> => {
  // In a real application, never hash passwords client-side
  // This is just a mock implementation
  
  // Create a random salt
  const salt = Math.random().toString(36).substring(2, 15);
  
  // In a real app, you would use a proper crypto library
  // and this would be done server-side
  const hash = `${salt}:${password}`;
  
  return hash;
};

/**
 * Sanitizes a string to prevent XSS attacks
 * @param input The string to sanitize
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
