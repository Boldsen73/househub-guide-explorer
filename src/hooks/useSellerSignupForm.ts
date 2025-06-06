import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { danishPostalCodes } from '../data/postalCodes';
import { getTestUsers, addTestUser } from '../utils/testData';
import { formatPhoneNumber, validateSellerSignupForm } from '../utils/sellerSignupValidation';

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

interface FormErrors {
  name: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  password: string;
  confirmPassword: string;
  acceptTerms: string;
}

export const useSellerSignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
    password: '',
    confirmPassword: '',
    acceptTerms: '',
  });

  const lookupCity = (postalCode: string) => {
    return danishPostalCodes[postalCode] || '';
  };

  const checkEmailExists = (email: string) => {
    try {
      const testUsers = getTestUsers();
      const realUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const allUsers = [...testUsers, ...realUsers];
      return allUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
    } catch (error) {
      console.error('Error checking email exists:', error);
      return false;
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === 'phone' && typeof value === 'string') {
      value = formatPhoneNumber(value);
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const handlePostalCodeChange = (value: string) => {
    const city = lookupCity(value);
    setFormData((prev) => ({
      ...prev,
      postalCode: value,
      city,
    }));
    setErrors((prev) => ({
      ...prev,
      postalCode: '',
      city: '',
    }));
  };

  const validate = () => {
    const validationErrors = validateSellerSignupForm(formData, checkEmailExists, lookupCity);
    setErrors(validationErrors);
    return Object.values(validationErrors).every((v) => v === '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const userId = `seller_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const newUser = {
        id: userId,
        name: formData.name,
        firstName: formData.name.split(' ')[0],
        lastName: formData.name.split(' ').slice(1).join(' '),
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        postalCode: formData.postalCode,
        city: formData.city,
        role: 'seller' as const,
        type: 'seller',
        password: formData.password,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      addTestUser(newUser);

      localStorage.removeItem('currentUser');
      localStorage.removeItem('seller_profile');

      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('seller_profile', JSON.stringify(newUser));

      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (key.startsWith('seller_case_') && !key.includes(userId)) {
          localStorage.removeItem(key);
        }
      });

      toast({
        title: 'Succes',
        description: 'Din bruger er oprettet.',
      });
      navigate('/seller/dashboard');
    } catch (error) {
      toast({
        title: 'Fejl',
        description: 'Noget gik galt ved oprettelse.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getValidationStatus = () => {
    const emailValid = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email);
    const postalCodeValid = lookupCity(formData.postalCode);
    const passwordMatch = formData.password === formData.confirmPassword;
    const passwordLengthValid = formData.password.length >= 8;
    const emailDuplicationCheck = !checkEmailExists(formData.email);

    return {
      name: !!formData.name,
      email: !!formData.email,
      emailValid,
      emailDuplicationCheck,
      phone: !!formData.phone,
      address: !!formData.address,
      postalCode: !!formData.postalCode,
      postalCodeValid,
      city: !!formData.city,
      password: !!formData.password,
      confirmPassword: !!formData.confirmPassword,
      acceptTerms: formData.acceptTerms,
      passwordMatch,
      passwordLengthValid
    };
  };

  const validationStatus = getValidationStatus();
  const allFieldsValid =
    validationStatus.name &&
    validationStatus.email &&
    validationStatus.emailValid &&
    validationStatus.emailDuplicationCheck &&
    validationStatus.phone &&
    validationStatus.address &&
    validationStatus.postalCode &&
    validationStatus.postalCodeValid &&
    validationStatus.city &&
    validationStatus.password &&
    validationStatus.confirmPassword &&
    validationStatus.acceptTerms &&
    validationStatus.passwordMatch &&
    validationStatus.passwordLengthValid;

  return {
    formData,
    errors,
    isSubmitting,
    allFieldsValid,
    validationStatus,
    handleInputChange,
    handlePostalCodeChange,
    handleSubmit,
  };
};
