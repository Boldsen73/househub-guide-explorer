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
import ShowingBooking from '../../components/seller/ShowingBooking'; // Assuming this component exists
import { ROUTES } from '@/constants/routes'; // Assuming ROUTES is defined here

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

    // Initialiser caseDetails til null for at håndtere loading state
    const [caseDetails, setCaseDetails] = useState<any>(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [bookedShowingDetails, setBookedShowingDetails] = useState<any>(null);
    const [showingCompleted, setShowingCompleted] = useState(false); // Ny state for at spore om fremvisning er afholdt

    // Simulering af hentning af sagsdetaljer
    useEffect(() => {
        // I en rigtig applikation ville du hente data baseret på 'id' fra din backend
        // For nu bruger vi mock data
        const fetchedCase = id === '67890' ? mockCaseDetailsWithOffers : mockCaseDetails;
        setCaseDetails(fetchedCase);
        setBookedShowingDetails(fetchedCase.bookedShowing);

        // Bestem showingCompleted baseret på om fremvisningstidspunktet er passeret
        if (fetchedCase.bookedShowing) {
            const showingDateTime = new Date(`${fetchedCase.bookedShowing.date}T${fetchedCase.bookedShowing.time}`);
            if (showingDateTime < new Date()) {
                setShowingCompleted(true);
            }
        }

    }, [id]);

    const handleShowingBooked = (date: string, time: string, notes: string) => {
        const newShowingDetails = { date, time, notes };
        setBookedShowingDetails(newShowingDetails);
        setShowBookingForm(false);
        setShowingCompleted(false); // Nulstil completed, da der er en ny fremvisning
        toast({
            title: "Fremvisning booket!",
            description: `Din fremvisning er booket til ${date} kl. ${time}.`,
        });
        // Opdater også caseDetails i den faktiske state, så den persisterer
        setCaseDetails((prevDetails: any) => ({
            ...prevDetails,
            bookedShowing: newShowingDetails,
        }));
    };

    const handleChangeShowing = () => {
        setShowBookingForm(true);
        // Fremvisningsformularen vil pre-fill med eksisterende detaljer via initialDate/initialTime props
    };

    const handleCancelShowing = () => {
        setBookedShowingDetails(null);
        setShowingCompleted(false);
        toast({
            title: "Fremvisning annulleret",
            description: "Din fremvisning er blevet annulleret.",
        });
        // Opdater også caseDetails i den faktiske state
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
        // Her ville du normalt sende en opdatering til din backend
    };

    const handleViewOffers = () => {
        navigate(ROUTES.SELLER_OFFERS);
    };

    // Funktion til at bestemme teksten på hovedknappen
    const getMainButtonText = useCallback(() => {
        if (!caseDetails) return "Indlæser sag..."; // Håndter loading state
        if (!bookedShowingDetails) {
            return "Book fremvisning";
        }
        if (!showingCompleted) {
            return "Marker fremvisning afholdt";
        }
        if ((caseDetails.offers?.length || 0) > 0) { // Brug optional chaining og default til 0
            return `Se ${caseDetails.offers.length} modtagne tilbud`;
        }
        return "Afventer tilbud";
    }, [caseDetails, bookedShowingDetails, showingCompleted]);

    // Funktion til at bestemme handlingen for hovedknappen
    const getMainButtonAction = useCallback(() => {
        if (!caseDetails) return () => {}; // Returner en tom funktion under loading
        if (!bookedShowingDetails) {
            return () => setShowBookingForm(true);
        }
        if (!showingCompleted) {
            return handleMarkShowingCompleted;
        }
        if ((caseDetails.offers?.length || 0) > 0) { // Brug optional chaining og default til 0
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

                            {/* Property Details Card */}
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


                            {/* Salgspræferencer */}
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

                            {/* Showing Booking Form */}
                            {showBookingForm && (
                                <ShowingBooking
                                    onShowingBooked={handleShowingBooked}
                                    initialDate={bookedShowingDetails?.date}
                                    initialTime={bookedShowingDetails?.time}
                                />
                            )}

                            {/* Enhanced Showing Status Card */}
                            {bookedShowingDetails && ( // Vis kun dette kort, hvis der er booket en fremvisning
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5" />
                                            Fremvisning
                                            {showingCompleted && <Badge className="bg-green-100 text-green-700 ml-2">Afholdt</Badge>}
                                            {!showingCompleted && <Badge className="bg-blue-100 text-blue-700 ml-2">Planlagt</Badge>}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 text-lg font-semibold text-gray-800">
                                                <Calendar className="h-6 w-6 text-purple-600" />
                                                <span>{bookedShowingDetails.date}</span>
                                                <Clock className="h-6 w-6 text-purple-600 ml-4" />
                                                <span>kl. {bookedShowingDetails.time}</span>
                                            </div>
                                            {bookedShowingDetails.notes && (
                                                <p className="text-sm text-gray-600 mt-2">Noter: {bookedShowingDetails.notes}</p>
                                            )}
                                            <p className="text-gray-600">
                                                Din fremvisning er blevet booket. Mæglere kan nu tilmelde sig.
                                            </p>
                                            {!showingCompleted && (
                                                <p className="text-sm text-gray-500">
                                                    Når fremvisningen er afholdt, skal du markere den som afholdt for at mæglerne kan afgive tilbud.
                                                </p>
                                            )}
                                            <div className="flex space-x-2 mt-4">
                                                {!showingCompleted && ( // Kan kun ændre/annullere hvis ikke afholdt
                                                    <>
                                                        <Button variant="outline" onClick={handleChangeShowing} className="flex-1">
                                                            <Edit className="h-4 w-4 mr-2" /> Ændr tidspunkt
                                                        </Button>
                                                        <Button variant="destructive" onClick={handleCancelShowing} className="flex-1">
                                                            <XCircle className="h-4 w-4 mr-2" /> Annuller fremvisning
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
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
                                                showingCompleted || (caseDetails.offers?.length || 0) > 0 ? 'default' : 'secondary'
                                            }>
                                                {showingCompleted || (caseDetails.offers?.length || 0) > 0 ? 'Tilbud klar' :
                                                    bookedShowingDetails ? 'Fremvisning planlagt' : 'Aktiv'}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                                <div className="text-xl font-bold text-green-600">
                                                    {(caseDetails.agentRegistrations?.length || 0)}
                                                </div>
                                                <div className="text-xs text-gray-600">Tilmeldte mæglere</div>
                                            </div>
                                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                                                <div className="text-xl font-bold text-purple-600">
                                                    {(caseDetails.offers?.length || 0)}
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
                                    {(showingCompleted || (caseDetails.offers?.length || 0) > 0) && (
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
                        </div>
                    </div>

                    {/* Agent Registrations */}
                    {(caseDetails.agentRegistrations?.length || 0) > 0 && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Tilmeldte Mæglere
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                    {caseDetails.agentRegistrations.map((registration: any) => (
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