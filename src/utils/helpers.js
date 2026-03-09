// Generate a random reference for payments
export const generateReference = (prefix = 'TXN') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${timestamp}_${random}`.toUpperCase();
};

// Deep clone an object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Extract initials from business name
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Group array of objects by key
export const groupBy = (array, key) => {
  return array.reduce((result, current) => {
    (result[current[key]] = result[current[key]] || []).push(current);
    return result;
  }, {});
};