// API Configuration
export const API_CONFIG = {
  baseURL: 'http://localhost:8081/api/v1',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Environment-specific configurations
export const ENV_CONFIG = {
  development: {
    baseURL: 'http://localhost:8081/api/v1',
    debug: true,
  },
  production: {
    baseURL: '/api/v1', // Will be proxied in production
    debug: false,
  },
};

// Get current environment config
export const getCurrentConfig = () => {
  // Default to development config
  return ENV_CONFIG.development;
};
