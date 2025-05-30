
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface SubmittedBid {
  expectedPrice: string;
  commission: string;
  bindingPeriod: string;
  marketingPackage: string;
  comment: string;
  houseHubScore: number;
  bidDeviation: string;
  submittedAt: string;
  sellerViewed: boolean;
  sellerViewedAt?: string;
}

interface CaseSubmittedBidProps {
  submittedBid: SubmittedBid;
}

const CaseSubmittedBid: React.FC<CaseSubmittedBidProps> = ({ submittedBid }) => {
  const formatSubmissionTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('da-DK', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Dit afgivne tilbud</CardTitle>
          <div className="flex gap-4">
            <Badge variant="outline" className="text-sm">
              HouseHub Score: {submittedBid.houseHubScore}/100
            </Badge>
            <Badge variant="outline" className="text-sm">
              Budafstand: {submittedBid.bidDeviation}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Indsendt d. {formatSubmissionTime(submittedBid.submittedAt)}
            </span>
            {submittedBid.sellerViewed && (
              <div className="flex items-center gap-1 text-green-600">
                <Check className="h-4 w-4" />
                <span className="text-sm">Sælger har åbnet dit tilbud</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="text-sm text-gray-500">Salgspris</span>
            <p className="text-lg font-semibold text-green-600">{submittedBid.expectedPrice}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Salær</span>
            <p className="text-lg font-semibold">{submittedBid.commission}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Liggetid</span>
            <p className="text-lg font-semibold">{submittedBid.bindingPeriod}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Markedsføring</span>
            <p className="text-lg font-semibold">{submittedBid.marketingPackage}</p>
          </div>
        </div>
        <div className="mt-4">
          <span className="text-sm text-gray-500">Kommentar til sælger</span>
          <p className="text-gray-700 mt-1">{submittedBid.comment}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseSubmittedBid;
