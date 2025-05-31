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

  // Log initial state when component mounts for debugging
  useEffect(() => {
    console.log('SellerDashboard component mounted.');
    console.log('Initial userCases:', userCases);
    console.log('Initial user:', currentUser);
    console.log('Is loading:', isLoading);
    
    // Log localStorage state for debugging
    const casesInStorage = localStorage.getItem('test_cases'); // Changed from 'cases' to 'test_cases' if that's where your cases are stored
    console.log('Cases in localStorage (test_cases):', casesInStorage);
    
  }, []); // Empty dependency array, runs only once on mount

  // Add debugging for when userCases changes (useful for observing data updates)
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