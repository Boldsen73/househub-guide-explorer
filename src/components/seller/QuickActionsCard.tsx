
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, MessageCircle, Home } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface QuickActionsCardProps {
  caseDetails: any;
  showingCompleted: boolean;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  caseDetails,
  showingCompleted
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Hurtige handlinger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {(showingCompleted || (caseDetails.offers?.length || 0) > 0) && (
          <Link to={ROUTES.SELLER_OFFERS} className="block">
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="h-4 w-4 mr-2" />
              Se tilbud
            </Button>
          </Link>
        )}
        <Link to={ROUTES.SELLER_MESSAGES} className="block">
          <Button variant="outline" className="w-full justify-start">
            <MessageCircle className="h-4 w-4 mr-2" />
            Beskeder
          </Button>
        </Link>
        <Link to={ROUTES.SELLER_DASHBOARD} className="block">
          <Button variant="outline" className="w-full justify-start">
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
