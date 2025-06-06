
import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import ProgressIndicator from '../../components/ProgressIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, TrendingUp, Info, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes';
import { saveCase } from '@/utils/caseManagement';
import { generateSagsnummer } from '@/utils/caseManagement';

const PriceInfo = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = useState<any>(null);
  const [salePreferences, setSalePreferences] = useState<any>(null);
  const [publicValuation, setPublicValuation] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingCase, setIsCreatingCase] = useState(false);

  useEffect(() => {
    const storedPropertyData = localStorage.getItem('propertyData');
    const storedSalePreferences = localStorage.getItem('salePreferencesForm');

    if (storedPropertyData && storedSalePreferences) {
      setPropertyData(JSON.parse(storedPropertyData));
      setSalePreferences(JSON.parse(storedSalePreferences));
    }

    // Simulerer hentning af offentlig vurdering
    setTimeout(() => {
      setPublicValuation(Math.floor(Math.random() * (6000000 - 2000000 + 1)) + 2000000);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString('da-DK', { style: 'currency', currency: 'DKK' });
  };

  const handleCreateCase = async () => {
    setIsCreatingCase(true);
    try {
      // Get current user
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      if (!currentUser.id) {
        throw new Error('No user found');
      }

      // Simulate case creation delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create the case with all collected data
      const caseId = Date.now().toString();
      const sagsnummer = generateSagsnummer();

      const newCase = {
        id: caseId,
        sagsnummer: sagsnummer,
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        sellerEmail: currentUser.email,
        sellerPhone: currentUser.phone || '',
        address: propertyData?.address || '',
        municipality: propertyData?.city || '',
        postalCode: propertyData?.postalCode || '',
        type: propertyData?.propertyType || 'villa',
        size: propertyData?.size?.toString() || '0',
        buildYear: propertyData?.buildYear || 0,
        rooms: propertyData?.rooms || 0,
        price: salePreferences?.expectedPrice ? `${(salePreferences.expectedPrice[0] / 1000000).toFixed(1)} mio. kr` : 'Ikke angivet',
        priceValue: salePreferences?.expectedPrice?.[0] || 0,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeframe: salePreferences?.timeframe?.[0] || salePreferences?.timeframe || 6,
        timeframeType: salePreferences?.timeframeType || 'months',
        priorities: salePreferences?.priorities || { speed: false, price: false, service: false },
        specialRequests: salePreferences?.specialRequests || '',
        flexiblePrice: salePreferences?.flexiblePrice || false,
        marketingBudget: salePreferences?.marketingBudget || 0,
        freeIfNotSold: salePreferences?.freeIfNotSold || false,
        
      };

      console.log('Creating case:', newCase);

      // Save the case
      saveCase(newCase);

      // Clean up form data
      localStorage.removeItem('propertyData');
      localStorage.removeItem('salePreferencesForm');

      // Set flag that user has active case
      localStorage.setItem('seller_has_active_case', 'true');

      toast({
        title: 'Sag oprettet!',
        description: 'Din sag er nu oprettet og mæglere kan byde på den.',
      });

      // Dispatch events to notify other components
      window.dispatchEvent(new CustomEvent('caseCreated', { detail: newCase }));
      window.dispatchEvent(new CustomEvent('caseUpdated', { detail: newCase }));
      window.dispatchEvent(new CustomEvent('casesChanged', { detail: { case: newCase } }));

      // Navigate directly to dashboard where all data is shown correctly
      navigate(ROUTES.SELLER_DASHBOARD);
    } catch (error) {
      console.error('Error creating case:', error);
      toast({
        title: 'Fejl',
        description: 'Der opstod en fejl ved oprettelse af sagen.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingCase(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Indlæser prisoplysninger...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <ProgressIndicator currentStep={3} totalSteps={3} />
          
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Prisoplysninger</CardTitle>
              <p className="text-gray-600 text-lg">
                Her er de aktuelle markedsoplysninger for din bolig
              </p>
            </CardHeader>
            <CardContent className="p-8">
              
              {propertyData && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <Home className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">{propertyData.address}</h3>
                      <p className="text-sm text-gray-600">
                        {propertyData.size} m² • {propertyData.propertyType} • Bygget {propertyData.buildYear}
                      </p>
                      {salePreferences && salePreferences.expectedPrice && salePreferences.expectedPrice.length > 0 && (
                        <p className="text-sm text-gray-600">
                          Forventet pris: {(salePreferences.expectedPrice[0] / 1000000).toFixed(1)} mio. kr
                        </p>
                      )}
                    </div>
                  </div>

                  {publicValuation && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <h3 className="text-lg font-semibold">Offentlig vurdering</h3>
                      </div>
                      
                      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-700">
                            {formatPrice(publicValuation)}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            Seneste offentlige vurdering
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Bemærk</h4>
                        <p className="text-sm text-yellow-700">
                          Den offentlige vurdering kan afvige fra markedsprisen. 
                          Mæglerne vil give dig deres professionelle vurdering baseret på aktuelle markedsforhold.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Dokumenter</h4>
                        <p className="text-sm text-blue-700">
                          HouseHub henter automatisk relevante dokumenter for din bolig, 
                          så mæglerne får alle nødvendige oplysninger til at give dig det bedste tilbud.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-4 pt-8">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex-1" 
                  onClick={() => navigate(ROUTES.SELLER_WISHES)}
                >
                  Tilbage
                </Button>
                <Button 
                  className="w-full flex-1" 
                  onClick={handleCreateCase}
                  disabled={isCreatingCase || !propertyData}
                >
                  {isCreatingCase ? 'Opretter sag...' : 'Afslut og opret sag'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PriceInfo;
