// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

// Get auth token
const getAuthToken = () => {
  return localStorage.getItem('koltech-auth-storage')
    ? JSON.parse(localStorage.getItem('koltech-auth-storage')!).state?.token
    : null;
};

// API request wrapper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  // Handle FormData separately (don't set Content-Type for file uploads)
  const isFormData = options.body instanceof FormData;
  
  const config: RequestInit = {
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  console.log('📤 API Request:', {
    endpoint: `${API_BASE_URL}${endpoint}`,
    method: config.method || 'GET',
    headers: config.headers,
    bodyType: isFormData ? 'FormData' : typeof options.body,
    bodyPreview: isFormData ? '[FormData]' : options.body?.toString().substring(0, 200)
  });

  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...config,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('📥 API Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      
      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { message: errorText || 'API request failed' };
      }
      
      throw new Error(error.message || 'API request failed');
    }

    const result = await response.json();
    console.log('✅ API Success:', result);
    return result;
  } catch (fetchError: any) {
    if (fetchError.name === 'AbortError') {
      console.error('❌ API Request Timeout');
      throw new Error('Request timed out. Please check your connection.');
    }
    console.error('❌ API Request Failed:', fetchError);
    throw fetchError;
  }
};

// Auth API
export const authAPI = {
  // Login
  login: (loginData: {
    login: string;
    password?: string;
    codePhrase?: string;
    codePhraseIndex?: number;
  }) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    }),

  // Register
  register: (userData: {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    role?: string;
  }) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  // Anonymous register
  registerAnonymous: (userData: {
    firstName: string;
    lastName: string;
    password: string;
    role?: string;
  }) =>
    apiRequest('/auth/register-anonymous', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  // Verify email
  verifyEmail: (verificationData: { email: string; code: string }) =>
    apiRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(verificationData),
    }),

  // Forgot password
  forgotPassword: (email: string) =>
    apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  // Reset password
  resetPassword: (resetData: {
    email: string;
    code: string;
    newPassword: string;
  }) =>
    apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData),
    }),

  // Get current user
  getMe: () => apiRequest('/auth/me'),

  // Update password
  updatePassword: (passwordData: {
    currentPassword?: string;
    newPassword: string;
  }) =>
    apiRequest('/auth/update-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    }),

  // Logout
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
};

// Wall API
export const wallApi = {
  // Get all walls with filtering
  getWalls: (params?: {
    category?: string;
    tags?: string[];
    search?: string;
    limit?: number;
    page?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }
    return apiRequest(`/walls?${queryParams.toString()}`);
  },

  // Create new wall
  createWall: (wallData: any) => 
    apiRequest('/walls', {
      method: 'POST',
      body: JSON.stringify(wallData),
    }),

  // Get wall details
  getWall: (wallId: string) => apiRequest(`/walls/${wallId}`),

  // Join wall
  joinWall: (wallId: string) => 
    apiRequest(`/walls/${wallId}/join`, { method: 'POST' }),

  // Leave wall
  leaveWall: (wallId: string) => 
    apiRequest(`/walls/${wallId}/leave`, { method: 'POST' }),

  // Get user's walls
  getMyWalls: (type?: 'member' | 'created' | 'admin') => {
    const params = type ? `?type=${type}` : '';
    return apiRequest(`/walls/my-walls${params}`);
  }
};

