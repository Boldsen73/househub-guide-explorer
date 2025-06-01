
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface AgentRegistrationsCardProps {
  agentRegistrations: any[];
}

const AgentRegistrationsCard: React.FC<AgentRegistrationsCardProps> = ({
  agentRegistrations
}) => {
  if (agentRegistrations.length === 0) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Tilmeldte Mæglere
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {agentRegistrations.map((registration: any) => (
            <div key={registration.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{registration.agencyName}</p>
                <Badge variant={registration.status === 'registered' ? 'default' : 'secondary'}>
                  {registration.status === 'registered' ? 'Tilmeldt' : 'Afvist'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">v. {registration.agentName}</p>
              <p className="text-xs text-gray-500">
                Tilmeldt: {new Date(registration.registeredAt).toLocaleDateString('da-DK')}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentRegistrationsCard;
