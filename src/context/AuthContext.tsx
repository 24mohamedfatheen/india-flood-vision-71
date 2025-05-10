
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define user types
type UserType = 'admin' | 'public' | null;

// User interface
interface User {
  username: string;
  userType: UserType;
}

// Admin credentials
const ADMIN_USERNAME = 'demonzhack';
const ADMIN_PASSWORD = '12345';

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userType: UserType;
  login: (username: string, password: string) => Promise<boolean>;
  signUp: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const USER_STORAGE_KEY = 'floodvision_user';
const USERS_DB_KEY = 'floodvision_users_db';

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>(null);
  const navigate = useNavigate();

  // Load user from localStorage on initial mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setUserType(parsedUser.userType);
    }
  }, []);

  // Get users from local storage
  const getUsersFromStorage = () => {
    const usersString = localStorage.getItem(USERS_DB_KEY);
    if (usersString) {
      return JSON.parse(usersString);
    }
    return {};
  };

  // Save users to local storage
  const saveUsersToStorage = (users: Record<string, string>) => {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  };

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    // Check for admin login
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        username: ADMIN_USERNAME,
        userType: 'admin',
      };
      
      setUser(adminUser);
      setIsAuthenticated(true);
      setUserType('admin');
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(adminUser));
      navigate('/admin');
      return true;
    }
    
    // Check for public user login
    const users = getUsersFromStorage();
    if (users[username] && users[username] === password) {
      const publicUser: User = {
        username,
        userType: 'public',
      };
      
      setUser(publicUser);
      setIsAuthenticated(true);
      setUserType('public');
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(publicUser));
      navigate('/');
      return true;
    }
    
    return false;
  };

  // Sign up function
  const signUp = async (username: string, password: string): Promise<boolean> => {
    // Don't allow signing up as admin
    if (username === ADMIN_USERNAME) {
      return false;
    }
    
    const users = getUsersFromStorage();
    
    // Check if username already exists
    if (users[username]) {
      return false;
    }
    
    // Add new user
    users[username] = password;
    saveUsersToStorage(users);
    return true;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setUserType(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        userType,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
