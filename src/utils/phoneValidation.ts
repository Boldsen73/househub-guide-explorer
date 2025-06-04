export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Limit to 8 digits
  const limitedDigits = digits.slice(0, 8);
  
  // Format as XX XX XX XX
  if (limitedDigits.length >= 6) {
    return `${limitedDigits.slice(0, 2)} ${limitedDigits.slice(2, 4)} ${limitedDigits.slice(4, 6)} ${limitedDigits.slice(6, 8)}`;
  } else if (limitedDigits.length >= 4) {
    return `${limitedDigits.slice(0, 2)} ${limitedDigits.slice(2, 4)} ${limitedDigits.slice(4)}`;
  } else if (limitedDigits.length >= 2) {
    return `${limitedDigits.slice(0, 2)} ${limitedDigits.slice(2)}`;
  }
  
  return limitedDigits;
};