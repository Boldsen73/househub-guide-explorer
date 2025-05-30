
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useState } from 'react';
import MarketingSection from '@/components/agent/MarketingSection';
import { useAgentCases } from '@/hooks/useAgentCases';
import { getCurrentUser } from '@/utils/authentication';

const SubmitOffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cases } = useAgentCases();
  const currentUser = getCurrentUser();
  
  // Find the actual case from the real data
  const caseData = cases.find(c => c.id === parseInt(id || '0'));

  const [offerData, setOfferData] = useState({
    valuation: '',
    commission: '', // Now in DKK instead of percentage
    marketingBudget: '',
    timeline: '',
    strategy: '',
    message: '',
    marketing: [] as string[]
  });

  const validityOptions = [
    { value: '1-month', label: '1 måned' },
    { value: '2-months', label: '2 måneder' },
    { value: '3-months', label: '3 måneder' },
    { value: '4-months', label: '4 måneder' },
    { value: '5-months', label: '5 måneder' },
    { value: '6-months', label: '6 måneder' },
    { value: '9-months', label: '9 måneder' },
    { value: '12-months', label: '12 måneder' },
    { value: '2-years', label: '2 år' },
    { value: 'no-limit', label: 'Ingen frist' }
  ];

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b border-gray-100">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <Home className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">HouseHub</span>
                <span className="text-lg text-gray-500">| Mægler Portal</span>
              </Link>
              
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {currentUser?.name || 'Mægler'} - Aktiv
                </Badge>
                <Button variant="ghost" size="sm">
                  Log ud
                </Button>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="container mx-auto px-6 py-12">
          <p className="text-center text-gray-500">Sag ikke fundet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">HouseHub</span>
              <span className="text-lg text-gray-500">| Mægler Portal</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                {currentUser?.name || 'Mægler'} - Aktiv
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => navigate('/maegler/gennemse-sager')}>
                Log ud
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/maegler/gennemse-sager" className="text-blue-600 hover:underline mb-2 inline-block">
              ← Tilbage til sager
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Afgiv tilbud
            </h1>
            <p className="text-gray-600">
              {caseData.address} - {caseData.type}, {caseData.size}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Summary */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg border-0 sticky top-8">
                <CardHeader>
                  <CardTitle>Bolig oversigt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Adresse</h3>
                    <p className="text-gray-600">{caseData.address}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Type:</span> {caseData.type}
                    </div>
                    <div>
                      <span className="font-medium">Størrelse:</span> {caseData.size}
                    </div>
                    <div>
                      <span className="font-medium">Værelser:</span> {caseData.rooms}
                    </div>
                    <div>
                      <span className="font-medium">Byggeår:</span> {caseData.constructionYear}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">Sælgers forventning</h3>
                    <p className="text-xl font-bold text-blue-600">{caseData.price}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Offer Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Dit tilbud</CardTitle>
                  <p className="text-gray-600">Udfyld alle felter for at afgive dit tilbud</p>
                </CardHeader>
                <CardContent className="p-8">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="valuation">Din vurdering (DKK) *</Label>
                        <Input
                          id="valuation"
                          type="number"
                          value={offerData.valuation}
                          onChange={(e) => setOfferData({...offerData, valuation: e.target.value})}
                          placeholder="4150000"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="commission">Salær (DKK) *</Label>
                        <Input
                          id="commission"
                          type="number"
                          value={offerData.commission}
                          onChange={(e) => setOfferData({...offerData, commission: e.target.value})}
                          placeholder="65000"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="marketingBudget">Markedsføringsbudget (DKK) *</Label>
                        <Input
                          id="marketingBudget"
                          type="number"
                          value={offerData.marketingBudget}
                          onChange={(e) => setOfferData({...offerData, marketingBudget: e.target.value})}
                          placeholder="75000"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timeline">Tilbudets gyldighed *</Label>
                        <Select onValueChange={(value) => setOfferData({...offerData, timeline: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Vælg gyldighed" />
                          </SelectTrigger>
                          <SelectContent>
                            {validityOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Personlig besked til sælger</Label>
                      <Textarea
                        id="message"
                        value={offerData.message}
                        onChange={(e) => setOfferData({...offerData, message: e.target.value})}
                        placeholder="Fortæl om dig selv og hvorfor du er den rette mægler..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </form>
                </CardContent>
              </Card>

              <MarketingSection
                selectedMarketing={offerData.marketing}
                onMarketingChange={(marketing) => setOfferData({...offerData, marketing})}
                strategy={offerData.strategy}
                onStrategyChange={(strategy) => setOfferData({...offerData, strategy})}
              />

              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">Tilbuds oversigt</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Vurdering:</span>
                        <span className="font-medium">{offerData.valuation ? `${parseInt(offerData.valuation).toLocaleString()} DKK` : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Salær:</span>
                        <span className="font-medium">{offerData.commission ? `${parseInt(offerData.commission).toLocaleString()} DKK` : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Markedsføring:</span>
                        <span className="font-medium">{offerData.marketingBudget ? `${parseInt(offerData.marketingBudget).toLocaleString()} DKK` : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valgte kanaler:</span>
                        <span className="font-medium">{offerData.marketing.length} kanaler</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-6">
                    <Link to="/maegler/gennemse-sager" className="flex-1">
                      <Button type="button" variant="outline" className="w-full">
                        Gem som kladde
                      </Button>
                    </Link>
                    <Link to="/maegler/betingelser" className="flex-1">
                      <Button className="w-full">
                        Fortsæt til betingelser
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitOffer;
