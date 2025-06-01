
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, MapPin, Clock } from 'lucide-react';

interface CaseHeaderProps {
  address: string;
  price: string;
  type: string;
  size: string;
  rooms: string;
  buildYear: number;
  municipality: string;
  energyLabel: string;
  timeRemaining?: {
    text: string;
    color: string;
    bgColor: string;
  };
  agentStatus: string;
  detailedCaseData?: any;
}

const CaseHeader: React.FC<CaseHeaderProps> = ({
  address,
  price,
  type,
  size,
  rooms,
  buildYear,
  municipality,
  energyLabel,
  timeRemaining,
  agentStatus,
  detailedCaseData
}) => {
  const formatPrice = (price: string) => {
    return price.replace(/(\d)\.(\d{3})\.(\d{3})/, '$1.$2.$3');
  };

  // Use detailed data when available, fallback to basic data
  const displayType = detailedCaseData?.type || detailedCaseData?.propertyType || type;
  const displaySize = detailedCaseData?.size || size;
  const displayRooms = detailedCaseData?.rooms || rooms;
  const displayBuildYear = detailedCaseData?.buildYear || buildYear;
  const displayMunicipality = detailedCaseData?.municipality || municipality;
  const displayEnergyLabel = detailedCaseData?.energyLabel || energyLabel;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Home className="h-6 w-6 text-blue-600" />
            {address}
          </CardTitle>
          <div className="flex flex-col gap-2 items-end">
            <Badge className="bg-green-100 text-green-800">
              {formatPrice(price)}
            </Badge>
            {timeRemaining && agentStatus === 'active' && (
              <Badge className={`${timeRemaining.bgColor} ${timeRemaining.color}`}>
                <Clock className="h-3 w-3 mr-1" />
                Tilbudsfrist: {timeRemaining.text}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-sm text-gray-500">Type</span>
            <p className="font-semibold">{displayType}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Størrelse</span>
            <p className="font-semibold">{displaySize}{typeof displaySize === 'number' ? ' m²' : ''}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Værelser</span>
            <p className="font-semibold">{displayRooms}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Byggeår</span>
            <p className="font-semibold">{displayBuildYear}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">{displayMunicipality}</span>
          <Badge variant="outline" className="ml-2">
            Energimærke {displayEnergyLabel}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseHeader;
