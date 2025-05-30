
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Home, Archive } from 'lucide-react';
import { User, Case } from '@/utils/userData';

interface AdminDashboardOverviewProps {
  cases: Case[];
  users: User[];
}

const AdminDashboardOverview = ({ cases, users }: AdminDashboardOverviewProps) => {
  const activeCases = cases.filter(c => !['archived', 'withdrawn'].includes(c.status));
  const archivedCases = cases.filter(c => ['archived', 'withdrawn'].includes(c.status));
  const sellers = users.filter(u => u.role === 'seller');
  const agents = users.filter(u => u.role === 'agent');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aktive sager</CardTitle>
          <Home className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCases.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sælgere</CardTitle>
          <Users className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sellers.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mæglere</CardTitle>
          <Users className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{agents.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Arkiverede</CardTitle>
          <Archive className="h-4 w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{archivedCases.length}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardOverview;
