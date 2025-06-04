
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
import { ROUTES } from '@/constants/routes';
import { getCasesForUser, getCompleteCaseData } from '@/utils/caseManagement';
import { getTestCasesForUser } from '@/utils/testData';

const SellerMyCase: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [caseDetails, setCaseDetails] = useState<any>(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [bookedShowingDetails, setBookedShowingDetails] = useState<any>(null);
    const [showingCompleted, setShowingCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCaseData();
    }, [id]);

    const loadCaseData = () => {
        console.log('=== LOADING CASE DATA IN SellerMyCase ===');
        setIsLoading(true);
        
        try {
            // Get current user
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            console.log('Current user in SellerMyCase:', currentUser);
            
            if (!currentUser.id) {
                console.error('No current user found');
                setIsLoading(false);
                return;
            }

            let userCase = null;

            // If ID is provided, try to get specific case
            if (id) {
                console.log('Looking for case with ID:', id);
                userCase = getCompleteCaseData(id);
                console.log('Found case by ID:', userCase);
            }

            // If no case found by ID or no ID provided, get user's cases
            if (!userCase) {
                console.log('No case found by ID, looking for user cases...');
                
                // Try real cases first
                const realCases = getCasesForUser(currentUser.id);
                console.log('Real cases found:', realCases);
                
                // Try test cases as fallback
                const testCases = getTestCasesForUser(currentUser.id);
                console.log('Test cases found:', testCases);
                
                // Use the most recent case
                const allUserCases = [...realCases, ...testCases];
                if (allUserCases.length > 0) {
                    // Sort by creation date and get the most recent
                    allUserCases.sort((a, b) => {
                        const dateA = new Date(a.createdAt || 0).getTime();
                        const dateB = new Date(b.createdAt || 0).getTime();
                        return dateB - dateA;
                    });
                    userCase = allUserCases[0];
                    console.log('Using most recent case:', userCase);
                }
            }

            if (userCase) {
                console.log('Setting case details:', userCase);
                
                // Enrich case data with form data if available
                const enrichedCase = enrichCaseWithFormData(userCase);
                setCaseDetails(enrichedCase);
                
                // Load showing details
                if (enrichedCase.bookedShowing) {
                    setBookedShowingDetails(enrichedCase.bookedShowing);
                    const showingDateTime = new Date(`${enrichedCase.bookedShowing.date}T${enrichedCase.bookedShowing.time}`);
                    if (showingDateTime < new Date()) {
                        setShowingCompleted(true);
                    }
                }
            } else {
                console.error('No case found for user');
                toast({
                    title: "Ingen sag fundet",
                    description: "Der blev ikke fundet nogen sag for din bruger.",
                    variant: "destructive"
                });
                navigate(ROUTES.SELLER_DASHBOARD);
            }
        } catch (error) {
            console.error('Error loading case data:', error);
            toast({
                title: "Fejl ved indlæsning",
                description: "Der opstod en fejl ved indlæsning af din sag.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const enrichCaseWithFormData = (baseCase: any) => {
        console.log('Enriching case with form data:', baseCase.id);
        
        try {
            // Get property form data
            const propertyData = localStorage.getItem('propertyForm');
            const salesPreferences = localStorage.getItem('salePreferences');
            
            let enrichedCase = { ...baseCase };
            
            // Add property form data if available
            if (propertyData) {
                try {
                    const parsed = JSON.parse(propertyData);
                    console.log('Property form data found:', parsed);
                    
                    enrichedCase = {
                        ...enrichedCase,
                        type: parsed.propertyType || enrichedCase.type,
                        size: parsed.size || enrichedCase.size,
                        constructionYear: parsed.buildYear || enrichedCase.constructionYear || enrichedCase.buildYear,
                        rooms: parsed.rooms || enrichedCase.rooms,
                        description: parsed.notes || enrichedCase.description,
                        
                    };
                } catch (error) {
                    console.error('Error parsing property data:', error);
                }
            }
            
            // Add sales preferences if available
            if (salesPreferences) {
                try {
                    const parsed = JSON.parse(salesPreferences);
                    console.log('Sales preferences data found:', parsed);
                    
                    if (parsed.expectedPrice && parsed.expectedPrice[0]) {
                        enrichedCase.price = `${(parsed.expectedPrice[0] / 1000000).toFixed(1)} mio. kr`;
                        enrichedCase.priceValue = parsed.expectedPrice[0];
                    }
                    
                    enrichedCase = {
                        ...enrichedCase,
                        timeframe: parsed.timeframe || enrichedCase.timeframe,
                        timeframeType: parsed.timeframeType || enrichedCase.timeframeType,
                        priorities: parsed.priorities || enrichedCase.priorities,
                        flexiblePrice: parsed.flexiblePrice !== undefined ? parsed.flexiblePrice : enrichedCase.flexiblePrice,
                        specialRequests: parsed.specialRequests || enrichedCase.specialRequests
                    };
                } catch (error) {
                    console.error('Error parsing sales preferences:', error);
                }
            }
            
            // Ensure required fields have defaults
            enrichedCase = {
                sagsnummer: enrichedCase.sagsnummer || `HH-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
                createdAt: enrichedCase.createdAt || new Date().toISOString(),
                offers: enrichedCase.offers || [],
                agentRegistrations: enrichedCase.agentRegistrations || [],
                ...enrichedCase
            };
            
            console.log('Enriched case result:', enrichedCase);
            return enrichedCase;
        } catch (error) {
            console.error('Error enriching case data:', error);
            return baseCase;
        }
    };

    const handleShowingBooked = (showingData: any) => {
        const { date, time, notes } = showingData;
        const newShowingDetails = { date, time, notes };
        setBookedShowingDetails(newShowingDetails);
        setShowBookingForm(false);
        setShowingCompleted(false);
        
        // Format the date properly for display
        const formattedDate = date instanceof Date 
            ? format(date, 'EEEE d. MMMM yyyy', { locale: da })
            : date;
            
        toast({
            title: "Fremvisning booket!",
            description: `Din fremvisning er booket til ${formattedDate} kl. ${time}.`,
        });
        setCaseDetails((prevDetails: any) => ({
            ...prevDetails,
            bookedShowing: newShowingDetails,
        }));
    };

    const handleChangeShowing = () => {
        setShowBookingForm(true);
    };

    const handleCancelShowing = () => {
        setBookedShowingDetails(null);
        setShowingCompleted(false);
        toast({
            title: "Fremvisning annulleret",
            description: "Din fremvisning er blevet annulleret.",
        });
        setCaseDetails((prevDetails: any) => ({
            ...prevDetails,
            bookedShowing: null,
        }));
    };

    const handleMarkShowingCompleted = () => {
        setShowingCompleted(true);
        toast({
            title: "Fremvisning markeret som afholdt",
            description: "Mæglere kan nu afgive tilbud på din bolig.",
        });
    };

    const handleViewOffers = () => {
        navigate(ROUTES.SELLER_OFFERS);
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
    }, [caseDetails, bookedShowingDetails, showingCompleted, toast]);

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
                    <p className="text-gray-600 mb-8">Der blev ikke fundet nogen sag for din bruger.</p>
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
