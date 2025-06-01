import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, AlertCircle, CheckCircle, Home, MapPin, Building, DollarSign, Clock3, Target, MessageCircle, TrendingUp, Edit, XCircle } from 'lucide-react'; // Tilføjet Edit og XCircle ikoner
import { useSellerCase } from '@/hooks/useSellerCase';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ShowingBooking from '@/components/seller/ShowingBooking';
import { ROUTES } from '@/constants/routes';

// Definerer en interface for at gøre det mere typesikkert, hvis muligt
interface CaseDetails {
    id: string;
    address: string;
    municipality: string;
    type: string;
    size: number;
    constructionYear?: number;
    buildYear?: number; // Kan være en alternativ, hvis constructionYear ikke findes
    energyLabel?: string;
    price?: string; // Antager dette er en formateret streng
    timeframe?: number;
    timeframeType?: string;
    priorities?: { speed: boolean; price: boolean; service: boolean; };
    flexiblePrice?: boolean;
    specialRequests?: string;
    sagsnummer: string;
    createdAt: string;
    status: string; // F.eks. 'active', 'showing_booked', 'showing_completed', 'offers_received'
    showingDate?: string; // Ny: Gemmer dato for fremvisning
    showingTime?: string; // Ny: Gemmer tid for fremvisning
    showingNotes?: string; // Ny: Eventuelle noter til fremvisning
    agentRegistrations: any[];
    offers: any[];
    // ... andre relevante felter
}

