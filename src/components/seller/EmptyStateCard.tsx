
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Home, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const EmptyStateCard = () => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Velkommen til HouseHub
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Du har ikke oprettet nogen sager endnu. Kom i gang ved at oprette din første sag og få tilbud fra kvalificerede mæglere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Opret sag</h3>
            <p className="text-sm text-gray-600 text-center">
              Udfyld dine boligoplysninger
            </p>
          </div>
          
          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Modtag tilbud</h3>
            <p className="text-sm text-gray-600 text-center">
              Kvalificerede mæglere byder på din sag
            </p>
          </div>
          
          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Vælg mægler</h3>
            <p className="text-sm text-gray-600 text-center">
              Sammenlign og vælg det bedste tilbud
            </p>
          </div>
        </div>

        <Link to={ROUTES.SELLER_PROPERTY_DATA}>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-5 w-5" />
            Opret din første sag
          </Button>
        </Link>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            ✓ Gratis at oprette sag • ✓ Sammenlign tilbud • ✓ Vælg den bedste mægler
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyStateCard;
