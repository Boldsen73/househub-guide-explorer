
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface CaseOverviewCardProps {
  caseDetails: any;
  bookedShowingDetails: any;
  showingCompleted: boolean;
}

const CaseOverviewCard: React.FC<CaseOverviewCardProps> = ({
  caseDetails,
  bookedShowingDetails,
  showingCompleted
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Status Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Badge variant={
              showingCompleted || (caseDetails.offers?.length || 0) > 0 ? 'default' : 'secondary'
            }>
              {showingCompleted || (caseDetails.offers?.length || 0) > 0 ? 'Tilbud klar' :
                bookedShowingDetails ? 'Fremvisning planlagt' : 'Aktiv'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">
                {(caseDetails.agentRegistrations?.length || 0)}
              </div>
              <div className="text-xs text-gray-600">Tilmeldte mæglere</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">
                {(caseDetails.offers?.length || 0)}
              </div>
              <div className="text-xs text-gray-600">Modtagne tilbud</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseOverviewCard;
