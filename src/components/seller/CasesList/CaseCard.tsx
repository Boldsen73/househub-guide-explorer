
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, MapPin, TrendingUp, MessageSquare } from 'lucide-react';
import CaseBasicInfo from './CaseBasicInfo';
import CaseEnhancedInfo from './CaseEnhancedInfo';

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

interface CaseCardProps {
  case_: Case;
}

const CaseCard: React.FC<CaseCardProps> = ({ case_ }) => {
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

  return (
    <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
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
        <CaseBasicInfo case_={case_} />
        <CaseEnhancedInfo case_={case_} />

        <div className="flex gap-3">
          <Link to={`/seller/my-case`} className="flex-1">
            <Button className="w-full" variant="default">
              <TrendingUp className="h-4 w-4 mr-2" />
              Se tilbud
            </Button>
          </Link>
          <Link to={`/seller/messages`} className="flex-1">
            <Button className="w-full" variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Beskeder
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseCard;
