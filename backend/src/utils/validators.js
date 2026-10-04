export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));
export const isValidPhoneMin10 = (phone) => /^\d{10,}$/.test(String(phone).replace(/\D/g, ''));
export const isNonEmpty = (s) => typeof s === 'string' && s.trim().length > 0;
