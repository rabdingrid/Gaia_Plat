export const localStorage = {
  get: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  set: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  hasCompletedTour: (tourType: string): boolean => {
    const key = `tour_completed_${tourType}`;
    return localStorage.get(key) === 'true';
  },

  markTourCompleted: (tourType: string): void => {
    const key = `tour_completed_${tourType}`;
    localStorage.set(key, 'true');
  }
};

