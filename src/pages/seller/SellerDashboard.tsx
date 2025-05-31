
import React, { useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import DiscreetInfoFooter from '../../components/seller/DiscreetInfoFooter';
import WelcomeHeader from '../../components/seller/WelcomeHeader';
import CasesList from '../../components/seller/CasesList';
import EmptyStateCard from '../../components/seller/EmptyStateCard';
import { useSellerDashboard } from '@/hooks/useSellerDashboard';

const SellerDashboard = () => {
  const { userCases, isLoading, currentUser, getUserDisplayName, refreshCases } = useSellerDashboard();

  // Force refresh when component mounts to ensure latest data
  useEffect(() => {
    console.log('SellerDashboard component mounted, forcing refresh');
    
    // Log current state for debugging
    console.log('Current userCases:', userCases);
    console.log('Current user:', currentUser);
    console.log('Is loading:', isLoading);
    
    // Force refresh of cases
    refreshCases();
    
    // Also log localStorage state for debugging
    const casesInStorage = localStorage.getItem('cases');
    console.log('Cases in localStorage:', casesInStorage);
    
  }, []);

  // Add debugging for when userCases changes
  useEffect(() => {
    console.log('userCases changed in SellerDashboard:', userCases.length, userCases);
  }, [userCases]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Indlæser dine sager...</div>
          <div className="text-sm text-gray-600 mt-2">Dette kan tage et øjeblik</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-lato">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <WelcomeHeader 
          userName={getUserDisplayName(currentUser)}
          hasAnyCases={userCases.length > 0}
        />

        {userCases.length === 0 ? (
          <EmptyStateCard />
        ) : (
          <CasesList cases={userCases} />
        )}

        <DiscreetInfoFooter />
      </div>
      
      <Footer />
    </div>
  );
};

export default SellerDashboard;
