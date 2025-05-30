
import React from 'react';
import { Button } from '@/components/ui/button';
import { DollarSign, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CaseActionsProps {
  agentStatus: string;
  caseId: string;
}

const CaseActions: React.FC<CaseActionsProps> = ({ agentStatus, caseId }) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4">
      {agentStatus === 'active' && (
        <Button 
          size="lg" 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => navigate(`/maegler/afgiv-tilbud/${caseId}`)}
        >
          <DollarSign className="h-5 w-5 mr-2" />
          Afgiv tilbud
        </Button>
      )}
      
      {agentStatus === 'offer_submitted' && (
        <Button 
          size="lg" 
          variant="outline"
          onClick={() => navigate(`/maegler/rediger-tilbud/${caseId}`)}
        >
          <Edit className="h-5 w-5 mr-2" />
          Ret tilbud
        </Button>
      )}
      
      <Button 
        variant="outline" 
        onClick={() => navigate('/maegler/gennemse-sager')}
      >
        Tilbage til oversigt
      </Button>
    </div>
  );
};

export default CaseActions;
