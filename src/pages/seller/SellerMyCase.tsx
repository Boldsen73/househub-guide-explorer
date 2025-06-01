import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

// Icons from lucide-react (make sure these are installed: npm install lucide-react)
import { Home, MapPin, Building, Calendar, DollarSign, TrendingUp, Clock3, Target, CheckCircle, Users, Edit, XCircle, MessageCircle, Clock } from 'lucide-react';

// Simulering af data (normalt ville dette komme fra en API)
// Dette er mock data, som du skal erstatte med rigtig API-kald
const mockCaseDetails = {
    id: '12345',
    address: 'Vejvej 123, 1. mf',
    municipality: 'Aarhus',
    type: 'Villa',
    size: 150,
    constructionYear: 1980,
    price: '3.500.000 DKK',
    energyLabel: 'C',
    sagsnummer: 'HH-2025-001',
    createdAt: '2025-05-20T10:00:00Z',
    timeframe: 3,
    timeframeType: 'months',
    priorities: {
        speed: true,
        price: false,
        service: true,
    },
    flexiblePrice: true,
    specialRequests: 'Ønsker kun fremvisninger i weekenden.',
    offers: [], // Initialiser som tomt array
    agentRegistrations: [], // Initialiser som tomt array
    bookedShowing: null, // Eller et objekt hvis en fremvisning er booket: { date: '2025-06-10', time: '14:00', notes: 'Husk nøgle' }
};

// En anden mock case for at teste med tilbud
const mockCaseDetailsWithOffers = {
    ...mockCaseDetails,
    id: '67890',
    address: 'Gade Allé 45',
    municipality: 'København',
    offers: [
        { id: 'offer1', agentId: 'ag1', amount: 3400000, status: 'pending' },
        { id: 'offer2', agentId: 'ag2', amount: 3550000, status: 'pending' },
    ],
    agentRegistrations: [
        { id: 'reg1', agencyName: 'Mæglerfirma A', agentName: 'Lars Jensen', status: 'registered', registeredAt: '2025-05-25T11:00:00Z' },
        { id: 'reg2', agencyName: 'Boligsalg B', agentName: 'Mette Hansen', status: 'registered', registeredAt: '2025-05-26T12:00:00Z' },
    ],
    bookedShowing: { date: '2025-06-05', time: '10:00', notes: 'Klar til fremvisning' },
};


const SellerMyCase: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [caseDetails, setCaseDetails] = useState<any>(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [bookedShowingDetails, setBookedShowingDetails] = useState<any>(null);
    const [showingCompleted, setShowingCompleted] = useState(false);

    useEffect(() => {
        const fetchedCase = id === '67890' ? mockCaseDetailsWithOffers : mockCaseDetails;
        setCaseDetails(fetchedCase);
        setBookedShowingDetails(fetchedCase.bookedShowing);

        if (fetchedCase.bookedShowing) {
            const showingDateTime = new Date(`${fetchedCase.bookedShowing.date}T${fetchedCase.bookedShowing.time}`);
            if (showingDateTime < new Date()) {
                setShowingCompleted(true);
            }
        }

    }, [id]);

    const handleShowingBooked = (showingData: any) => {
        const { date, time, notes } = showingData;
        const newShowingDetails = { date, time, notes };
        setBookedShowingDetails(newShowingDetails);
        setShowBookingForm(false);
        setShowingCompleted(false);
        toast({
            title: "Fremvisning booket!",
            description: `Din fremvisning er booket til ${date} kl. ${time}.`,
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

    if (!caseDetails) {
        return (
            <div className="min-h-screen bg-gray-50 font-lato flex items-center justify-center">
                <p className="text-gray-700">Indlæser sagsdetaljer...</p>
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
