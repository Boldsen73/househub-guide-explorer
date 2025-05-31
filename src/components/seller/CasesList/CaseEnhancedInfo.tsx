
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Euro, Clock, Target, FileText, TrendingUp } from 'lucide-react';

interface Case {
  expectedPrice?: string;
  flexiblePrice?: boolean;
  timeframe?: number;
  timeframeType?: string;
  priorities?: {
    speed: boolean;
    price: boolean;
    service: boolean;
  };
  marketingBudget?: number;
  freeIfNotSold?: boolean;
  specialRequests?: string;
  notes?: string;
}

interface CaseEnhancedInfoProps {
  case_: Case;
}

const CaseEnhancedInfo: React.FC<CaseEnhancedInfoProps> = ({ case_ }) => {
  const formatTimeframe = (timeframe?: number, timeframeType?: string) => {
    if (!timeframe) return null;
    return `${timeframe} ${timeframeType === 'months' ? 'måneder' : 'uger'}`;
  };

  const formatPriorities = (priorities?: { speed: boolean; price: boolean; service: boolean }) => {
    if (!priorities) return [];
    const result = [];
    if (priorities.speed) result.push('Hurtigt salg');
    if (priorities.price) result.push('Høj pris');
    if (priorities.service) result.push('God service');
    return result;
  };

  const hasEnhancedInfo = case_.expectedPrice || case_.timeframe || case_.priorities || 
                          case_.specialRequests || case_.notes || case_.marketingBudget;

  if (!hasEnhancedInfo) return null;

  return (
    <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        Dine ønsker og prioriteter
      </h4>
      
      {case_.expectedPrice && (
        <div className="flex items-center gap-2">
          <Euro className="h-4 w-4 text-green-600" />
          <span className="text-sm text-gray-600">Forventet pris:</span>
          <span className="font-medium text-green-700">{case_.expectedPrice}</span>
          {case_.flexiblePrice && (
            <Badge variant="outline" className="text-xs">Fleksibel</Badge>
          )}
        </div>
      )}

      {case_.timeframe && (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-orange-600" />
          <span className="text-sm text-gray-600">Ønsket tidsramme:</span>
          <span className="font-medium">{formatTimeframe(case_.timeframe, case_.timeframeType)}</span>
        </div>
      )}

      {case_.priorities && formatPriorities(case_.priorities).length > 0 && (
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-purple-600" />
          <span className="text-sm text-gray-600">Prioriteter:</span>
          <div className="flex gap-1">
            {formatPriorities(case_.priorities).map((priority, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {priority}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {case_.marketingBudget && (
        <div className="flex items-center gap-2">
          <Euro className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-gray-600">Markedsføringsbudget:</span>
          <span className="font-medium">{case_.marketingBudget.toLocaleString()} kr</span>
          {case_.freeIfNotSold && (
            <Badge variant="outline" className="text-xs">Gratis hvis ikke solgt</Badge>
          )}
        </div>
      )}

      {(case_.specialRequests || case_.notes) && (
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 text-gray-600 mt-0.5" />
          <div>
            <span className="text-sm text-gray-600">Kommentarer:</span>
            <p className="text-sm mt-1 text-gray-700">
              {case_.specialRequests || case_.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseEnhancedInfo;
