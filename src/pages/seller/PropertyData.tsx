import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import PropertyAddressSection from '../../components/seller/PropertyAddressSection';
import PropertyDetailsSection from '../../components/seller/PropertyDetailsSection';
import PropertyNotesSection from '../../components/seller/PropertyNotesSection';

const PropertyData = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial state med alle felter samlet
  const [formData, setFormData] = useState({
    address: '',
    postalCode: '',
    city: '',
    boligtype: '',
    størrelse: '',
    byggeår: '',
    værelser: '',
    notes: ''
  });

  // Indlæs brugerens adressedata ved komponent-mount
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.address) {
      setFormData(prev => ({
        ...prev,
        address: currentUser.address || '',
        postalCode: currentUser.postalCode || '',
        city: currentUser.city || ''
      }));
    }
  }, []);

  // Håndter input-ændringer
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Gem boligdata (kun som formular-data, ikke som sag!)
  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Valider at vigtige felter er udfyldt
      if (!formData.address.trim()) {
        toast({
          title: 'Fejl',
          description: 'Adresse skal udfyldes.',
          variant: 'destructive'
        });
        return;
      }

      // Gem kun formular-data, ikke som sag!
      const propertyFormData = {
        address: formData.address,
        postalCode: formData.postalCode,
        city: formData.city,
        propertyType: formData.boligtype,
        size: formData.størrelse,
        buildYear: formData.byggeår,
        rooms: formData.værelser,
        notes: formData.notes
      };

      localStorage.setItem('propertyForm', JSON.stringify(propertyFormData));

      toast({
        title: 'Succes',
        description: 'Boligdata er gemt.'
      });

      // Naviger til næste trin
      navigate('/saelger/salgsønsker');
    } catch (error) {
      toast({
        title: 'Fejl',
        description: 'Der opstod en fejl ved gem af data.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navigation />
      <main className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Boligdata</CardTitle>
            <p className="text-sm text-gray-600">
              Vi har udfyldt adresseoplysningerne fra din profil. Du kan ændre dem, hvis du sælger en anden bolig.
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Adresse sektion */}
            <PropertyAddressSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />

            {/* Boligdetaljer sektion */}
            <PropertyDetailsSection 
              formData={formData} 
              setFormData={setFormData} 
            />

            {/* Kommentarer sektion */}
            <PropertyNotesSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />

            {/* Gem knap */}
            <div className="flex justify-end space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/saelger/dashboard')}
              >
                Tilbage til dashboard
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSubmitting || !formData.address.trim()}
              >
                {isSubmitting ? 'Gemmer...' : 'Gem og fortsæt'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default PropertyData;
