const AUTH_KEY = 'auth_state';

export const authStorage = {
  save: (state: any) => {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save auth state:', error);
    }
  },

  load: () => {
    try {
      const state = localStorage.getItem(AUTH_KEY);
      return state ? JSON.parse(state) : null;
    } catch (error) {
      console.error('Failed to load auth state:', error);
      return null;
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (error) {
      console.error('Failed to clear auth state:', error);
    }
  }
};