import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import PropertyAddressSection from '../../components/seller/PropertyAddressSection';
// FJERNEDE: import PropertyNotesSection from '../../components/seller/PropertyNotesSection'; // Fjerner denne import
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PropertyData = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial state med alle felter samlet, 'notes' er fjernet
  const [formData, setFormData] = useState({
    address: '',
    postalCode: '',
    city: '',
    boligtype: '',
    størrelse: '',
    byggeår: '',
    rooms: '',
    // 'notes' er fjernet herfra
  });

  // Indlæs brugerens adressedata ved komponent-mount
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log('Loading user data for PropertyData:', currentUser);
    
    if (currentUser) {
      const newFormData = {
        ...formData,
        address: currentUser.address || '',
        postalCode: currentUser.postalCode || '',
        city: currentUser.city || ''
      };
      
      console.log('Setting form data:', newFormData);
      setFormData(newFormData);
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
        setIsSubmitting(false);
        return;
      }

      // NY VALIDERING: Byggeår
      const currentYear = new Date().getFullYear(); // Får det aktuelle år
      const buildYear = parseInt(formData.byggeår);

      if (isNaN(buildYear) || formData.byggeår.length !== 4 || buildYear <= 1500 || buildYear > currentYear) {
        toast({
          title: 'Fejl',
          description: `Byggeår skal være et gyldigt 4-cifret årstal, ikke nyere end ${currentYear}.`,
          variant: 'destructive'
        });
        setIsSubmitting(false);
        return;
      }


      // Gem kun formular-data, ikke som sag!
      const propertyFormData = {
        address: formData.address,
        postalCode: formData.postalCode,
        city: formData.city,
        propertyType: formData.boligtype,
        size: parseInt(formData.størrelse) || 0,
        buildYear: buildYear,
        rooms: parseInt(formData.rooms) || 0,
        // 'notes' er fjernet herfra
      };

      localStorage.setItem('propertyData', JSON.stringify(propertyFormData));

      toast({
        title: 'Succes',
        description: 'Boligdata er gemt.'
      });

      // NAVIGER TIL NÆSTE TRIN (RETTET STI MED 'ø')
      navigate('/saelger/salgsønsker'); // KORREKT STI
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

            {/* Boligdetaljer sektion - Direkte indsat i PropertyData.tsx */}
            <div className="space-y-4">
                <Label htmlFor="boligtype">Boligtype</Label>
                <Select
                    value={formData.boligtype}
                    onValueChange={(value) => handleInputChange('boligtype', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Vælg boligtype" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="rækkehus">Rækkehus</SelectItem>
                        <SelectItem value="lejlighed">Lejlighed</SelectItem>
                        <SelectItem value="andelsbolig">Andelsbolig</SelectItem>
                        <SelectItem value="fritidshus">Fritidshus</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-4">
                <Label htmlFor="størrelse">Størrelse (m²)</Label>
                <Input
                    id="størrelse"
                    type="number"
                    value={formData.størrelse}
                    onChange={(e) => handleInputChange('størrelse', e.target.value)}
                    placeholder="f.eks. 120"
                />
            </div>

            <div className="space-y-4">
                <Label htmlFor="byggeår">Byggeår</Label>
                <Input
                    id="byggeår"
                    type="number"
                    value={formData.byggeår}
                    onChange={(e) => handleInputChange('byggeår', e.target.value)}
                    placeholder="f.eks. 1985"
                />
            </div>

            <div className="space-y-4">
                <Label htmlFor="rooms">Antal værelser</Label>
                <Input
                    id="rooms"
                    type="number"
                    value={formData.rooms}
                    onChange={(e) => handleInputChange('rooms', e.target.value)}
                    placeholder="f.eks. 3"
                />
            </div>
            {/* SLUT Boligdetaljer sektion */}

            {/* FJERNEDE: Kommentarer sektion (PropertyNotesSection) - den skal kun være på næste side */}
            {/* <PropertyNotesSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            /> */}

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