
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import HouseHubScore from '../HouseHubScore';

interface OfferHeaderProps {
  score: number;
  scoreBreakdown: any;
  anonymizedAgencyName: string;
  anonymizedAgentName: string;
  submittedAt: string;
  showTimestamp: boolean;
  isSelected: boolean;
  hasNewMessage: boolean;
  onSelect: () => void;
  onToggleMessages: () => void;
}

const OfferHeader: React.FC<OfferHeaderProps> = ({
  score,
  scoreBreakdown,
  anonymizedAgencyName,
  anonymizedAgentName,
  submittedAt,
  showTimestamp,
  isSelected,
  hasNewMessage,
  onSelect,
  onToggleMessages
}) => {
  const formatSubmittedDate = (dateString: string) => {
    const date = new Date(dateString);
    return `Modtaget d. ${date.getDate()}. ${date.toLocaleDateString('da-DK', { month: 'long' })} ${date.getFullYear()}`;
  };

  return (
    <div className="flex items-start justify-between">
      <div className="flex-grow">
        <div className="flex items-center gap-4 mb-3">
          <HouseHubScore 
            score={score} 
            breakdown={scoreBreakdown}
            size="lg"
            showBreakdown
          />
          
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
              {anonymizedAgencyName}
            </h3>
            <p className="text-base text-gray-600 font-medium">
              v. {anonymizedAgentName}
            </p>
            {showTimestamp && (
              <p className="text-sm text-gray-500 mt-1">
                {formatSubmittedDate(submittedAt)}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 ml-4">
        <Button
          onClick={onSelect}
          className={`whitespace-nowrap transition-all duration-300 ease-in-out hover:scale-105 ${isSelected ? 'bg-green-600 hover:bg-green-700' : ''}`}
        >
          {isSelected ? 'Valgt' : 'Vælg denne mægler'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleMessages}
          className="whitespace-nowrap relative transition-all duration-300 ease-in-out hover:scale-105"
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Skriv besked til mægler
          {hasNewMessage && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-[1.25rem] h-5">
              1
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
};

export default OfferHeader;
