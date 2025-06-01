import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, AlertCircle, CheckCircle, Home } from 'lucide-react';
import { useSellerCase } from '@/hooks/useSellerCase';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ShowingBooking from '@/components/seller/ShowingBooking';
import { ROUTES } from '@/constants/routes';

const SellerMyCase = () => {
  const { sellerCase, isLoading, scheduleShowing, markShowingCompleted, refreshCase } = useSellerCase();
  const { toast } = useToast();
  const [showingBooked, setShowingBooked] = useState(false);
  const [showingCompleted, setShowingCompleted] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    // Check if showing is already booked
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.id) {
      const showingData = localStorage.getItem(`showing_data_${currentUser.id}`);
      if (showingData) {
        setShowingBooked(true);
        const parsedData = JSON.parse(showingData);
        if (parsedData.completed) {
          setShowingCompleted(true);
        }
      }
    }

    // Listen for case events to refresh when new cases are created
    const handleCaseEvent = () => {
      console.log('Case event detected, refreshing case data');
      refreshCase();
    };

    window.addEventListener('caseCreated', handleCaseEvent);
    window.addEventListener('caseUpdated', handleCaseEvent);
    window.addEventListener('casesChanged', handleCaseEvent);

    return () => {
      window.removeEventListener('caseCreated', handleCaseEvent);
      window.removeEventListener('caseUpdated', handleCaseEvent);
      window.removeEventListener('casesChanged', handleCaseEvent);
    };
  }, [refreshCase]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Indlæser...</div>
      </div>
    );
  }

  if (!sellerCase) {
    return (
      <div className="min-h-screen bg-gray-50 font-lato">
        <Navigation />
        <div className="container mx-auto px-6 py-20">
          <Card className="text-center">
            <CardContent className="p-8">
              <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Ingen aktiv sag</h2>
              <p className="text-gray-600 mb-4">Du har ikke nogen aktiv sag endnu.</p>
              <Link to="/saelger/dashboard">
                <Button>Tilbage til dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBookShowing = () => {
    setShowBookingForm(true);
  };

  const handleShowingBooked = (showingData: any) => {
    console.log('Showing booked:', showingData);
    setShowingBooked(true);
    setShowBookingForm(false);
    
    // Update case status to showing_booked
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.id) {
      localStorage.setItem(`seller_case_status_${sellerCase.id}`, 'showing_booked');
      
      // Also store in a way that agents and admin can see it
      const caseData = {
        id: sellerCase.id,
        address: sellerCase.address,
        showingDate: showingData.date,
        showingTime: showingData.time,
        showingNotes: showingData.notes,
        status: 'showing_booked',
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        sellerEmail: currentUser.email,
        sellerPhone: currentUser.phone || '',
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(`case_${sellerCase.id}_showing`, JSON.stringify(caseData));
      
      // Trigger events for real-time updates
      window.dispatchEvent(new CustomEvent('caseUpdated', { detail: caseData }));
      window.dispatchEvent(new CustomEvent('showingBooked', { detail: caseData }));
    }
    
    toast({
      title: "Fremvisning booket",
      description: "Mæglere kan nu tilmelde sig din fremvisning."
    });
  };

  const handleMarkCompleted = () => {
    setShowingCompleted(true);
    markShowingCompleted();
    
    // Update status for admin/agent visibility
    localStorage.setItem(`seller_case_status_${sellerCase.id}`, 'showing_completed');
    
    toast({
      title: "Fremvisning markeret som afholdt",
      description: "Mæglere kan nu afgive tilbud."
    });
  };

  const getMainButtonText = () => {
    if (showingCompleted || sellerCase.offers.length > 0) {
      return "Se tilbud";
    } else if (showingBooked) {
      return "Marker fremvisning som afholdt";
    } else {
      return "Book tid til fremvisning";
    }
  };

  const getMainButtonAction = () => {
    if (showingCompleted || sellerCase.offers.length > 0) {
      return () => window.location.href = '/saelger/tilbud';
    } else if (showingBooked) {
      return handleMarkCompleted;
    } else {
      return handleBookShowing;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-lato">
      <Navigation />
      
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Min Sag - {sellerCase.address}
          </h1>
          <p className="text-gray-600 mb-8">
            Administrer din sag og følg processen
          </p>

          {/* Case Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Sag Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Badge variant={
                    showingCompleted || sellerCase.offers.length > 0 ? 'default' : 'secondary'
                  }>
                    {showingCompleted || sellerCase.offers.length > 0 ? 'Tilbud klar' : 
                     showingBooked ? 'Fremvisning planlagt' : 'Aktiv'}
                  </Badge>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">
                    {sellerCase.agentRegistrations.length}
                  </div>
                  <div className="text-sm text-gray-600">Tilmeldte mæglere</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">
                    {sellerCase.offers.length}
                  </div>
                  <div className="text-sm text-gray-600">Modtagne tilbud</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Showing Booking Form */}
          {showBookingForm && !showingBooked && (
            <ShowingBooking onShowingBooked={handleShowingBooked} />
          )}

          {/* Showing Status */}
          {showingBooked && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Fremvisning
                  {showingCompleted && <Badge className="bg-green-100 text-green-700">Afholdt</Badge>}
                  {!showingCompleted && <Badge className="bg-blue-100 text-blue-700">Planlagt</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Din fremvisning er blevet booket. Mæglere kan nu tilmelde sig.
                </p>
                {!showingCompleted && (
                  <p className="text-sm text-gray-500">
                    Når fremvisningen er afholdt, skal du markere den som afholdt for at mæglerne kan afgive tilbud.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Agent Registrations */}
          {sellerCase.agentRegistrations.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Tilmeldte Mæglere
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sellerCase.agentRegistrations.map((registration) => (
                    <div key={registration.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{registration.agencyName}</p>
                        <p className="text-sm text-gray-600">v. {registration.agentName}</p>
                        <p className="text-xs text-gray-500">
                          Tilmeldt: {new Date(registration.registeredAt).toLocaleDateString('da-DK')}
                        </p>
                      </div>
                      <Badge variant={registration.status === 'registered' ? 'default' : 'secondary'}>
                        {registration.status === 'registered' ? 'Tilmeldt' : 'Afvist'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Action Button */}
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <Button 
                onClick={getMainButtonAction()}
                size="lg"
                className="px-8 py-3"
              >
                {getMainButtonText()}
              </Button>
            </CardContent>
          </Card>

          {/* Navigation Links */}
          <div className="flex gap-4 justify-center">
            {(showingCompleted || sellerCase.offers.length > 0) && (
              <Link to={ROUTES.SELLER_OFFERS}>
                <Button variant="outline">Se tilbud</Button>
              </Link>
            )}
            <Link to={ROUTES.SELLER_MESSAGES}>
              <Button variant="outline">Beskeder</Button>
            </Link>
            <Link to={ROUTES.SELLER_DASHBOARD}>
              <Button variant="outline">Tilbage til dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SellerMyCase;
