import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { saveTestCase, generateSagsnummer } from '@/utils/testData';
import ProgressSteps from '@/components/seller/ProgressSteps';
import Footer from '@/components/Footer';     // <--- DENNE LINJE ER RETTET!
import Navigation from '@/components/Navigation'; // <--- DENNE LINJE ER RETTET!
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';

const PriceInfo: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [propertyData, setPropertyData] = useState<any>(null);
  const [salePreferences, setSalePreferences] = useState<any>(null);
  const [publicValuation, setPublicValuation] = useState<number | null>(null);

  const [currentValuation, setCurrentValuation] = useState<number | null>(null);
  const [valuationLoading, setValuationLoading] = useState<boolean>(false);
  const [valuationError, setValuationError] = useState<string | null>(null);

  useEffect(() => {
    const storedPropertyData = localStorage.getItem('propertyData');
    const storedSalePreferences = localStorage.getItem('salePreferences');

    if (storedPropertyData) {
      setPropertyData(JSON.parse(storedPropertyData));
    }
    if (storedSalePreferences) {
      setSalePreferences(JSON.parse(storedSalePreferences));
    }

    // Simulate fetching public valuation
    setValuationLoading(true);
    setTimeout(() => {
      const simulatedValuation = Math.floor(Math.random() * (5000000 - 1000000 + 1)) + 1000000;
      setPublicValuation(simulatedValuation);
      setCurrentValuation(simulatedValuation); // Initialize current valuation with public valuation
      setValuationLoading(false);
    }, 1500);
  }, []);

  const handlePriceChange = (value: number[]) => {
    setCurrentValuation(value[0]);
  };

  const handleFinalizeCase = () => {
    if (!currentUser || !propertyData || !salePreferences || !currentValuation) {
      alert('Missing information to finalize the case.');
      return;
    }

    const sagsnummer = generateSagsnummer();
    const formattedPrice = new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(currentValuation);

    const newCase = {
      id: Date.now().toString(),
      sagsnummer: sagsnummer,
      sellerId: currentUser.id,
      // Property Data
      address: propertyData.address || 'Ikke angivet',
      postnummer: propertyData.postalCode || 'Ikke angivet',
      municipality: propertyData.city || 'Ikke angivet',
      type: propertyData.propertyType || 'Ikke angivet',
      size: parseInt(propertyData.size) || 0,
      buildYear: parseInt(propertyData.buildYear) || new Date().getFullYear(),
      rooms: propertyData.rooms || 'Ikke angivet',
      // notes: propertyData.notes || undefined, // THIS LINE IS REMOVED

      // Sale Preferences
      expectedPrice: formattedPrice, // The string for display
      expectedPriceValue: currentValuation, // The number for potential calculations
      flexiblePrice: salePreferences?.flexiblePrice || false,
      timeframe: salePreferences?.timeframe || undefined,
      timeframeType: salePreferences?.timeframeType || undefined,
      priorities: salePreferences?.priorities || { speed: false, price: false, service: false },
      marketingBudget: salePreferences?.marketingBudget || 0,
      freeIfNotSold: salePreferences?.freeIfNotSold || false,
      specialRequests: salePreferences?.specialRequests || undefined, // Særlige ønsker eller kommentarer

      // Case status and timestamps
      status: 'active' as const, // Start as active case
      createdAt: new Date().toISOString(),
      offers: [],
      showingRegistrations: [],
      messages: [],
    };

    saveTestCase(newCase);
    localStorage.removeItem('propertyData');
    localStorage.removeItem('salePreferences');

    navigate('/saelger/dashboard');
  };

  const propertyDetails = propertyData
    ? `${propertyData.address || ''} • ${propertyData.size || ''} m² ${propertyData.propertyType || ''} • Bygget ${propertyData.buildYear || ''}`
    : 'Indlæser boligdetaljer...';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <ProgressSteps currentStep={3} totalSteps={3} />
        <Card className="max-w-3xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Prisoplysninger</CardTitle>
            <CardDescription className="text-gray-600">
              Her er de aktuelle markedsoplysninger for din bolig
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
              <p className="font-semibold text-blue-800">
                {propertyDetails}
              </p>
              {currentValuation && (
                <p className="mt-2 text-blue-700">
                  Forventet pris: <span className="font-bold">{new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(currentValuation)}</span>
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-800">Offentlig vurdering</h3>
              {valuationLoading ? (
                <p className="text-gray-500">Indlæser offentlig vurdering...</p>
              ) : valuationError ? (
                <p className="text-red-500">Fejl ved indlæsning: {valuationError}</p>
              ) : publicValuation !== null ? (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-green-800">
                      {new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(publicValuation)}
                    </p>
                    <p className="text-sm text-green-700 mt-1">Seneste offentlige vurdering</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Ingen offentlig vurdering fundet.</p>
              )}
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md text-sm text-yellow-800">
              <p className="font-medium">Bemærk</p>
              <p className="mt-1">
                Den offentlige vurdering kan afvige fra markedsprisen. Mæglerne vil give dig deres professionelle vurdering baseret på aktuelle markedsforhold.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-800">Dokumenter</h3>
              <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-700">
                <p>
                  HouseHub henter automatisk relevante dokumenter for din bolig, så mæglerne får alle nødvendige oplysninger til at give dig det bedste tilbud.
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => navigate('/saelger/salgsoensker')}>
                Tilbage
              </Button>
              <Button onClick={handleFinalizeCase}>
                Afslut og opret sag
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PriceInfo;