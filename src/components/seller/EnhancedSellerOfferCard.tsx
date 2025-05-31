
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TrendingUp } from 'lucide-react';
import OfferHeader from './EnhancedSellerOfferCard/OfferHeader';
import OfferMetricsGrid from './EnhancedSellerOfferCard/OfferMetricsGrid';
import PerformanceSection from './PerformanceSection';
import MarketingMethodsSection from './MarketingMethodsSection';
import MessageThread from './MessageThread';
import type { OfferWithMarketing } from '@/types/case';

interface EnhancedSellerOfferCardProps {
  offer: OfferWithMarketing;
  isSelected: boolean;
  onSelect: (offer: OfferWithMarketing) => void;
  onAskQuestion?: (offerId: number) => void;
  hideRealtorName?: boolean;
  showTimestamp?: boolean;
}

const EnhancedSellerOfferCard: React.FC<EnhancedSellerOfferCardProps> = ({
  offer,
  isSelected,
  onSelect,
  onAskQuestion,
  hideRealtorName = true,
  showTimestamp = true
}) => {
  const [showFullStrategy, setShowFullStrategy] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(Math.random() > 0.7);
  
  const commissionPercentage = ((offer.commissionValue / offer.priceValue) * 100).toFixed(1);
  
  const anonymizedAgencyName = `Mægler ${offer.id}`;
  const anonymizedAgentName = `Mægler ${offer.id}`;

  const performanceData = {
    avgCommission: offer.id === 1 ? 1.4 : offer.id === 2 ? 1.6 : 1.2,
    avgTimeOnMarket: offer.id === 1 ? 38 : offer.id === 2 ? 42 : 35,
    avgPriceReduction: offer.id === 1 ? -4.1 : offer.id === 2 ? -5.2 : -3.8
  };

  const scoreBreakdown = {
    commission: Math.round(offer.score * 0.25),
    timeline: Math.round(offer.score * 0.23),
    performance: Math.round(offer.score * 0.27),
    experience: Math.round(offer.score * 0.25)
  };

  const strategyText = offer.salesStrategy || "Mægleren tilbyder professionel rådgivning og markedsføring af din bolig gennem flere kanaler for at sikre det bedste salgsresultat.";
  const shouldTruncateStrategy = strategyText.length > 120;
  const displayStrategy = showFullStrategy || !shouldTruncateStrategy 
    ? strategyText 
    : strategyText.substring(0, 120) + "...";

  let cardClasses = "transition-all duration-300 ease-in-out border-2 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 mb-4";
  if (isSelected) {
    cardClasses += " ring-2 ring-blue-500 shadow-lg border-blue-300 bg-blue-50";
  } else {
    cardClasses += " border-gray-200 hover:border-gray-300";
  }

  return (
    <Card className={cardClasses}>
      <CardHeader className="pb-4">
        <OfferHeader
          score={offer.score}
          scoreBreakdown={scoreBreakdown}
          anonymizedAgencyName={anonymizedAgencyName}
          anonymizedAgentName={anonymizedAgentName}
          submittedAt={offer.submittedAt}
          showTimestamp={showTimestamp}
          isSelected={isSelected}
          hasNewMessage={hasNewMessage}
          onSelect={() => onSelect(offer)}
          onToggleMessages={() => setShowMessages(!showMessages)}
        />
      </CardHeader>

      <CardContent className="space-y-4">
        <OfferMetricsGrid
          priceValue={offer.priceValue}
          commissionValue={offer.commissionValue}
          commissionPercentage={commissionPercentage}
          bindingPeriod={offer.bindingPeriod}
          marketingPackage={offer.marketingPackage}
        />

        <PerformanceSection performanceData={performanceData} />

        <Separator />

        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Salgsstrategi
          </h4>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed">{displayStrategy}</p>
            {shouldTruncateStrategy && (
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => setShowFullStrategy(!showFullStrategy)}
                className="mt-2 p-0 h-auto text-blue-600"
              >
                {showFullStrategy ? 'Vis mindre' : 'Læs mere'}
              </Button>
            )}
          </div>
        </div>

        <MarketingMethodsSection marketingMethods={offer.marketingMethods} />

        <MessageThread
          agentName={anonymizedAgentName}
          hasNewMessage={hasNewMessage}
          showMessages={showMessages}
          onToggle={() => setShowMessages(!showMessages)}
        />
      </CardContent>
    </Card>
  );
};

export default EnhancedSellerOfferCard;
