
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Clock3 } from 'lucide-react';

interface SalePreferencesCardProps {
  caseDetails: any;
}

const SalePreferencesCard: React.FC<SalePreferencesCardProps> = ({ caseDetails }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Dine Salgspræferencer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {caseDetails.timeframe && (
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Tidsfrist</p>
                  <p className="font-medium">{caseDetails.timeframe} {caseDetails.timeframeType === 'months' ? 'måneder' : 'uger'}</p>
                </div>
              </div>
            )}

            {caseDetails.priorities && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Prioriteter</p>
                <div className="flex flex-wrap gap-2">
                  {caseDetails.priorities.speed && <Badge variant="secondary">Hurtig salg</Badge>}
                  {caseDetails.priorities.price && <Badge variant="secondary">Højeste pris</Badge>}
                  {caseDetails.priorities.service && <Badge variant="secondary">Bedste service</Badge>}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {caseDetails.flexiblePrice !== undefined && (
              <div>
                <p className="text-sm text-gray-600">Prisfleksibilitet</p>
                <p className="font-medium">{caseDetails.flexiblePrice ? 'Ja, jeg er åben for forhandling' : 'Nej, prisen er fast'}</p>
              </div>
            )}

            {caseDetails.specialRequests && (
              <div>
                <p className="text-sm text-gray-600">Særlige ønsker</p>
                <p className="font-medium text-sm">{caseDetails.specialRequests}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalePreferencesCard;
