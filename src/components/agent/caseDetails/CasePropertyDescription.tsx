
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CasePropertyDescriptionProps {
  detailedCaseData?: any;
  fallbackDescription: string;
}

const CasePropertyDescription: React.FC<CasePropertyDescriptionProps> = ({
  detailedCaseData,
  fallbackDescription
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Beskrivelse og sælgers kommentarer</CardTitle>
      </CardHeader>
      <CardContent>
        {detailedCaseData?.notes && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-blue-800">Sælgers beskrivelse af boligen:</h4>
            <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg">{detailedCaseData.notes}</p>
          </div>
        )}

        {detailedCaseData?.comments && detailedCaseData.comments !== detailedCaseData.notes && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-blue-800">Yderligere kommentarer:</h4>
            <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg">{detailedCaseData.comments}</p>
          </div>
        )}

        {detailedCaseData?.specialRequests && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-blue-800">Særlige ønsker fra sælger:</h4>
            <p className="text-gray-700 leading-relaxed bg-yellow-50 p-4 rounded-lg border border-yellow-200">{detailedCaseData.specialRequests}</p>
          </div>
        )}

        {detailedCaseData?.priorities && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-blue-800">Sælgers prioriteter:</h4>
            <div className="flex flex-wrap gap-2">
              {detailedCaseData.priorities.speed && <Badge variant="outline" className="bg-blue-50 text-blue-700">Hurtig salg</Badge>}
              {detailedCaseData.priorities.price && <Badge variant="outline" className="bg-green-50 text-green-700">Højeste pris</Badge>}
              {detailedCaseData.priorities.service && <Badge variant="outline" className="bg-purple-50 text-purple-700">Bedste service</Badge>}
            </div>
          </div>
        )}

        {detailedCaseData?.timeframe && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-blue-800">Forventet tidsramme for salg:</h4>
            <p className="text-gray-700">{detailedCaseData.timeframe} {detailedCaseData.timeframeType === 'months' ? 'måneder' : 'uger'}</p>
          </div>
        )}

        {detailedCaseData?.flexiblePrice !== undefined && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-blue-800">Prisfleksibilitet:</h4>
            <p className="text-gray-700">{detailedCaseData.flexiblePrice ? 'Sælger er åben for forhandling' : 'Fast pris ønskes'}</p>
          </div>
        )}

        {!detailedCaseData?.notes && !detailedCaseData?.comments && (
          <p className="text-gray-700 leading-relaxed">{fallbackDescription}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CasePropertyDescription;
