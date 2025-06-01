
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

interface WelcomeHeaderProps {
  userName: string;
  hasAnyCases: boolean;
}

const WelcomeHeader = ({ userName, hasAnyCases }: WelcomeHeaderProps) => {
  return (
    <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Velkommen{userName ? `, ${userName}` : ''}
              </h1>
              <p className="text-blue-100">
                {hasAnyCases ? 'Administrer dine aktive sager' : 'Kom i gang med at sælge din bolig'}
              </p>
            </div>
          </div>
          
          <div className="hidden md:block">
            <Link to={ROUTES.SELLER_PROPERTY_DATA}>
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                <Plus className="mr-2 h-4 w-4" />
                Ny sag
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Mobile button */}
        <div className="md:hidden mt-4">
          <Link to={ROUTES.SELLER_PROPERTY_DATA}>
            <Button variant="secondary" className="w-full bg-white text-blue-600 hover:bg-gray-100">
              <Plus className="mr-2 h-4 w-4" />
              Opret ny sag
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeHeader;
