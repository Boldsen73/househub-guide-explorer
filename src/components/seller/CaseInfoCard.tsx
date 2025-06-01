
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CaseInfoCardProps {
  caseDetails: any;
}

const CaseInfoCard: React.FC<CaseInfoCardProps> = ({ caseDetails }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sag information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Sagsnummer:</span>
          <span className="font-mono">{caseDetails.sagsnummer}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Oprettet:</span>
          <span>{new Date(caseDetails.createdAt).toLocaleDateString('da-DK')}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseInfoCard;
