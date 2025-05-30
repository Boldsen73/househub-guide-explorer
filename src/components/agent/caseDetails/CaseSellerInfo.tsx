
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface CaseSellerInfoProps {
  sellerName?: string;
  sellerEmail?: string;
  sellerPhone?: string;
}

const CaseSellerInfo: React.FC<CaseSellerInfoProps> = ({
  sellerName,
  sellerEmail,
  sellerPhone
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Sælger Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-sm text-gray-500">Navn</span>
            <p className="font-semibold">{sellerName || 'Ikke angivet'}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Email</span>
            <p className="font-semibold">{sellerEmail || 'Ikke angivet'}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Telefon</span>
            <p className="font-semibold">{sellerPhone || 'Ikke angivet'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseSellerInfo;
