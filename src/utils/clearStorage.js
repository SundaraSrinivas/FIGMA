// Utility to clear localStorage and force database reinitialization
export const clearEmployeeStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('sqlite_employees');
    console.log('Employee storage cleared. Database will reinitialize with new data.');
  }
};

// Function to call from browser console
window.clearEmployeeStorage = clearEmployeeStorage;
