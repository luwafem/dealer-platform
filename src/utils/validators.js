// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate Nigerian phone number (simple)
export const isValidNigerianPhone = (phone) => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  // Check if it's 11 digits starting with 0, or 13 digits starting with 234
  return /^(0[789][01]\d{8})$|^(234[789][01]\d{8})$/.test(cleaned);
};

// Validate price (positive integer)
export const isValidPrice = (price) => {
  const num = Number(price);
  return Number.isInteger(num) && num > 0;
};

// Validate year (between 1900 and current year + 1)
export const isValidYear = (year) => {
  const currentYear = new Date().getFullYear();
  const y = Number(year);
  return Number.isInteger(y) && y >= 1900 && y <= currentYear + 1;
};

// Required fields for listing form (basic)
export const validateListingBasic = (data) => {
  const errors = {};
  if (!data.make) errors.make = 'Make is required';
  if (!data.model) errors.model = 'Model is required';
  if (!isValidYear(data.year)) errors.year = 'Valid year is required';
  if (!isValidPrice(data.price)) errors.price = 'Valid price is required';
  if (!data.location) errors.location = 'Location is required';
  return errors;
};