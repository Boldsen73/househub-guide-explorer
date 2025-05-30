
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Home, 
  TrendingUp, 
  Clock,
  Calendar,
  Eye,
  Plus
} from 'lucide-react';
import { getUsers, getCases } from '@/utils/userData';

const EnhancedAdminOverview = () => {
  const [overviewData, setOverviewData] = useState({
    totalCases: 0,
    totalAgents: 0,
    totalSellers: 0,
    activeCases: 0,
    averageBids: 0,
    lastCaseCreated: 'Ingen sager endnu',
    lastAgentLogin: 'Ingen aktivitet',
    weeklyNewCases: 0,
    weeklyHighlights: [
      { label: 'Nye sager', value: 0, change: 'Denne uge' },
      { label: 'Nye tilbud', value: 0, change: 'Denne uge' },
      { label: 'Afsluttede sager', value: 0, change: 'Denne uge' }
    ]
  });

  useEffect(() => {
    loadRealData();
    
    // Listen for data changes
    const handleDataChange = () => {
      loadRealData();
    };
    
    window.addEventListener('storage', handleDataChange);
    window.addEventListener('userCreated', handleDataChange);
    window.addEventListener('caseCreated', handleDataChange);
    
    const interval = setInterval(loadRealData, 10000);
    
    return () => {
      window.removeEventListener('storage', handleDataChange);
      window.removeEventListener('userCreated', handleDataChange);
      window.removeEventListener('caseCreated', handleDataChange);
      clearInterval(interval);
    };
  }, []);

  const loadRealData = () => {
    const users = getUsers();
    const cases = getCases();
    
    // Load seller cases from localStorage
    const sellerCases = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('seller_case_')) {
        try {
          const caseData = JSON.parse(localStorage.getItem(key) || '{}');
          if (caseData && caseData.address) {
            const caseId = key.replace('seller_case_', '');
            const sellerCaseStatus = localStorage.getItem(`seller_case_status_${caseId}`);
            
            if (!sellerCaseStatus || sellerCaseStatus === 'active') {
              sellerCases.push({
                id: caseId,
                status: 'active',
                createdAt: new Date().toISOString()
              });
            }
          }
        } catch (error) {
          console.error('Error loading seller case:', error);
        }
      }
    }
    
    const allCases = [...cases, ...sellerCases];
    const agents = users.filter(u => u.role === 'agent');
    const sellers = users.filter(u => u.role === 'seller');
    const activeCases = allCases.filter(c => !['archived', 'withdrawn'].includes(c.status));
    
    // Get agent case states for offers count
    const agentCaseStates = JSON.parse(localStorage.getItem('agentCaseStates') || '{}');
    const totalOffers = Object.values(agentCaseStates).filter(
      (state: any) => state.agentStatus === 'offer_submitted'
    ).length;
    
    setOverviewData({
      totalCases: allCases.length,
      totalAgents: agents.length,
      totalSellers: sellers.length,
      activeCases: activeCases.length,
      averageBids: allCases.length > 0 ? totalOffers / allCases.length : 0,
      lastCaseCreated: allCases.length > 0 ? '2 timer siden' : 'Ingen sager endnu',
      lastAgentLogin: agents.length > 0 ? 'I dag' : 'Ingen mæglere',
      weeklyNewCases: activeCases.length,
      weeklyHighlights: [
        { label: 'Nye sager', value: activeCases.length, change: 'Total aktive' },
        { label: 'Nye tilbud', value: totalOffers, change: 'Total tilbud' },
        { label: 'Afsluttede sager', value: allCases.length - activeCases.length, change: 'Afsluttede' }
      ]
    });
  };

  const recentActivity = [
    {
      id: 1,
      type: 'case_created',
      description: `${overviewData.totalCases} sager i systemet`,
      time: 'Opdateret nu',
      status: 'active'
    },
    {
      id: 2,
      type: 'offer_submitted',
      description: `${Math.round(overviewData.averageBids * overviewData.totalCases)} tilbud afgivet`,
      time: 'Total',
      status: 'active'
    },
    {
      id: 3,
      type: 'agent_registered',
      description: `${overviewData.totalAgents} mæglere tilmeldt`,
      time: 'Total',
      status: 'completed'
    },
    {
      id: 4,
      type: 'case_won',
      description: `${overviewData.totalSellers} sælgere registreret`,
      time: 'Total',
      status: 'new'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'case_created': return <Home className="h-4 w-4" />;
      case 'offer_submitted': return <TrendingUp className="h-4 w-4" />;
      case 'case_won': return <Users className="h-4 w-4" />;
      case 'agent_registered': return <Plus className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <Badge className="bg-green-100 text-green-800">Ny</Badge>;
      case 'active': return <Badge className="bg-blue-100 text-blue-800">Aktiv</Badge>;
      case 'completed': return <Badge className="bg-gray-100 text-gray-800">Afsluttet</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total sager</p>
                <p className="text-2xl font-bold">{overviewData.totalCases}</p>
                <p className="text-xs text-gray-500">{overviewData.activeCases} aktive</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Mæglere</p>
                <p className="text-2xl font-bold">{overviewData.totalAgents}</p>
                <p className="text-xs text-gray-500">Aktive på platformen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sælgere</p>
                <p className="text-2xl font-bold">{overviewData.totalSellers}</p>
                <p className="text-xs text-gray-500">Registrerede</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Gns. tilbud</p>
                <p className="text-2xl font-bold">{overviewData.averageBids.toFixed(1)}</p>
                <p className="text-xs text-gray-500">Per sag</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            System oversigt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {overviewData.weeklyHighlights.map((highlight, index) => (
              <div key={index} className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{highlight.value}</div>
                <div className="text-sm font-medium text-gray-700">{highlight.label}</div>
                <div className="text-xs text-gray-600 mt-1">{highlight.change}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            System status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(activity.status)}
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hurtige handlinger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-16 flex flex-col items-center justify-center gap-2">
              <Home className="h-5 w-5" />
              Se alle sager
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Users className="h-5 w-5" />
              Se alle brugere
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5" />
              System indstillinger
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAdminOverview;
