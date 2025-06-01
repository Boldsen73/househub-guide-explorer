
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, MapPin, Building, Calendar, DollarSign, TrendingUp } from 'lucide-react';

interface PropertyDetailsCardProps {
  caseDetails: any;
}

const PropertyDetailsCard: React.FC<PropertyDetailsCardProps> = ({ caseDetails }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Boligoplysninger
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <p className="font-medium text-gray-900">{caseDetails.address}</p>
                <p className="text-sm text-gray-600">{caseDetails.municipality}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium">{caseDetails.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Home className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Størrelse</p>
                <p className="font-medium">{caseDetails.size} m²</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Byggeår</p>
                <p className="font-medium">{caseDetails.constructionYear || caseDetails.buildYear}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Forventet pris</p>
                <p className="font-medium text-green-600">{caseDetails.price}</p>
              </div>
            </div>

            {caseDetails.energyLabel && (
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Energimærke</p>
                  <p className="font-medium">{caseDetails.energyLabel}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDetailsCard;
