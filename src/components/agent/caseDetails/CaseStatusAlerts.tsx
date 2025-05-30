
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CaseStatusAlertsProps {
  agentStatus: string;
  caseId: string;
  onDownloadPDF: () => void;
}

const CaseStatusAlerts: React.FC<CaseStatusAlertsProps> = ({
  agentStatus,
  caseId,
  onDownloadPDF
}) => {
  const navigate = useNavigate();

  if (agentStatus === 'offer_submitted') {
    return (
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-blue-800 font-medium">
                Du har allerede afgivet et tilbud på denne sag
              </span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/maegler/rediger-tilbud/${caseId}`)}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <Edit className="h-4 w-4 mr-2" />
                Ret tilbud
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onDownloadPDF}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (agentStatus === 'rejected') {
    return (
      <Card className="mb-6 border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-red-800 font-medium">
              Du har afvist denne sag – du kan fortryde under Afviste sager
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (agentStatus === 'archived') {
    return (
      <Card className="mb-6 border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-green-800 font-medium">
                Tillykke! Du har vundet denne sag
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onDownloadPDF}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default CaseStatusAlerts;
