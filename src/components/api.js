// api.js - Fixed version that doesn't try to read the response stream twice

const API_URL = 'https://high-goose-81-mh33xaffavj3.deno.dev'; // Change this to your production backend URL

// Helper for making authenticated requests
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // Add auth token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers,
    credentials: 'include' // Required for CORS
  };
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Handle 401 Unauthorized - could be expired token
    if (response.status === 401) {
      // Clear the invalid token
      localStorage.removeItem('authToken');
      // Optionally redirect to login
      window.location.href = '/login';
      throw new Error('Your session has expired. Please log in again.');
    }
    
    // Handle other non-2xx responses
    if (!response.ok) {
      // Read the response once and store the result
      let errorMessage;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.error || 'An error occurred';
      } else {
        errorMessage = await response.text() || 'An error occurred';
      }
      
      throw new Error(errorMessage);
    }
    
    // Success response - only try to parse JSON if we have a response body
    if (response.status !== 204) { // 204 No Content
      // Try to parse as JSON, fall back to text if that fails
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    }
    
    return null; // Empty response body (e.g., for 204 No Content)
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Auth-related API methods
export const authAPI = {
  login: async (email, password) => {
    return apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  signup: async (username, email, password) => {
    return apiRequest('/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    });
  },
  
  verifyOTP: async (otp, id) => {
    return apiRequest('/verify', {
      method: 'POST',
      body: JSON.stringify({ otp, id })
    });
  },
  
  logout: async () => {
    const result = await apiRequest('/logout', { method: 'POST' });
    // Clear local storage regardless of response
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    return result;
  },
  
  getUserData: async () => {
    return apiRequest('/getUser', { method: 'GET' });
  }
};

// File API methods
export const fileAPI = {
  // Upload a file to IPFS and save the reference in the backend
  uploadFile: async (file) => {
    // First upload to IPFS via Pinata
    const formData = new FormData();
    formData.append("file", file);
    
    const PINATA_API_URL = "https://api.pinata.cloud";
    const JWT = import.meta.env.VITE_PINATA_JWT;
    
    try {
      // Step 1: Upload to Pinata
      const pinataResponse = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
        body: formData,
      });
      
      if (!pinataResponse.ok) {
        throw new Error(`Upload to IPFS failed with status: ${pinataResponse.status}`);
      }
      
      const pinataData = await pinataResponse.json();
      
      // Step 2: Save file reference in our backend
      return await apiRequest('/files', {
        method: 'POST',
        body: JSON.stringify({
          url: `ipfs://${pinataData.IpfsHash}`,
          fileuuid: crypto.randomUUID(), // Generate a UUID for the file
          expirationTime: 0, // Default: no expiration
          ipfsHash: pinataData.IpfsHash,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        })
      });
    } catch (error) {
      console.error("File upload error:", error);
      throw error;
    }
  },
  
  // Get all files for the current user
  getUserFiles: async () => {
    return apiRequest('/files/user', {
      method: 'GET'
    });
  },
  
  // Delete a file
  deleteFile: async (fileId) => {
    return apiRequest(`/files/${fileId}`, {
      method: 'DELETE'
    });
  },
  
  // Generate a share link with expiration
  generateShareLink: async (fileId, expirationHours) => {
    return apiRequest('/files/share', {
      method: 'POST',
      body: JSON.stringify({
        fileId,
        expirationHours
      })
    });
  },
  
  // Get file by share ID (public endpoint, no auth required)
  getSharedFile: async (shareId) => {
    // This would be a public endpoint, so we use a modified version of apiRequest
    // that doesn't add auth headers
    const API_URL = 'https://high-goose-81-mh33xaffavj3.deno.dev';
    
    try {
      const response = await fetch(`${API_URL}/files/shared/${shareId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('This shared file has expired or does not exist');
        }
        throw new Error(`Failed to fetch shared file: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching shared file:", error);
      throw error;
    }
  }
};

export default {
  auth: authAPI,
  file: fileAPI
};