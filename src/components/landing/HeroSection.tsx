import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, ArrowRight, Home } from 'lucide-react';

const HeroSection = () => {
  // Using the optimized (compressed) Danish house image
  const heroImageUrl = "/lovable-uploads/househero.png";
  const heroImageAltText = "Dansk villa til salg med TIL SALG skilt";

  // Check if seller is logged in
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isSellerLoggedIn = currentUser && currentUser.id && currentUser.type === 'seller';

  return (
    <section className="relative text-white py-32 md:py-40 overflow-hidden">
      {/* Background image container with overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImageUrl} 
          alt={heroImageAltText} 
          className="w-full h-full object-cover"
          <img 
          src={heroImageUrl} 
          alt={heroImageAltText} 
          className="w-full h-full object-cover"
          />

        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/60 to-transparent"></div>
      </div>
      
      {/* Container for content - positioned to the left */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          {isSellerLoggedIn ? (
            <>
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-8">
                <Home className="h-10 w-10 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                Velkommen tilbage!
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed font-medium max-w-2xl">
                Fortsæt med at administrere din sag og følg dine tilbud
              </p>
              
              <p className="text-lg md:text-xl text-blue-50 mb-12 leading-relaxed max-w-2xl">
                Du kan følge status på dit boligsalg og se tilbud fra ejendomsmæglere
              </p>
              
              <div className="flex justify-start">
                <Link to="/seller/dashboard">
                  <Button size="lg" className="px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 rounded-lg bg-white text-blue-900 hover:bg-blue-50 font-semibold hover:scale-105">
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Vend tilbage til Min side
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-8">
                <Home className="h-10 w-10 text-white" />
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
                HouseHub
              </h1>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-8 leading-tight text-blue-100">
                Sælg din bolig smart
              </h2>
              
              <p className="text-xl md:text-2xl text-blue-50 mb-8 leading-relaxed font-medium max-w-3xl">
                Få uforpligtende tilbud fra flere kvalificerede ejendomsmæglere – vælg den bedste løsning for dig
              </p>
              
              <p className="text-lg md:text-xl text-blue-100 mb-12 leading-relaxed max-w-2xl">
                Sammenlign mæglere, priser og services på én platform
              </p>
              
              <div className="flex justify-start">
                <div className="text-left">
                  <Link to="/seller/start">
                    <Button size="lg" className="px-10 py-5 text-xl shadow-xl hover:shadow-2xl transition-all duration-300 rounded-lg bg-white text-blue-900 hover:bg-blue-50 font-semibold hover:scale-105">
                      <Home className="mr-3 h-6 w-6" />
                      Start dit boligsalg her
                    </Button>
                  </Link>
                  <div className="mt-4 text-sm font-medium text-blue-100 flex items-start">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center cursor-help">
                            <Info className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Fast pris: 500 kr (inkl. moms) - refunderes ved aftale</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-blue-900 text-white border-blue-700">
                          <p>Gebyret på 500 kr refunderes fuldt ud, når du indgår en formidlingsaftale med en mægler gennem HouseHub.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
