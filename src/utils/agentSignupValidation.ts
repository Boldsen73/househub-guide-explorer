
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

export const validateAgentSignupForm = (
  formData: {
    name: string;
    email: string;
    phone: string;
    agency: string;
    primaryRegion: string;
    password: string;
    confirmPassword: string;
  },
  acceptedTerms: boolean
): Record<string, string> => {
  const newErrors: Record<string, string> = {};

  // Required field validation
  if (!formData.name.trim()) newErrors.name = 'Navn er påkrævet';
  if (!formData.email.trim()) newErrors.email = 'Email er påkrævet';
  if (!formData.phone.trim()) newErrors.phone = 'Telefon er påkrævet';
  if (!formData.agency.trim()) newErrors.agency = 'Mæglervirksomhed er påkrævet';
  if (!formData.primaryRegion) newErrors.primaryRegion = 'Primær region er påkrævet';
  if (!formData.password) newErrors.password = 'Adgangskode er påkrævet';
  if (!formData.confirmPassword) newErrors.confirmPassword = 'Bekræft adgangskode er påkrævet';

  // Email validation
  if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Ugyldig email adresse';
  }

  // Phone validation - check if exactly 8 digits when stripped of spaces
  const phoneDigits = formData.phone.replace(/\s/g, '');
  if (formData.phone && phoneDigits.length !== 8) {
    newErrors.phone = 'Telefonnummer skal bestå af 8 cifre';
  }

  // Password validation
  if (formData.password && formData.password.length < 8) {
    newErrors.password = 'Adgangskode skal være mindst 8 tegn';
  }

  // Confirm password validation
  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Adgangskoder matcher ikke';
  }

  // Terms validation
  if (!acceptedTerms) {
    newErrors.terms = 'Du skal acceptere vilkårene';
  }

  return newErrors;
};
