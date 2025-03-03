// src/utils/sessionHandler.js
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token to validate
 * @returns {boolean} - True if token is expired or invalid, false otherwise
 */
export function isTokenExpired(token) {
  if (!token) return true;
  
  try {
    // JWT tokens are in three parts, split by dots
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return true;
    
    // The second part contains the payload
    const payload = JSON.parse(atob(tokenParts[1]));
    
    // Check if token has expiration time
    if (!payload.exp) return false;
    
    // Compare expiration timestamp with current time
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error parsing token:', error);
    return true; // Consider token expired if it can't be parsed
  }
}

/**
 * Check if the user is authenticated with a valid token
 * @returns {boolean} - True if user has a valid auth token
 */
export function isAuthenticated() {
  const token = localStorage.getItem('authToken');
  return token && !isTokenExpired(token);
}

/**
 * Handle session expiration
 * @param {Object} router - Vue Router instance 
 * @param {boolean} showToast - Whether to show a toast notification
 */
export function handleExpiredSession(router, showToast = true) {
  // Clear localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  
  if (showToast) {
    toast.info('Your session has expired. Please log in again.', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000,
      theme: 'colored'
    });
  }
  
  // Redirect to login page
  router.push('/login');
}

/**
 * Vue composable for session handling
 * @param {number} checkInterval - How often to check token validity (ms)
 * @returns {Object} Session handling methods
 */
export function useSessionHandler(checkInterval = 60000) {
  const router = useRouter();
  let intervalId = null;
  
  // Set up interval to check token periodically
  const startSessionMonitor = () => {
    // Initial validation
    validateSession();
    
    // Set interval for periodic checks
    intervalId = setInterval(validateSession, checkInterval);
  };
  
  // Stop monitoring
  const stopSessionMonitor = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
  
  // Validate current session
  const validateSession = () => {
    if (!isAuthenticated()) {
      handleExpiredSession(router);
      return false;
    }
    return true;
  };
  
  // Authenticated fetch that handles 401 responses
  const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      handleExpiredSession(router);
      throw new Error('No authentication token found');
    }
    
    // Add token to headers
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
    
    try {
      const response = await fetch(url, {
        ...options,
        headers
      });
      
      // Handle unauthorized response
      if (response.status === 401) {
        handleExpiredSession(router);
        throw new Error('Session expired');
      }
      
      return response;
    } catch (error) {
      if (error.message === 'Session expired') {
        throw error;
      }
      
      // For network errors, check if token is still valid
      validateSession();
      throw error;
    }
  };
  
  return {
    validateSession,
    authenticatedFetch,
    startSessionMonitor,
    stopSessionMonitor
  };
}