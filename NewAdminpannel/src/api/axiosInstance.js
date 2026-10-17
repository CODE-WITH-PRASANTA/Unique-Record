import axios from 'axios';

const resolveApiUrl = () => {
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl && typeof envApiUrl === 'string' && envApiUrl.trim()) {
    return envApiUrl.trim().replace(/\/+$/, '');
  }

  const envBackendUrl = import.meta.env.VITE_BACKEND_URL;
  if (envBackendUrl && typeof envBackendUrl === 'string' && envBackendUrl.trim()) {
    const clean = envBackendUrl.trim().replace(/\/+$/, '');
    return clean.endsWith('/api') ? clean : `${clean}/api`;
  }

  // 3. Dynamic runtime detection based on window location
  if (typeof window !== 'undefined' && window.location) {
    const { hostname, origin } = window.location;

    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }

    if (hostname.includes('ouruniverse.in')) {
      return 'https://backend.ouruniverse.in/api';
    }

    return `${origin}/api`;
  }

  return 'http://localhost:5000/api';
};

export const API_URL = resolveApiUrl();
export const BASE_URL = API_URL;

// Base server URL without "/api" (e.g. "http://localhost:5000" or "https://backend.ouruniverse.in")
export const SERVER_URL = API_URL.replace(/\/api\/?$/, '');
export const IMAGE_BASE_URL = SERVER_URL;

/**
 * Dynamic helper to resolve uploaded images and media file URLs.
 * Handles relative paths (e.g., "upload/blogs/img.jpg") as well as full URLs.
 *
 * @param {string} imagePath - Relative path or full URL of image
 * @param {string} fallback - Optional fallback image if empty
 * @returns {string} Fully qualified image URL
 */
export const getImageUrl = (
  imagePath,
  fallback = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'
) => {
  if (!imagePath) return fallback;

  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('data:') ||
    imagePath.startsWith('blob:')
  ) {
    return imagePath;
  }

  const cleanPath = imagePath.replace(/^\/+/, '');
  return `${SERVER_URL}/${cleanPath}`;
};

/**
 * Primary Axios Instance for all Admin Panel HTTP requests.
 */
const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

// Auto-attach JWT token & handle FormData boundary
API.interceptors.request.use(
  (config) => {
    // 1. Auto-attach JWT token from localStorage
    // ✅ Correct code
const token =
  localStorage.getItem('admin_token') ||
  localStorage.getItem('token') ||
  localStorage.getItem('authToken') ||
  localStorage.getItem('accessToken');

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. When uploading FormData, delete Content-Type so browser sets boundary automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: centralized 401 handling & error formatting
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Admin API returned 401 Unauthorized.');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.dispatchEvent(new CustomEvent('admin_unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Centralized Endpoints Registry for NewAdminpannel
 */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/admin/auth/login',
    FALLBACK_LOGIN: '/auth/login',
    ME: '/admin/auth/me',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
  },
  BLOGS: {
    ALL: '/blogs/all',
    LIST: '/blogs',
    CATEGORIES: '/categories',
    COMMENTS: '/blog-comments',
  },
  URU: {
    ALL: '/uru/all',
    PAID: '/uru/paid',
    APPROVED: '/uru/approved',
  },
  DONATIONS: {
    ALL: '/donations/all',
    SYNC: '/donation/sync-razorpay',
  },
  EVENTS: {
    LIST: '/events',
    CATEGORIES: '/event-categories',
    REGISTRATIONS: '/event-registrations',
  },
  GALLERY: {
    ALL: '/gallery/all',
  },
  NOTICES: {
    ALL: '/notices/all',
  },
  TEAMS: {
    ALL: '/teams/all',
  },
  USERS: {
    ALL: '/users/all',
  },
  SUBSCRIBE: {
    LIST: '/newsletter',
  },
  OPINIONS: {
    LIST: '/user-opinions',
  },
  ACHIEVEMENTS: {
    ALL: '/achievements/all',
    CATEGORIES: '/achievement-categories',
    COMMENTS: '/comments/achievements',
  },
};

export default API;
