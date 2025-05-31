
import React from 'react';
import { Badge } from '@/components/ui/badge';
import CaseCard from './CasesList/CaseCard';

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

interface CasesListProps {
  cases: Case[];
}

const CasesList: React.FC<CasesListProps> = ({ cases }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mine sager</h2>
        <Badge variant="outline" className="text-sm">
          {cases.length} {cases.length === 1 ? 'sag' : 'sager'}
        </Badge>
      </div>
      
      <div className="space-y-4">
        {cases.map((case_) => (
          <CaseCard key={case_.id} case_={case_} />
        ))}
      </div>
    </div>
  );
};

export default CasesList;
