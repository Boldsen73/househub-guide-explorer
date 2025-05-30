
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

        {detailedCaseData?.sellerPriorities && Array.isArray(detailedCaseData.sellerPriorities) && detailedCaseData.sellerPriorities.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-blue-800">Sælgers prioriteter:</h4>
            <div className="flex flex-wrap gap-2">
              {detailedCaseData.sellerPriorities.map((priority, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                  {priority}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {detailedCaseData?.sellerExpectedTimeframe && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-blue-800">Forventet tidsramme for salg:</h4>
            <p className="text-gray-700">{detailedCaseData.sellerExpectedTimeframe}</p>
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
