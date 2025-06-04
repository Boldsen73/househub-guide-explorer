import React from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSellerSignupForm } from '../../hooks/useSellerSignupForm';
import { FormField, PostalCodeCityFields, TermsCheckbox } from '../../components/seller/SellerSignupFormFields';

const SellerSignup = () => {
  const {
    formData,
    errors,
    isSubmitting,
    allFieldsValid,
    validationStatus,
    handleInputChange,
    handlePostalCodeChange,
    handleSubmit,
  } = useSellerSignupForm();

  // Add debugging for validation
  console.log('Validation debug:', validationStatus);

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
              <FormField
                id="name"
                label="Navn"
                value={formData.name}
                onChange={(value) => handleInputChange('name', value)}
                error={errors.name}
                required
              />
              
              <FormField
                id="email"
                label="Email"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                error={errors.email}
                type="email"
                required
              />
              
              <FormField
                id="phone"
                label="Telefonnummer"
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
                error={errors.phone}
                type="tel"
                placeholder="12 34 56 78"
                required
              />
              
              <FormField
                id="address"
                label="Adresse"
                value={formData.address}
                onChange={(value) => handleInputChange('address', value)}
                error={errors.address}
                required
              />
              
              <PostalCodeCityFields
                postalCode={formData.postalCode}
                city={formData.city}
                onPostalCodeChange={handlePostalCodeChange}
                onCityChange={(value) => handleInputChange('city', value)}
                postalCodeError={errors.postalCode}
                cityError={errors.city}
              />
              
              <FormField
                id="password"
                label="Kodeord"
                value={formData.password}
                onChange={(value) => handleInputChange('password', value)}
                error={errors.password}
                type="password"
                minLength={8}
                required
              />
              
              <FormField
                id="confirmPassword"
                label="Bekræft kodeord"
                value={formData.confirmPassword}
                onChange={(value) => handleInputChange('confirmPassword', value)}
                error={errors.confirmPassword}
                type="password"
                minLength={8}
                required
              />
              
              <TermsCheckbox
                checked={formData.acceptTerms}
                onChange={(checked) => handleInputChange('acceptTerms', checked)}
                error={errors.acceptTerms}
              />
              
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