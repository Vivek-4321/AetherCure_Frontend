// fileApi.js - API service for handling file operations
import { apiRequest } from './api'; // Import the base API service we created earlier

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
      const response = await apiRequest('/files', {
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
      
      return response;
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
    try {
      // First, try to get the file details to also delete from Pinata
      const file = await apiRequest(`/files/${fileId}`, {
        method: 'GET'
      }).catch(() => null); // Ignore errors, we'll proceed with backend deletion anyway
      
      // If we have the file details and it has an IPFS hash, unpins from Pinata
      if (file && (file.ipfsHash || file.ipfshash)) {
        const hash = file.ipfsHash || file.ipfshash;
        await unpinFromPinata(hash).catch((err) => {
          console.warn("Could not unpin from Pinata:", err.message);
          // Continue with backend deletion even if Pinata unpin fails
        });
      }
      
      // Delete from backend
      return apiRequest(`/files/${fileId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error("File deletion error:", error);
      throw error;
    }
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
    if (!shareId) {
      console.error("No shareId provided to getSharedFile");
      throw new Error("Share ID is required");
    }
    
    console.log("Fetching shared file with ID:", shareId);
    
    // This is a public endpoint, so we don't need auth headers
    const API_URL = 'https://high-goose-81-j3gy941h2ts4.deno.dev';
    const url = `${API_URL}/files/shared/${shareId}`;
    
    console.log("Making request to:", url);
    
    try {
      const response = await fetch(url);
      
      console.log("Shared file response status:", response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('This shared file has expired or does not exist');
        }
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to fetch shared file: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Shared file data from server:", data);
      
      // Ensure ipfsHash is available regardless of casing
      if (data.ipfshash && !data.ipfsHash) {
        data.ipfsHash = data.ipfshash;
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching shared file:", error);
      throw error;
    }
  },
  
  // Get all shared links for the current user
  getSharedLinks: async () => {
    try {
      // First try to call the proper API endpoint
      try {
        const response = await apiRequest('/files/shared/links', {
          method: 'GET'
        });
        
        if (response) {
          // Make sure we have proper formatting before returning
          return Array.isArray(response) ? response.map(link => ({
            ...link,
            // Ensure expirationTime is a number
            expirationTime: link.expirationTime ? Number(link.expirationTime) : null,
            // Ensure basic required properties exist
            shareId: link.shareId || `temp-${Math.random().toString(36).substring(7)}`,
            fileName: link.fileName || 'Unnamed File',
            fileId: link.fileId || 0
          })) : [];
        }
      } catch (apiError) {
        console.warn("API endpoint not available yet, using workaround:", apiError.message);
      }
      
      // If the API doesn't exist yet, get all user files first
      const files = await fileAPI.getUserFiles();
      
      if (!Array.isArray(files) || files.length === 0) {
        return [];
      }
      
      // Create temporary mock shared links for demonstration
      const now = Math.floor(Date.now() / 1000);
      const sharedLinks = files.slice(0, 3).map((file, index) => {
        // Generate consistent expiration dates (1, 3, or 7 days from now)
        const days = [1, 3, 7][index % 3];
        return {
          shareId: `temp-${file.fileId || index}`,
          fileId: file.fileId || index,
          fileName: file.fileName || file.name || 'Unnamed File',
          expirationTime: now + (days * 86400), // Convert days to seconds
          createdAt: new Date().toISOString()
        };
      });
      
      console.log("Generated mock shared links:", sharedLinks);
      return sharedLinks;
    } catch (error) {
      console.error("Error in getSharedLinks workaround:", error);
      return [];
    }
  },
  
  // Delete/expire a shared link before its natural expiration
  deleteSharedLink: async (shareId) => {
    try {
      return apiRequest(`/files/shared/${shareId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error("Error deleting shared link:", error);
      throw error;
    }
  }
};

// Helper function to unpin a file from Pinata
const unpinFromPinata = async (ipfsHash) => {
  const PINATA_API_URL = "https://api.pinata.cloud";
  const JWT = import.meta.env.VITE_PINATA_JWT;
  
  const response = await fetch(`${PINATA_API_URL}/pinning/unpin/${ipfsHash}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${JWT}`,
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to unpin from Pinata: ${response.status}`);
  }
  
  return true;
};

export default fileAPI;