// Message API
export const messageApi = {
  // Get wall messages
  getWallMessages: (wallId: string, params?: { limit?: number; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return apiRequest(`/messages/wall/${wallId}?${queryParams.toString()}`);
  },

  // Create message
  createMessage: (messageData: {
    content: string;
    wallId: string;
    attachments?: any[];
    tags?: string[];
  }) => 
    apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    }),

  // Like/unlike message (legacy)
  toggleLike: (messageId: string) => 
    apiRequest(`/messages/${messageId}/like`, { method: 'POST' }),

  // Add/remove reaction to message
  toggleReaction: (messageId: string, emoji: string) =>
    apiRequest(`/messages/${messageId}/react`, {
      method: 'POST',
      body: JSON.stringify({ emoji }),
    }),

  // Add comment
  addComment: (messageId: string, content: string) => 
    apiRequest(`/messages/${messageId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  // Get comments
  getComments: (messageId: string) =>
    apiRequest(`/messages/${messageId}/comments`),

  // Update message
  updateMessage: (messageId: string, content: string, tags?: string[]) =>
    apiRequest(`/messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify({ content, tags }),
    }),

  // Delete message
  deleteMessage: (messageId: string) =>
    apiRequest(`/messages/${messageId}`, { method: 'DELETE' }),

  // Pin/unpin message
  togglePin: (messageId: string) =>
    apiRequest(`/messages/${messageId}/pin`, { method: 'POST' }),

  // Report message
  reportMessage: (messageId: string, reason: string) =>
    apiRequest(`/messages/${messageId}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
};

// Chat API
export const chatApi = {
  // Get user's chats
  getChats: (type?: 'private' | 'group') => {
    const params = type ? `?type=${type}` : '';
    return apiRequest(`/chats${params}`);
  },

  // Create private chat
  createPrivateChat: (recipientId: string) => 
    apiRequest('/chats/private', {
      method: 'POST',
      body: JSON.stringify({ recipientId }),
    }),

  // Create group chat
  createGroupChat: (chatData: {
    name: string;
    description?: string;
    participantIds: string[];
  }) => 
    apiRequest('/chats/group', {
      method: 'POST',
      body: JSON.stringify(chatData),
    }),

  // Get chat messages
  getChatMessages: (chatId: string, params?: { limit?: number; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return apiRequest(`/chats/${chatId}/messages?${queryParams.toString()}`);
  },

  // Send message
  sendMessage: (chatId: string, content: string, attachments?: any[]) => 
    apiRequest(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, attachments }),
    })
};

// Contact API
export const contactApi = {
  // Get contacts
  getContacts: (status?: 'accepted' | 'pending' | 'sent') => {
    const params = status ? `?status=${status}` : '';
    return apiRequest(`/contacts${params}`);
  },

  // Send contact request
  sendRequest: (recipientId: string, note?: string) => 
    apiRequest('/contacts/request', {
      method: 'POST',
      body: JSON.stringify({ recipientId, note }),
    }),

  // Respond to request
  respondToRequest: (requestId: string, action: 'accept' | 'decline' | 'block') => 
    apiRequest(`/contacts/${requestId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    }),

  // Search users
  searchUsers: (query: string, limit?: number) => {
    const params = new URLSearchParams({ query });
    if (limit) params.append('limit', limit.toString());
    return apiRequest(`/contacts/search?${params.toString()}`);
  }
};

// Kolophone API
export const kolophoneApi = {
  // Start call
  startCall: (callData: {
    type: 'wall' | 'private' | 'group';
    targetId: string;
    participants?: string[];
    settings?: any;
  }) => 
    apiRequest('/kolophone/start', {
      method: 'POST',
      body: JSON.stringify(callData),
    }),

  // Join call
  joinCall: (callId: string) => 
    apiRequest(`/kolophone/${callId}/join`, { method: 'POST' }),

  // Leave call
  leaveCall: (callId: string) => 
    apiRequest(`/kolophone/${callId}/leave`, { method: 'POST' }),

  // End call
  endCall: (callId: string) => 
    apiRequest(`/kolophone/${callId}/end`, { method: 'POST' }),

  // Get active calls
  getActiveCalls: () => apiRequest('/kolophone/active'),

  // Get call history
  getCallHistory: (limit?: number) => {
    const params = limit ? `?limit=${limit}` : '';
    return apiRequest(`/kolophone/history${params}`);
  }
};