const SellerMyCase = () => {
    const { sellerCase, isLoading, refreshCase } = useSellerCase();
    const { toast } = useToast();

    // Bruger nu bookedShowingDetails til at styre visningen af dato/tid
    const [bookedShowingDetails, setBookedShowingDetails] = useState<{ date: string; time: string; notes?: string; } | null>(null);
    const [showingCompleted, setShowingCompleted] = useState(false);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [caseDetails, setCaseDetails] = useState<CaseDetails | null>(null);

    useEffect(() => {
        const loadCaseData = () => {
            if (!sellerCase) {
                setCaseDetails(null);
                setBookedShowingDetails(null);
                setShowingCompleted(false);
                return;
            }

            const cases = JSON.parse(localStorage.getItem('cases') || '[]');
            const fullCase: CaseDetails | undefined = cases.find((c: any) => c.id === sellerCase.id);

            if (fullCase) {
                setCaseDetails(fullCase);

                // Tjek for fremvisningsdata direkte i sagens objekt
                if (fullCase.showingDate && fullCase.showingTime) {
                    setBookedShowingDetails({
                        date: fullCase.showingDate,
                        time: fullCase.showingTime,
                        notes: fullCase.showingNotes || ''
                    });
                    // Sætter 'showingBooked' til true, da data findes
                    // Removed old setShowingBooked(true) which was relying on a separate state
                } else {
                    setBookedShowingDetails(null);
                }

                // Tjek om fremvisningen er markeret som afholdt baseret på status
                if (fullCase.status === 'showing_completed' || fullCase.status === 'offers_received') {
                    setShowingCompleted(true);
                } else {
                    setShowingCompleted(false);
                }
            } else {
                setCaseDetails(null);
                setBookedShowingDetails(null);
                setShowingCompleted(false);
            }
        };

        loadCaseData(); // Indlæs data ved mount og når sellerCase ændrer sig

        // Lyt efter events, der indikerer en ændring i sagsdata
        const handleCaseEvent = () => {
            console.log('Case event detected, refreshing case data');
            refreshCase(); // Opdaterer useSellerCase hook'ens state
            loadCaseData(); // Indlæs detaljeret data igen efter refresh
        };

        window.addEventListener('caseUpdated', handleCaseEvent);
        window.addEventListener('casesChanged', handleCaseEvent); // Hvis du dispatches dette fra andre steder
        window.addEventListener('showingBooked', handleCaseEvent); // Tilføjet, hvis dette event dispatches
        window.addEventListener('showingCancelled', handleCaseEvent); // Tilføjet for at opdatere efter annullering

        return () => {
            window.removeEventListener('caseUpdated', handleCaseEvent);
            window.removeEventListener('casesChanged', handleCaseEvent);
            window.removeEventListener('showingBooked', handleCaseEvent);
            window.removeEventListener('showingCancelled', handleCaseEvent);
        };
    }, [refreshCase, sellerCase]); // Dependencies for useEffect

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div>Indlæser...</div>
            </div>
        );
    }

    if (!sellerCase || !caseDetails) { // Sørg for at caseDetails også er indlæst
        return (
            <div className="min-h-screen bg-gray-50 font-lato">
                <Navigation />
                <div className="container mx-auto px-6 py-20">
                    <Card className="text-center">
                        <CardContent className="p-8">
                            <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold mb-2">Ingen aktiv sag</h2>
                            <p className="text-gray-600 mb-4">Du har ikke nogen aktiv sag endnu.</p>
                            <Link to={ROUTES.SELLER_DASHBOARD}> {/* Brug ROUTES konstant her */}
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

    const handleShowingBooked = (showingData: { date: string; time: string; notes?: string; }) => {
        console.log('Showing booked callback:', showingData);
        setShowBookingForm(false);

        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser.id && sellerCase) {
            const cases = JSON.parse(localStorage.getItem('cases') || '[]');
            const updatedCases = cases.map((c: CaseDetails) => { // Brug CaseDetails interface
                if (c.id === sellerCase.id) {
                    return {
                        ...c,
                        status: 'showing_booked', // Opdater status
                        showingDate: showingData.date, // Gem dato
                        showingTime: showingData.time, // Gem tid
                        showingNotes: showingData.notes || '', // Gem noter
                        updatedAt: new Date().toISOString()
                    };
                }
                return c;
            });

            localStorage.setItem('cases', JSON.stringify(updatedCases));

            // Opdater lokal state med det nye data
            setBookedShowingDetails({
                date: showingData.date,
                time: showingData.time,
                notes: showingData.notes
            });
            setShowingCompleted(false); // Nulstil completed, hvis fremvisning ændres

            // Udløs events for at sikre opdatering andre steder
            window.dispatchEvent(new CustomEvent('caseUpdated', { detail: sellerCase.id }));
            window.dispatchEvent(new CustomEvent('showingBooked', { detail: { caseId: sellerCase.id, ...showingData } }));
        }

        toast({
            title: "Fremvisning booket",
            description: "Mæglere kan nu tilmelde sig din fremvisning."
        });
    };

    const handleMarkCompleted = () => {
        if (!sellerCase) return;

        const cases = JSON.parse(localStorage.getItem('cases') || '[]');
        const updatedCases = cases.map((c: CaseDetails) => {
            if (c.id === sellerCase.id) {
                return {
                    ...c,
                    status: 'showing_completed', // Opdater status til completed
                    updatedAt: new Date().toISOString()
                };
            }
            return c;
        });

        localStorage.setItem('cases', JSON.stringify(updatedCases));
        setShowingCompleted(true); // Opdater lokal state

        window.dispatchEvent(new CustomEvent('caseUpdated', { detail: sellerCase.id }));
        refreshCase(); // Opdater useSellerCase hook'ens state

        toast({
            title: "Fremvisning markeret som afholdt",
            description: "Mæglere kan nu afgive tilbud."
        });
    };

    const handleChangeShowing = () => {
        // Åben bookingformularen igen, og sørg for at den kan genbruges
        setShowBookingForm(true);
        // Fjern den eksisterende booking fra UI midlertidigt for at vise formen
        setBookedShowingDetails(null);
        setShowingCompleted(false);
    };

    const handleCancelShowing = () => {
        if (!sellerCase) return;

        const confirmCancel = window.confirm("Er du sikker på, at du vil annullere fremvisningen? Dette vil fjerne tidspunktet og mæglere vil ikke kunne tilmelde sig.");
        if (!confirmCancel) return;

        const cases = JSON.parse(localStorage.getItem('cases') || '[]');
        const updatedCases = cases.map((c: CaseDetails) => {
            if (c.id === sellerCase.id) {
                // Fjern fremvisningsdetaljer og nulstil status
                const { showingDate, showingTime, showingNotes, ...rest } = c;
                return {
                    ...rest,
                    status: 'active', // Sæt status tilbage til 'aktiv', da ingen fremvisning er planlagt
                    updatedAt: new Date().toISOString()
                };
            }
            return c;
        });

        localStorage.setItem('cases', JSON.stringify(updatedCases)); // Gem den opdaterede cases-array

        setBookedShowingDetails(null); // Nulstil lokal state
        setShowingCompleted(false); // Nulstil lokal state

        window.dispatchEvent(new CustomEvent('caseUpdated', { detail: sellerCase.id }));
        window.dispatchEvent(new CustomEvent('showingCancelled', { detail: sellerCase.id })); // Nyt event
        refreshCase(); // Opdater useSellerCase hook'ens state

        toast({
            title: "Fremvisning annulleret",
            description: "Fremvisningstiden er blevet fjernet."
        });
    };

    const getMainButtonText = () => {
        if (showingCompleted || caseDetails.offers.length > 0) {
            return "Se tilbud";
        } else if (bookedShowingDetails) { // Brug bookedShowingDetails til at tjekke om fremvisning er booket
            return "Marker fremvisning som afholdt";
        } else {
            return "Book tid til fremvisning";
        }
    };

    const getMainButtonAction = () => {
        if (showingCompleted || caseDetails.offers.length > 0) {
            return () => window.location.href = ROUTES.SELLER_OFFERS; // Brug ROUTES konstant her
        } else if (bookedShowingDetails) {
            return handleMarkCompleted;
        } else {
            return handleBookShowing;
        }
    };

    // Formatere pris (funktion var allerede defineret)
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
                            {showBookingForm && (
                                <ShowingBooking onShowingBooked={handleShowingBooked} initialDate={bookedShowingDetails?.date} initialTime={bookedShowingDetails?.time} />
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
                                                showingCompleted || caseDetails.offers.length > 0 ? 'default' : 'secondary'
                                            }>
                                                {showingCompleted || caseDetails.offers.length > 0 ? 'Tilbud klar' :
                                                    bookedShowingDetails ? 'Fremvisning planlagt' : 'Aktiv'}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                                <div className="text-xl font-bold text-green-600">
                                                    {caseDetails.agentRegistrations.length}
                                                </div>
                                                <div className="text-xs text-gray-600">Tilmeldte mæglere</div>
                                            </div>
                                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                                                <div className="text-xl font-bold text-purple-600">
                                                    {caseDetails.offers.length}
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
                                    {(showingCompleted || caseDetails.offers.length > 0) && (
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
                    {caseDetails.agentRegistrations.length > 0 && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Tilmeldte Mæglere
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                    {caseDetails.agentRegistrations.map((registration) => (
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