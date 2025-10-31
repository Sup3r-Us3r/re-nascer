// API Configuration
export const API_CONFIG = {
  // Base URL of the API - adjust this based on your environment
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',

  // Default timeout for requests (in milliseconds)
  timeout: 10000,

  // Default headers
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

// Environment-specific settings
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;
