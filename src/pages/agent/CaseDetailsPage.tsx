
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAgentCases } from '@/hooks/useAgentCases';
import { getCompleteCaseData } from '@/utils/caseManagement';
import HeaderNavigation from '@/components/agent/browseCases/HeaderNavigation';
import MessageThread from '@/components/agent/MessageThread';
import ShowingRegistration from '@/components/agent/ShowingRegistration';
import CaseHeader from '@/components/agent/caseDetails/CaseHeader';
import CaseStatusAlerts from '@/components/agent/caseDetails/CaseStatusAlerts';
import CaseSellerInfo from '@/components/agent/caseDetails/CaseSellerInfo';
import CaseSubmittedBid from '@/components/agent/caseDetails/CaseSubmittedBid';
import CasePropertyDescription from '@/components/agent/caseDetails/CasePropertyDescription';
import CaseActions from '@/components/agent/caseDetails/CaseActions';
import { ROUTES } from '@/constants/routes';

const CaseDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cases, getTimeRemaining } = useAgentCases();

  // Ensure we have a valid string ID
  const caseIdString = id || '';

  // Convert id to number for finding the case
  const numericId = id ? parseInt(id) : 0;
  const caseItem = cases.find(c => {
    return c.id === numericId; // Since id is now explicitly a number, we can compare directly
  });

  // State for showing data
  const [showingData, setShowingData] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (caseIdString) {
      // Load showing data for this case
      const showing = localStorage.getItem(`case_${caseIdString}_showing`);
      if (showing) {
        try {
          const parsedShowing = JSON.parse(showing);
          setShowingData(parsedShowing);
        } catch (error) {
          console.error('Error parsing showing data:', error);
        }
      }

      // Check if current agent is registered for showing
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const registrations = JSON.parse(localStorage.getItem(`showing_registrations_${caseIdString}`) || '[]');
      const agentRegistered = registrations.find((r: any) => r.agentId === currentUser.id);
      setIsRegistered(!!agentRegistered);
    }
  }, [caseIdString]);

  if (!caseItem) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderNavigation />
        <div className="container mx-auto px-6 py-12">
          <p className="text-center text-gray-500">Sag ikke fundet</p>
        </div>
      </div>
    );
  }

  // Load detailed case data from seller's original case with complete information
  const [detailedCaseData, setDetailedCaseData] = useState<any>(null);
  useEffect(() => {
    if (caseIdString) {
      // Use the enhanced function to get complete case data
      const completeData = getCompleteCaseData(caseIdString);
      if (completeData) {
        setDetailedCaseData(completeData);
        console.log('Loaded complete case data for agent view:', completeData);
      } else {
        // Fallback to old method
        const sellerCase = localStorage.getItem(`seller_case_${caseIdString}`);
        if (sellerCase) {
          try {
            const parsedCase = JSON.parse(sellerCase);
            setDetailedCaseData(parsedCase);
          } catch (error) {
            console.error('Error parsing seller case data:', error);
          }
        }
      }
    }
  }, [caseIdString]);

  const timeRemaining = caseItem.deadline ? getTimeRemaining(caseItem.deadline) : null;

  // Mock bid data with performance metrics - in real app this would come from the case
  const submittedBid = caseItem.agentStatus === 'offer_submitted' || caseItem.agentStatus === 'archived' ? {
    expectedPrice: "4.200.000 DKK",
    commission: "65.000 DKK",
    bindingPeriod: "6 måneder",
    marketingPackage: "Premium",
    comment: "Jeg vurderer boligen højt og har stor erfaring med salg i området. Mit omfattende netværk og digitale markedsføringsstrategi sikrer optimal eksponering.",
    houseHubScore: 87,
    bidDeviation: "+5,1%",
    submittedAt: "2024-01-13T12:45:00",
    sellerViewed: true,
    sellerViewedAt: "2024-01-13T14:20:00"
  } : null;

  const handleDownloadPDF = () => {
    // In real app, this would generate and download the actual PDF
    console.log(`Downloading PDF for case ${caseIdString}`);
  };

  const handleRegisterForShowing = () => {
    setIsRegistered(true);
  };

  // Generate fallback description based on case data
  const fallbackDescription = `${caseItem.type} i ${caseItem.municipality}. Boligen er ${caseItem.size} stor og har ${caseItem.rooms} værelser.`;

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderNavigation />

      <div className="container mx-auto px-6 py-8">
        {/* Back Navigation */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(ROUTES.AGENT_BROWSE_CASES)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tilbage til sagsoversigt
        </Button>

        {/* Status Alerts */}
        <CaseStatusAlerts
          agentStatus={caseItem.agentStatus}
          caseId={caseIdString}
          onDownloadPDF={handleDownloadPDF}
        />

        {/* Case Header */}
        <CaseHeader
          address={caseItem.address}
          price={detailedCaseData?.expectedPrice || caseItem.price}
          type={detailedCaseData?.propertyType || caseItem.type}
          size={String(detailedCaseData?.size || caseItem.size)}
          rooms={String(detailedCaseData?.rooms || caseItem.rooms)}
          buildYear={detailedCaseData?.buildYear || caseItem.buildYear}
          municipality={caseItem.municipality}
          
          timeRemaining={timeRemaining}
          agentStatus={caseItem.agentStatus}
          detailedCaseData={detailedCaseData}
        />

        {/* Showing Registration Component - only show if showing is booked */}
        {showingData && (
          <ShowingRegistration
            caseId={caseIdString}
            showingDate={new Date(showingData.showingDate)}
            showingTime={showingData.showingTime}
            address={caseItem.address}
            notes={showingData.showingNotes}
            isRegistered={isRegistered}
            onRegister={handleRegisterForShowing}
          />
        )}

        {/* Seller Information */}
        <CaseSellerInfo
          sellerName={caseItem.sellerName}
          sellerEmail={caseItem.sellerEmail}
          sellerPhone={caseItem.sellerPhone}
        />

        {/* Submitted Bid Summary with Performance Stats */}
        {submittedBid && (
          <CaseSubmittedBid submittedBid={submittedBid} />
        )}

        {/* Message Thread */}
        {(caseItem.agentStatus === 'offer_submitted' || caseItem.agentStatus === 'archived') && (
          <MessageThread caseId={caseIdString} sellerName={caseItem.sellerName || "Sælger"} />
        )}

        {/* Property Description with Enhanced Seller's Data */}
        <CasePropertyDescription
          detailedCaseData={detailedCaseData}
          fallbackDescription={fallbackDescription}
        />

        {/* Action Buttons */}
        <CaseActions
          agentStatus={caseItem.agentStatus}
          caseId={caseIdString}
        />
      </div>
    </div>
  );
};

export default CaseDetailsPage;
