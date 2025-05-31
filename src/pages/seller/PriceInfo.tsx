import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import ProgressIndicator from '../../components/ProgressIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Home, Info, FileText } from 'lucide-react';
import { fetchPublicValuation } from '@/services/publicValuationService';
import { generateSagsnummer, saveTestCase, addTestUser } from '@/utils/testData';
import { useToast } from '@/hooks/use-toast';

const PriceInfo = () => {
  const [propertyData, setPropertyData] = useState(null);
  const [salePreferences, setSalePreferences] = useState(null);
  const [publicValuation, setPublicValuation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingCase, setIsCreatingCase] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      // Get saved property data and sale preferences
      const savedPropertyData = localStorage.getItem('propertyForm');
      const savedSalePreferences = localStorage.getItem('salePreferencesForm');
      
      console.log('Property data:', savedPropertyData);
      console.log('Sale preferences:', savedSalePreferences);
      
      if (savedPropertyData) {
        const propertyData = JSON.parse(savedPropertyData);
        setPropertyData(propertyData);
        
        // Get public valuation
        try {
          const valuation = await fetchPublicValuation(propertyData.address, propertyData.postalCode);
          setPublicValuation(valuation);
        } catch (error) {
          console.error('Error fetching valuation:', error);
        }
      }
      
      if (savedSalePreferences) {
        setSalePreferences(JSON.parse(savedSalePreferences));
      }
      
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleCreateCase = async () => {
    if (!propertyData) {
      toast({
        title: "Fejl",
        description: "Ingen boligdata fundet. Gå tilbage og udfyld formularen.",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingCase(true);

    try {
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      if (!currentUser || !currentUser.id) {
        toast({
          title: "Fejl",
          description: "Brugerdata ikke fundet. Log ind igen.",
          variant: "destructive"
        });
        navigate('/saelger/login');
        return;
      }

      console.log('=== CREATING CASE FOR EXISTING USER ===');
      console.log('Using existing user:', currentUser);

      // Get expected price from sale preferences
      // Ensure expectedPrice is always an array, and take the first element
      const expectedPriceValue = (Array.isArray(salePreferences?.expectedPrice) && salePreferences.expectedPrice.length > 0)
        ? salePreferences.expectedPrice[0]
        : 0;
      const formattedPrice = expectedPriceValue ? `${(expectedPriceValue / 1000000).toFixed(1)} mio. kr` : 'Ikke angivet';

      // Create new case using existing user and combined data
      const newCase = {
        id: Date.now().toString(),
        sagsnummer: `SAG-${Date.now().toString().substring(0, 6).toUpperCase()}`,
        sellerId: currentUser.id,
        address: propertyData.address,
        postnummer: propertyData.postalCode,
        municipality: propertyData.city,
        type: propertyData.propertyType,
        size: parseInt(propertyData.size) || 0,
        buildYear: parseInt(propertyData.buildYear) || new Date().getFullYear(),
        rooms: propertyData.rooms,
        price: formattedPrice, // Display formatted price
        priceValue: expectedPriceValue, // Store actual number value for calculations if needed
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        offers: [],
        showingRegistrations: [],
        messages: [],

        // Add data from SalePreferencesForm and PropertyData (notes)
        timeframe: salePreferences?.timeframe || undefined,
        timeframeType: salePreferences?.timeframeType || undefined,
        priorities: salePreferences?.priorities || { speed: false, price: false, service: false },
        flexiblePrice: salePreferences?.flexiblePrice || false,
        marketingBudget: salePreferences?.marketingBudget || 0,
        freeIfNotSold: salePreferences?.freeIfNotSold || false, // Assuming this exists in salePreferences
        specialRequests: salePreferences?.specialRequests || undefined,
        notes: propertyData.notes || undefined, // Notes from PropertyData.tsx
      };

      console.log('Creating case:', newCase);

      // Save the case to test_cases in localStorage
      saveTestCase(newCase);

      // Also save as seller_case for compatibility (if needed by other components)
      localStorage.setItem(`seller_case_${newCase.id}`, JSON.stringify(newCase));

      // Clear the form data from localStorage after case creation
      localStorage.removeItem('propertyForm');
      localStorage.removeItem('salePreferencesForm');

      // Dispatch event for dashboard to update
      window.dispatchEvent(new Event('caseCreated'));

      toast({
        title: "Sag oprettet",
        description: `Din sag ${newCase.sagsnummer} er blevet oprettet.`,
      });

      // Navigate to dashboard
      navigate('/saelger/dashboard');

    } catch (error) {
      console.error('Error creating case:', error);
      toast({
        title: "Fejl",
        description: "Der opstod en fejl ved oprettelse af din sag. Prøv igen.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingCase(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
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
                      {salePreferences && (
                        <p className="text-sm text-gray-600">
                          Forventet pris: {(salePreferences.expectedPrice?.[0] / 1000000).toFixed(1)} mio. kr
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
                <Link to="/saelger/salgsønsker" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Tilbage
                  </Button>
                </Link>
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