
import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, AlertCircle, CheckCircle, Home, MapPin, Building, DollarSign, Clock3, Target, MessageCircle, TrendingUp } from 'lucide-react';
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
  const [caseDetails, setCaseDetails] = useState<any>(null);

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

    // Load detailed case information
    if (sellerCase) {
      const cases = JSON.parse(localStorage.getItem('cases') || '[]');
      const fullCase = cases.find((c: any) => c.id === sellerCase.id);
      setCaseDetails(fullCase);
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
  }, [refreshCase, sellerCase]);

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

  const formatPrice = (value: number) => {
    return value.toLocaleString('da-DK', { style: 'currency', currency: 'DKK' });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-lato">
      <Navigation />
      
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Min Sag - {sellerCase.address}
            </h1>
            <p className="text-gray-600">
              Administrer din sag og følg processen
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Property Details Card */}
              {caseDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      Boligoplysninger
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">{caseDetails.address}</p>
                            <p className="text-sm text-gray-600">{caseDetails.municipality}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Building className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Type</p>
                            <p className="font-medium">{caseDetails.type}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Home className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Størrelse</p>
                            <p className="font-medium">{caseDetails.size} m²</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Byggeår</p>
                            <p className="font-medium">{caseDetails.constructionYear || caseDetails.buildYear}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-600">Forventet pris</p>
                            <p className="font-medium text-green-600">{caseDetails.price}</p>
                          </div>
                        </div>
                        
                        {caseDetails.energyLabel && (
                          <div className="flex items-center gap-3">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-600">Energimærke</p>
                              <p className="font-medium">{caseDetails.energyLabel}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Salgspræferencer */}
              {caseDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Dine Salgspræferencer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {caseDetails.timeframe && (
                          <div className="flex items-center gap-3">
                            <Clock3 className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Tidsfrist</p>
                              <p className="font-medium">{caseDetails.timeframe} {caseDetails.timeframeType === 'months' ? 'måneder' : 'uger'}</p>
                            </div>
                          </div>
                        )}
                        
                        {caseDetails.priorities && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Prioriteter</p>
                            <div className="flex flex-wrap gap-2">
                              {caseDetails.priorities.speed && <Badge variant="secondary">Hurtig salg</Badge>}
                              {caseDetails.priorities.price && <Badge variant="secondary">Højeste pris</Badge>}
                              {caseDetails.priorities.service && <Badge variant="secondary">Bedste service</Badge>}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {caseDetails.flexiblePrice !== undefined && (
                          <div>
                            <p className="text-sm text-gray-600">Prisfleksibilitet</p>
                            <p className="font-medium">{caseDetails.flexiblePrice ? 'Ja, jeg er åben for forhandling' : 'Nej, prisen er fast'}</p>
                          </div>
                        )}
                        
                        {caseDetails.specialRequests && (
                          <div>
                            <p className="text-sm text-gray-600">Særlige ønsker</p>
                            <p className="font-medium text-sm">{caseDetails.specialRequests}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Showing Booking Form */}
              {showBookingForm && !showingBooked && (
                <ShowingBooking onShowingBooked={handleShowingBooked} />
              )}

              {/* Showing Status */}
              {showingBooked && (
                <Card>
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
            </div>

            {/* Right Column - Status & Actions */}
            <div className="space-y-6">
              
              {/* Case Overview Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Badge variant={
                        showingCompleted || sellerCase.offers.length > 0 ? 'default' : 'secondary'
                      }>
                        {showingCompleted || sellerCase.offers.length > 0 ? 'Tilbud klar' : 
                         showingBooked ? 'Fremvisning planlagt' : 'Aktiv'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">
                          {sellerCase.agentRegistrations.length}
                        </div>
                        <div className="text-xs text-gray-600">Tilmeldte mæglere</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-xl font-bold text-purple-600">
                          {sellerCase.offers.length}
                        </div>
                        <div className="text-xs text-gray-600">Modtagne tilbud</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main Action Button */}
              <Card>
                <CardContent className="p-6 text-center">
                  <Button 
                    onClick={getMainButtonAction()}
                    size="lg"
                    className="w-full px-8 py-3"
                  >
                    {getMainButtonText()}
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hurtige handlinger</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(showingCompleted || sellerCase.offers.length > 0) && (
                    <Link to={ROUTES.SELLER_OFFERS} className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Se tilbud
                      </Button>
                    </Link>
                  )}
                  <Link to={ROUTES.SELLER_MESSAGES} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Beskeder
                    </Button>
                  </Link>
                  <Link to={ROUTES.SELLER_DASHBOARD} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Home className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Case Info */}
              {caseDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sag information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sagsnummer:</span>
                      <span className="font-mono">{caseDetails.sagsnummer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Oprettet:</span>
                      <span>{new Date(caseDetails.createdAt).toLocaleDateString('da-DK')}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Agent Registrations */}
          {sellerCase.agentRegistrations.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Tilmeldte Mæglere
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {sellerCase.agentRegistrations.map((registration) => (
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
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SellerMyCase;
