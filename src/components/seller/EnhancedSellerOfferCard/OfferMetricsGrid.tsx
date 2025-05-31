
import React from 'react';
import { DollarSign, Calendar, Award } from 'lucide-react';

interface OfferMetricsGridProps {
  priceValue: number;
  commissionValue: number;
  commissionPercentage: string;
  bindingPeriod: string;
  marketingPackage: string;
}

const OfferMetricsGrid: React.FC<OfferMetricsGridProps> = ({
  priceValue,
  commissionValue,
  commissionPercentage,
  bindingPeriod,
  marketingPackage
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('da-DK').format(price);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="text-center p-3 bg-white rounded-lg border">
        <DollarSign className="h-5 w-5 text-green-600 mx-auto mb-1" />
        <div className="text-xs text-gray-600">Forventet pris</div>
        <div className="font-bold text-green-700 text-sm">{formatPrice(priceValue)} kr</div>
      </div>
      
      <div className="text-center p-3 bg-white rounded-lg border">
        <DollarSign className="h-5 w-5 text-blue-600 mx-auto mb-1" />
        <div className="text-xs text-gray-600">Salær</div>
        <div className="font-bold text-sm">{commissionPercentage}% / {formatPrice(commissionValue)} kr</div>
      </div>
      
      <div className="text-center p-3 bg-white rounded-lg border">
        <Calendar className="h-5 w-5 text-purple-600 mx-auto mb-1" />
        <div className="text-xs text-gray-600">Bindingsperiode</div>
        <div className="font-bold text-sm">{bindingPeriod}</div>
      </div>
      
      <div className="text-center p-3 bg-white rounded-lg border">
        <Award className="h-5 w-5 text-orange-600 mx-auto mb-1" />
        <div className="text-xs text-gray-600">Markedsføring</div>
        <div className="font-bold text-sm">{marketingPackage}</div>
      </div>
    </div>
  );
};

export default OfferMetricsGrid;
