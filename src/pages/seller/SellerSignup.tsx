
import React, { useState } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import { danishPostalCodes } from '../../data/postalCodes';
import { getTestUsers, addTestUser } from '../../utils/testData';

const SellerSignup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
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
  const [errors, setErrors] = useState({
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

  // Hjælpefunktion til at finde bynavn på postnummer
  const lookupCity = (postalCode: string) => {
    return danishPostalCodes[postalCode] || ''; // Updated to use danishPostalCodes
  };

  // Feltændringer
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    return digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
  };

  // Feltændringer
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

  // Postnummer ændring udfylder by automatisk
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

  // Check if email already exists
  const checkEmailExists = (email: string) => {
    try {
      const testUsers = getTestUsers();
      const realUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const allUsers = [...testUsers, ...realUsers];
      return allUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
    } catch (error) {
      console.error('Error checking email exists:', error);
      return false; // Allow signup if check fails
    }
  };

  // Validering
  const validate = () => {
    const newErrors = { ...errors };
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
    setErrors(newErrors);
    return Object.values(newErrors).every((v) => v === '');
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    
    try {
      // Simulate backend call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create unique user ID
      const userId = `seller_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create user object with proper ID and data structure
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

      // Add user to test users database
      addTestUser(newUser);

      // Clear any existing user session data to ensure clean slate
      localStorage.removeItem('currentUser');
      localStorage.removeItem('seller_profile');
      
      // Set new user as current user
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('seller_profile', JSON.stringify(newUser));
      
      // Clear any old cases or data that might interfere
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

  // Add debugging for validation
  const emailValid = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email);
  const postalCodeValid = lookupCity(formData.postalCode);
  const passwordMatch = formData.password === formData.confirmPassword;
  const passwordLengthValid = formData.password.length >= 8;
  const emailDuplicationCheck = !checkEmailExists(formData.email);

  console.log('Validation debug:', {
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
  });

  const allFieldsValid =
    formData.name &&
    formData.email &&
    emailValid &&
    emailDuplicationCheck &&
    formData.phone &&
    formData.address &&
    formData.postalCode &&
    postalCodeValid &&
    formData.city &&
    formData.password &&
    formData.confirmPassword &&
    formData.acceptTerms &&
    passwordMatch &&
    passwordLengthValid;

  return (
    <>
      <Navigation />
      <main className="container mx-auto p-6 max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Opret sælgerbruger</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <Label htmlFor="name">Navn <span className="text-red-600">*</span></Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  required
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
              </div>
              <div className="mb-4">
                <Label htmlFor="email">Email <span className="text-red-600">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  required
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
              </div>
              <div className="mb-4">
                <Label htmlFor="phone">Telefonnummer <span className="text-red-600">*</span></Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  placeholder="12 34 56 78"
                  required
                />
                {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
              </div>
              <div className="mb-4">
                <Label htmlFor="address">Adresse <span className="text-red-600">*</span></Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={e => handleInputChange('address', e.target.value)}
                  required
                />
                {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
              </div>
              <div className="mb-4 flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="postalCode">Postnummer <span className="text-red-600">*</span></Label>
                  <Input
                    id="postalCode"
                    type="text"
                    value={formData.postalCode}
                    onChange={e => handlePostalCodeChange(e.target.value)}
                    required
                    maxLength={4}
                    pattern="\d*"
                    inputMode="numeric"
                  />
                  {errors.postalCode && <span className="text-red-500 text-sm">{errors.postalCode}</span>}
                </div>
                <div className="flex-1">
                  <Label htmlFor="city">By <span className="text-red-600">*</span></Label>
                  <Input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={e => handleInputChange('city', e.target.value)}
                    required
                    readOnly
                  />
                  {errors.city && <span className="text-red-500 text-sm">{errors.city}</span>}
                </div>
              </div>
              <div className="mb-4">
                <Label htmlFor="password">Kodeord <span className="text-red-600">*</span></Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  required
                  minLength={8}
                />
                {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
              </div>
              <div className="mb-4">
                <Label htmlFor="confirmPassword">Bekræft kodeord <span className="text-red-600">*</span></Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={e => handleInputChange('confirmPassword', e.target.value)}
                  required
                  minLength={8}
                />
                {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword}</span>}
              </div>
              <div className="mb-6 flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={checked => handleInputChange('acceptTerms', !!checked)}
                />
                <Label htmlFor="acceptTerms" className="select-none">
                  Jeg accepterer{' '}
                  <Link to="/vilkaar" className="text-blue-600 underline">
                    handelsbetingelserne
                  </Link>{' '}
                  og{' '}
                  <Link to="/privatlivspolitik" className="text-blue-600 underline">
                    privatlivspolitikken
                  </Link>{' '}
                  <span className="text-red-600">*</span>
                </Label>
                {errors.acceptTerms && <span className="text-red-500 text-sm block">{errors.acceptTerms}</span>}
              </div>
              <Button type="submit" disabled={isSubmitting || !allFieldsValid}>
                {isSubmitting ? 'Opretter...' : 'Opret bruger'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default SellerSignup;