// Notification API
export const notificationApi = {
  // Get notifications
  getNotifications: (params?: {
    type?: string;
    isRead?: boolean;
    limit?: number;
    page?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return apiRequest(`/notifications?${queryParams.toString()}`);
  },

  // Mark as read
  markAsRead: (notificationId: string) => 
    apiRequest(`/notifications/${notificationId}/read`, { method: 'PUT' }),

  // Mark all as read
  markAllAsRead: () => 
    apiRequest('/notifications/read-all', { method: 'PUT' }),

  // Get unread count
  getUnreadCount: () => apiRequest('/notifications/unread-count')
};

// File API
export const fileApi = {
  // Upload image
  uploadImage: (file: File, options?: { compress?: boolean; width?: number; height?: number }) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const queryParams = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return apiRequest(`/files/image?${queryParams.toString()}`, {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  },

  // Upload avatar
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return apiRequest('/files/avatar', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  },

  // Upload video
  uploadVideo: (file: File) => {
    const formData = new FormData();
    formData.append('video', file);
    
    return apiRequest('/files/video', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }
};

// Search API
export const searchApi = {
  // Global search
  globalSearch: (params: {
    q: string;
    category?: string;
    limit?: number;
    page?: number;
    includeEntities?: string;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    return apiRequest(`/search/global?${queryParams.toString()}`);
  },

  // Get suggestions
  getSuggestions: (query: string, limit?: number) => {
    const params = new URLSearchParams({ q: query });
    if (limit) params.append('limit', limit.toString());
    return apiRequest(`/search/suggestions?${params.toString()}`);
  },

  // Get trending
  getTrending: (limit?: number) => {
    const params = limit ? `?limit=${limit}` : '';
    return apiRequest(`/search/trending${params}`);
  }
};

// Tag API
export const tagApi = {
  // Get popular tags
  getPopular: (category?: string, limit?: number) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (limit) params.append('limit', limit.toString());
    return apiRequest(`/tags/popular?${params.toString()}`);
  },

  // Get trending tags
  getTrending: (limit?: number) => {
    const params = limit ? `?limit=${limit}` : '';
    return apiRequest(`/tags/trending${params}`);
  }
};

// Project API
export const projectApi = {
  // Get user's projects
  getMyProjects: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return apiRequest(`/projects/user/my?${queryParams.toString()}`);
  },

  // Get all projects (public)
  getProjects: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
    skills?: string[];
    search?: string;
    minBudget?: number;
    maxBudget?: number;
    urgency?: string;
    difficulty?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }
    return apiRequest(`/projects?${queryParams.toString()}`);
  },

  // Get single project
  getProject: (projectId: string) => apiRequest(`/projects/${projectId}`),

  // Create project
  createProject: (projectData: {
    title: string;
    description: string;
    category: string;
    type?: string;
    tags?: string[];
    skills?: string[];
    images?: string[];
    budget?: any;
    timeline?: any;
    funding?: any;
    visibility?: string;
    location?: string;
    urgency?: string;
    difficulty?: string;
  }) =>
    apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    }),

  // Update project
  updateProject: (projectId: string, projectData: any) =>
    apiRequest(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    }),

  // Delete project
  deleteProject: (projectId: string) =>
    apiRequest(`/projects/${projectId}`, { method: 'DELETE' }),

  // Like/unlike project
  toggleLike: (projectId: string) =>
    apiRequest(`/projects/${projectId}/like`, { method: 'POST' }),

  // Apply to project
  applyToProject: (projectId: string, applicationData: {
    proposal: string;
    budget: number;
    timeline: string;
  }) =>
    apiRequest(`/projects/${projectId}/apply`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    })
};

// User API
export const userAPI = {
  // Get user profile
  getProfile: () => apiRequest('/auth/me'),

  // Update profile
  updateProfile: (userData: any) =>
    apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  // Get user by ID
  getUser: (userId: string) => apiRequest(`/users/${userId}`),

  // Search users
  searchUsers: (query: string, limit?: number) => {
    const params = new URLSearchParams({ query });
    if (limit) params.append('limit', limit.toString());
    return apiRequest(`/users/search?${params.toString()}`);
  }
};

// Posts API (social media)
export const postsAPI = {
  // Get posts
  getPosts: (page: number = 1, limit: number = 10, filters?: any) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    
    return apiRequest(`/posts?${params.toString()}`);
  },

  // Get user feed
  getFeed: (page: number = 1, limit: number = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    return apiRequest(`/posts/feed/personal?${params.toString()}`);
  },

  // Get single post
  getPost: (postId: string) => apiRequest(`/posts/${postId}`),

  // Create post
  createPost: (postData: {
    content?: string;
    images?: string[];
    videos?: string[];
    documents?: {
      filename: string;
      url: string;
      type: string;
      size: number;
    }[];
    type?: string;
    tags?: string[];
    visibility?: string;
    metadata?: any;
  }) =>
    apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    }),

  // Update post
  updatePost: (postId: string, postData: any) =>
    apiRequest(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    }),

  // Delete post
  deletePost: (postId: string) =>
    apiRequest(`/posts/${postId}`, { method: 'DELETE' }),

  // React to post
  reactToPost: (postId: string, reactionType: string) =>
    apiRequest(`/posts/${postId}/react`, {
      method: 'POST',
      body: JSON.stringify({ reactionType }),
    }),

  // Track post view
  trackView: (postId: string) =>
    apiRequest(`/posts/${postId}/view`, { method: 'POST' }),

  // Get post comments
  getComments: (postId: string, page: number = 1, limit: number = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    return apiRequest(`/posts/${postId}/comments?${params.toString()}`);
  },

  // Add comment
  addComment: (postId: string, content: string, parentComment?: string) =>
    apiRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentComment }),
    }),

  // Search posts
  searchPosts: (query: string, filters?: any, page: number = 1, limit: number = 10) => {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    
    return apiRequest(`/posts/search?${params.toString()}`);
  },

  // Get user posts
  getUserPosts: (userId: string) => apiRequest(`/posts/user/${userId}`),
};

export default {
  authAPI,
  userAPI,
  postsAPI,
  wallApi,
  messageApi,
  chatApi,
  contactApi,
  kolophoneApi,
  notificationApi,
  fileApi,
  searchApi,
  tagApi,
  projectApi
};
