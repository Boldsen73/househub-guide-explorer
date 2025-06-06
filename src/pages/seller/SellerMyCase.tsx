import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'; // Import useLocation
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import ShowingBooking from '../../components/seller/ShowingBooking';
import PropertyDetailsCard from '../../components/seller/PropertyDetailsCard';
import SalePreferencesCard from '../../components/seller/SalePreferencesCard';
import ShowingStatusCard from '../../components/seller/ShowingStatusCard';
import CaseOverviewCard from '../../components/seller/CaseOverviewCard';
import QuickActionsCard from '../../components/seller/QuickActionsCard';
import CaseInfoCard from '../../components/seller/CaseInfoCard';
import AgentRegistrationsCard from '../../components/seller/AgentRegistrationsCard';
import CompactWithdrawalWarning from '../../components/seller/CompactWithdrawalWarning';
import { ROUTES } from '@/constants/routes';
import { useSellerCase } from '@/hooks/useSellerCase';

const SellerMyCase: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const location = useLocation(); // Brug useLocation til at få adgang til state

    // Use the dedicated hook instead of custom logic
    const { sellerCase, isLoading, scheduleShowing, markShowingCompleted, refreshCase } = useSellerCase(id); // Vigtigt: Send ID til useSellerCase!
    
    // Initialiser showBookingForm baseret på location.state
    const [showBookingForm, setShowBookingForm] = useState(
        (location.state as { openShowingBooking?: boolean })?.openShowingBooking || false
    );

    // Konverter useSellerCase data til forventet format (dette kan muligvis forenkles i useSellerCase hook)
    const caseDetails = sellerCase ? {
        ...sellerCase,
        sagsnummer: sellerCase.id.includes('HH-') ? sellerCase.id : `HH-${new Date().getFullYear()}-${sellerCase.id.slice(-6)}`,
        createdAt: new Date().toISOString(), // Antager dette, hvis det ikke kommer fra hook
        offers: sellerCase.offers || [],
        agentRegistrations: sellerCase.agentRegistrations || []
    } : null;
    
    const bookedShowingDetails = sellerCase?.showingDate && sellerCase?.showingTime ? {
        date: new Date(sellerCase.showingDate),
        time: sellerCase.showingTime,
        status: 'booked'
    } : null;
    
    const showingCompleted = sellerCase?.status === 'showing_completed';

    // Handle showing booking
    const handleShowingBooked = (showingData: any) => {
        console.log('Showing booked in SellerMyCase:', showingData);
        setShowBookingForm(false);
        refreshCase(); // Refresh the case data
        
        toast({
            title: "Fremvisning booket",
            description: "Din fremvisning er nu planlagt og mæglerne er blevet notificeret.",
        });
    };

    const handleChangeShowing = () => {
        setShowBookingForm(true);
    };

    const handleCancelShowing = () => {
        // Cancel showing and refresh case data
        if (sellerCase) {
            localStorage.removeItem(`showing_data_${sellerCase.id}`);
            localStorage.removeItem(`case_${sellerCase.id}_showing`);
            refreshCase();
        }
        toast({
            title: "Fremvisning annulleret",
            description: "Din fremvisning er blevet annulleret.",
        });
    };

    const handleMarkShowingCompleted = () => {
        markShowingCompleted();
        toast({
            title: "Fremvisning markeret som afholdt",
            description: "Mæglere kan nu afgive tilbud på din bolig.",
        });
    };

    const handleViewOffers = () => {
        // Naviger til tilbuds-siden for den specifikke sag
        if (caseDetails?.id) {
            navigate(`${ROUTES.SELLER_OFFERS}/${caseDetails.id}`);
        } else {
            navigate(ROUTES.SELLER_OFFERS); // Fallback hvis sags-ID ikke er tilgængeligt
        }
    };

    const getMainButtonText = useCallback(() => {
        if (!caseDetails) return "Indlæser sag...";
        if (!bookedShowingDetails) {
            return "Book fremvisning";
        }
        if (!showingCompleted) {
            return "Marker fremvisning afholdt";
        }
        if ((caseDetails.offers?.length || 0) > 0) {
            return `Se ${caseDetails.offers.length} modtagne tilbud`;
        }
        return "Afventer tilbud";
    }, [caseDetails, bookedShowingDetails, showingCompleted]);

    const getMainButtonAction = useCallback(() => {
        if (!caseDetails) return () => {};
        if (!bookedShowingDetails) {
            return () => setShowBookingForm(true);
        }
        if (!showingCompleted) {
            return handleMarkShowingCompleted;
        }
        if ((caseDetails.offers?.length || 0) > 0) {
            return handleViewOffers;
        }
        return () => {
            toast({
                title: "Ingen handling endnu",
                description: "Vent venligst på, at mæglerne afgiver tilbud.",
            });
        };
    }, [caseDetails, bookedShowingDetails, showingCompleted, toast, handleViewOffers]); // Tilføj handleViewOffers til dependencies

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 font-lato flex items-center justify-center">
                <p className="text-gray-700">Indlæser sagsdetaljer...</p>
            </div>
        );
    }

    if (!caseDetails) {
        return (
            <div className="min-h-screen bg-gray-50 font-lato">
                <Navigation />
                <div className="container mx-auto px-6 py-20 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Ingen sag fundet</h1>
                    <p className="text-gray-600 mb-8">Der blev ikke fundet nogen sag for din bruger med ID: {id}.</p> {/* Tilføj ID for debugging */}
                    <Button onClick={() => navigate(ROUTES.SELLER_DASHBOARD)}>
                        Tilbage til dashboard
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-lato">
            <Navigation />

            <div className="container mx-auto px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Min Sag - {caseDetails.address}
                        </h1>
                        <p className="text-gray-600">
                            Administrer din sag og følg processen
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <PropertyDetailsCard caseDetails={caseDetails} />
                            <SalePreferencesCard caseDetails={caseDetails} />

                            {showBookingForm && (
                                <ShowingBooking
                                    onShowingBooked={handleShowingBooked}
                                    initialDate={bookedShowingDetails?.date}
                                    initialTime={bookedShowingDetails?.time}
                                />
                            )}

                            <ShowingStatusCard
                                bookedShowingDetails={bookedShowingDetails}
                                showingCompleted={showingCompleted}
                                onChangeShowing={handleChangeShowing}
                                onCancelShowing={handleCancelShowing}
                            />
                        </div>

                        {/* Right Column - Status & Actions */}
                        <div className="space-y-6">
                            <CaseOverviewCard
                                caseDetails={caseDetails}
                                bookedShowingDetails={bookedShowingDetails}
                                showingCompleted={showingCompleted}
                            />

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

                            <QuickActionsCard
                                caseDetails={caseDetails}
                                showingCompleted={showingCompleted}
                            />

                            <CaseInfoCard caseDetails={caseDetails} />

                            {/* Case Withdrawal Option */}
                            <CompactWithdrawalWarning
                                caseId={parseInt(caseDetails.id.toString())}
                                onWithdraw={() => {
                                    toast({
                                        title: "Sag annulleret",
                                        description: "Din sag er blevet annulleret.",
                                        variant: "destructive"
                                    });
                                    navigate(ROUTES.SELLER_DASHBOARD);
                                }}
                            />
                        </div>
                    </div>

                    <AgentRegistrationsCard
                        agentRegistrations={caseDetails.agentRegistrations || []}
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default SellerMyCase;
