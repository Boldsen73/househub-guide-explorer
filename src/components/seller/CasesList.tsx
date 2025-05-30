
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, MapPin, Calendar, TrendingUp, MessageSquare, Clock, Target, Euro, FileText } from 'lucide-react';

interface Case {
  id: string;
  address: string;
  municipality: string;
  type: string;
  size: string;
  price: string;
  buildYear: number;
  status: string;
  sagsnummer: string;
  // Enhanced fields
  propertyType?: string;
  expectedPrice?: string;
  expectedPriceValue?: number;
  timeframe?: number;
  timeframeType?: string;
  priorities?: {
    speed: boolean;
    price: boolean;
    service: boolean;
  };
  specialRequests?: string;
  notes?: string;
  rooms?: string;
  flexiblePrice?: boolean;
  marketingBudget?: number;
  freeIfNotSold?: boolean;
}

interface CasesListProps {
  cases: Case[];
}

const CasesList: React.FC<CasesListProps> = ({ cases }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktiv';
      case 'draft':
        return 'Kladde';
      case 'completed':
        return 'Afsluttet';
      default:
        return status;
    }
  };

  const formatTimeframe = (timeframe?: number, timeframeType?: string) => {
    if (!timeframe) return null;
    return `${timeframe} ${timeframeType === 'months' ? 'måneder' : 'uger'}`;
  };

  const formatPriorities = (priorities?: { speed: boolean; price: boolean; service: boolean }) => {
    if (!priorities) return [];
    const result = [];
    if (priorities.speed) result.push('Hurtigt salg');
    if (priorities.price) result.push('Høj pris');
    if (priorities.service) result.push('God service');
    return result;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mine sager</h2>
        <Badge variant="outline" className="text-sm">
          {cases.length} {cases.length === 1 ? 'sag' : 'sager'}
        </Badge>
      </div>
      
      <div className="space-y-4">
        {cases.map((case_) => (
          <Card key={case_.id} className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Home className="h-5 w-5 text-blue-600" />
                    {case_.address}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {case_.municipality}
                    </span>
                    <span>Sagsnr: {case_.sagsnummer}</span>
                  </div>
                </div>
                <Badge className={getStatusColor(case_.status)}>
                  {getStatusText(case_.status)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Basic Property Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Type</div>
                  <div className="font-medium">{case_.propertyType || case_.type}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Størrelse</div>
                  <div className="font-medium">{case_.size}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Værelser</div>
                  <div className="font-medium">{case_.rooms || 'Ikke angivet'}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Byggeår</div>
                  <div className="font-medium">{case_.buildYear}</div>
                </div>
              </div>

              {/* Enhanced Information */}
              {(case_.expectedPrice || case_.timeframe || case_.priorities || case_.specialRequests || case_.notes) && (
                <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Dine ønsker og prioriteter
                  </h4>
                  
                  {case_.expectedPrice && (
                    <div className="flex items-center gap-2">
                      <Euro className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600">Forventet pris:</span>
                      <span className="font-medium text-green-700">{case_.expectedPrice}</span>
                      {case_.flexiblePrice && (
                        <Badge variant="outline" className="text-xs">Fleksibel</Badge>
                      )}
                    </div>
                  )}

                  {case_.timeframe && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-gray-600">Ønsket tidsramme:</span>
                      <span className="font-medium">{formatTimeframe(case_.timeframe, case_.timeframeType)}</span>
                    </div>
                  )}

                  {case_.priorities && formatPriorities(case_.priorities).length > 0 && (
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-gray-600">Prioriteter:</span>
                      <div className="flex gap-1">
                        {formatPriorities(case_.priorities).map((priority, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {priority}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {case_.marketingBudget && (
                    <div className="flex items-center gap-2">
                      <Euro className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Markedsføringsbudget:</span>
                      <span className="font-medium">{case_.marketingBudget.toLocaleString()} kr</span>
                      {case_.freeIfNotSold && (
                        <Badge variant="outline" className="text-xs">Gratis hvis ikke solgt</Badge>
                      )}
                    </div>
                  )}

                  {(case_.specialRequests || case_.notes) && (
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-gray-600 mt-0.5" />
                      <div>
                        <span className="text-sm text-gray-600">Kommentarer:</span>
                        <p className="text-sm mt-1 text-gray-700">
                          {case_.specialRequests || case_.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link to={`/saelger/min-sag`} className="flex-1">
                  <Button className="w-full" variant="default">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Se tilbud
                  </Button>
                </Link>
                <Link to={`/saelger/beskeder`} className="flex-1">
                  <Button className="w-full" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Beskeder
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CasesList;
