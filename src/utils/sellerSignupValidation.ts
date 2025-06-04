import { formatPhoneNumber } from './phoneValidation';

export { formatPhoneNumber };

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export const validateSellerSignupForm = (
  formData: FormData,
  checkEmailExists: (email: string) => boolean,
  lookupCity: (postalCode: string) => string
) => {
  const newErrors = {
    name: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
    password: '',
    confirmPassword: '',
    acceptTerms: '',
  };

  newErrors.name = formData.name.trim() ? '' : 'Navn skal udfyldes.';
  
  // Email validation with duplicate check
  if (!formData.email.trim()) {
    newErrors.email = 'Email skal udfyldes.';
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
    newErrors.email = 'Indtast en gyldig email.';
  } else if (checkEmailExists(formData.email)) {
    newErrors.email = 'Denne email er allerede registreret. Prøv at logge ind i stedet.';
  } else {
    newErrors.email = '';
  }
  
  newErrors.phone = formData.phone.trim() ? '' : 'Telefonnummer skal udfyldes.';
  newErrors.address = formData.address.trim() ? '' : 'Adresse skal udfyldes.';
  newErrors.postalCode =
    formData.postalCode.trim() && lookupCity(formData.postalCode)
      ? ''
      : 'Postnummer skal udfyldes og være gyldigt.';
  newErrors.city = formData.city.trim() ? '' : 'By skal udfyldes.';
  newErrors.password =
    formData.password.trim().length >= 8
      ? ''
      : 'Kodeord skal udfyldes og være mindst 8 tegn.';
  newErrors.confirmPassword =
    formData.confirmPassword.trim() && formData.confirmPassword === formData.password
      ? ''
      : 'Kodeordene matcher ikke.';
  newErrors.acceptTerms = formData.acceptTerms ? '' : 'Du skal acceptere vilkår og betingelser.';

  return newErrors;
};