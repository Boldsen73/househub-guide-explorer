
import React, { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import AgentNavigation from '@/components/agent/dashboard/AgentNavigation';
import AgentHeroSection from '@/components/agent/dashboard/AgentHeroSection';
import AgentBenefitsSection from '@/components/agent/dashboard/AgentBenefitsSection';
import AgentQuickActions from '@/components/agent/dashboard/AgentQuickActions';
import AgentActivitySummary from '@/components/agent/dashboard/AgentActivitySummary';
import { useTestAuth } from '@/hooks/useTestAuth';

const AgentDashboard = () => {
  const { user } = useTestAuth();
  const [showBenefits, setShowBenefits] = useState(false);
  const [hasActiveCases, setHasActiveCases] = useState(false);

  useEffect(() => {
    const hasSeenBenefits = localStorage.getItem('agent_has_seen_benefits');
    if (!hasSeenBenefits) {
      setShowBenefits(true);
      localStorage.setItem('agent_has_seen_benefits', 'true');
    }

    // Check if there are any real seller cases (not test cases)
    const checkForRealCases = () => {
      let hasRealCases = false;
      
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
                hasRealCases = true;
                break;
              }
            }
          } catch (error) {
            console.error('Error checking case:', error);
          }
        }
      }
      
      setHasActiveCases(hasRealCases);
    };
    
    checkForRealCases();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-lato">
      <AgentNavigation />
      
      <main className="flex-grow">
        <div className="container mx-auto px-6 py-8">
          {/* TestEnvironmentBanner er fjernet */}
        </div>

        <AgentHeroSection />

        {/* Only show activity summary if there are real seller cases */}
        {hasActiveCases && (
          <AgentActivitySummary />
        )}

        <AgentQuickActions />
        
        <AgentBenefitsSection 
          showBenefits={showBenefits}
          onToggleBenefits={setShowBenefits}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default AgentDashboard;
