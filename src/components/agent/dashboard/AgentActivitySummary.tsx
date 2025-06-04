
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AgentActivitySummary: React.FC = () => {
  const [stats, setStats] = useState({
    activeCases: 0,
    submittedOffers: 0,
    pendingResponses: 0
  });

  useEffect(() => {
    // Count real seller cases only
    let realActiveCases = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('seller_case_')) {
        try {
          const caseData = JSON.parse(localStorage.getItem(key) || '{}');
          if (caseData && caseData.address) {
            const caseId = key.replace('seller_case_', '');
            const sellerCaseStatus = localStorage.getItem(`seller_case_status_${caseId}`);
            const isActive = !sellerCaseStatus || sellerCaseStatus === 'active';
            
            if (isActive) {
              realActiveCases++;
            }
          }
        } catch (error) {
          console.error('Error counting cases:', error);
        }
      }
    }
    
    const agentCaseStates = JSON.parse(localStorage.getItem('agentCaseStates') || '{}');
    const submittedOffers = Object.values(agentCaseStates).filter(
      (state: any) => state.agentStatus === 'offer_submitted'
    ).length;
    const pendingResponses = Math.max(0, realActiveCases - submittedOffers);

    setStats({
      activeCases: realActiveCases,
      submittedOffers,
      pendingResponses
    });
  }, []);

  // Don't show if no activity
  if (stats.activeCases === 0 && stats.submittedOffers === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Seneste aktivitet</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.activeCases}</p>
              <p className="text-gray-600">Aktive sager</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-green-600">{stats.submittedOffers}</p>
              <p className="text-gray-600">Afgivne bud</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-orange-600">{stats.pendingResponses}</p>
              <p className="text-gray-600">Afventende svar</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-x-0 md:space-x-4 space-y-4 md:space-y-0 flex flex-col md:flex-row justify-center items-center">
          <Link to="/agent/browse-cases">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto">
              Gennemse sager
            </Button>
          </Link>
          <Link to="/agent/statistics">
            <Button size="lg" variant="outline" className="w-full md:w-auto">
              Se statistikker
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AgentActivitySummary;
