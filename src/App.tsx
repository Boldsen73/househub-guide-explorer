
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from './components/ScrollToTop';

// Pages
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Thanks from "./pages/Thanks";
import About from "./pages/About";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";

// Seller pages
import SellerStart from "./pages/seller/SellerStart";
import SellerSignup from "./pages/seller/SellerSignup";
import SellerLogin from "./pages/seller/SellerLogin";
import SellerDashboard from "./pages/seller/SellerDashboard";
import PropertyData from "./pages/seller/PropertyData";
import PropertyDataExtended from "./pages/seller/PropertyDataExtended";
import SalePreferences from "./pages/seller/SalePreferences";
import PriceInfo from "./pages/seller/PriceInfo";
import SellerMyCase from "./pages/seller/SellerMyCase";
import SellerOffers from "./pages/seller/SellerOffers";
import SellerMessages from "./pages/seller/SellerMessages";
import SellerInfo from "./pages/seller/SellerInfo";
import SellerTerms from "./pages/seller/SellerTerms";
import SellerSettings from "./pages/seller/SellerSettings";
import SellerPayment from "./pages/seller/SellerPayment";
import SellerConfirmation from "./pages/seller/SellerConfirmation";
import SellerThankYou from "./pages/seller/SellerThankYou";
import SellerThankYouPage from "./pages/seller/SellerThankYouPage";
import SellerFinalConfirmation from "./pages/seller/SellerFinalConfirmation";
import SellerCaseStatus from "./pages/seller/SellerCaseStatus";
import UploadDocuments from "./pages/seller/UploadDocuments";
import WaitingForOffers from "./pages/seller/WaitingForOffers";

// Agent pages
import AgentStart from "./pages/agent/AgentStart";
import AgentSignup from "./pages/agent/AgentSignup";
import AgentLogin from "./pages/agent/AgentLogin";
import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentBrowseCases from "./pages/agent/AgentBrowseCases";
import BrowseCases from "./pages/agent/BrowseCases";
import CaseDetailsPage from "./pages/agent/CaseDetailsPage";
import AgentCaseDetail from "./pages/agent/AgentCaseDetail";
import SubmitOffer from "./pages/agent/SubmitOffer";
import ViewOffer from "./pages/agent/ViewOffer";
import AgentMyOffers from "./pages/agent/AgentMyOffers";
import AgentMessages from "./pages/agent/AgentMessages";
import AgentProfile from "./pages/agent/AgentProfile";
import AgentSettings from "./pages/agent/AgentSettings";
import AgentStatistics from "./pages/agent/AgentStatistics";
import AgentArchive from "./pages/agent/AgentArchive";
import AgentTerms from "./pages/agent/AgentTerms";
import AgentConfirmation from "./pages/agent/AgentConfirmation";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Legal pages
import PrivatlivsPolitik from "./pages/privatlivspolitik";
import Vilkaar from "./pages/vilkaar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* General routes */}
          <Route path="/" element={<Index />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tak" element={<Thanks />} />
          <Route path="/om" element={<About />} />
          <Route path="/om-os" element={<AboutUs />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="/hvordan-virker-det" element={<HowItWorks />} />

          {/* Seller routes */}
          <Route path="/saelger" element={<SellerStart />} />
          <Route path="/saelger/start" element={<SellerStart />} />
          <Route path="/saelger/opret-bruger" element={<SellerSignup />} />
          <Route path="/saelger/login" element={<SellerLogin />} />
          <Route path="/saelger/dashboard" element={<SellerDashboard />} />
          <Route path="/saelger/boligdata" element={<PropertyData />} />
          <Route path="/saelger/boligdata-ny" element={<PropertyData />} />
          <Route path="/saelger/boligdata-udvidet" element={<PropertyDataExtended />} />
          <Route path="/saelger/salgsønsker" element={<SalePreferences />} />
          <Route path="/saelger/prisinfo" element={<PriceInfo />} />
          <Route path="/saelger/prisoplysninger" element={<PriceInfo />} />
          <Route path="/saelger/min-sag" element={<SellerMyCase />} />
          <Route path="/saelger/tilbud" element={<SellerOffers />} />
          <Route path="/saelger/beskeder" element={<SellerMessages />} />
          <Route path="/saelger/sælger-info" element={<SellerInfo />} />
          <Route path="/saelger/vilkaar" element={<SellerTerms />} />
          <Route path="/saelger/indstillinger" element={<SellerSettings />} />
          <Route path="/saelger/betaling" element={<SellerPayment />} />
          <Route path="/saelger/bekræftelse" element={<SellerConfirmation />} />
          <Route path="/saelger/tak" element={<SellerThankYou />} />
          <Route path="/saelger/tak-side" element={<SellerThankYouPage />} />
          <Route path="/saelger/endelig-bekræftelse" element={<SellerFinalConfirmation />} />
          <Route path="/saelger/sag-status" element={<SellerCaseStatus />} />
          <Route path="/saelger/upload-dokumenter" element={<UploadDocuments />} />
          <Route path="/saelger/venter-på-tilbud" element={<WaitingForOffers />} />

          {/* Agent routes */}
          <Route path="/maegler" element={<AgentStart />} />
          <Route path="/maegler/start" element={<AgentStart />} />
          <Route path="/maegler/opret-bruger" element={<AgentSignup />} />
          <Route path="/maegler/login" element={<AgentLogin />} />
          <Route path="/maegler/dashboard" element={<AgentDashboard />} />
          <Route path="/maegler/gennemse-sager" element={<AgentBrowseCases />} />
          <Route path="/maegler/browse-cases" element={<BrowseCases />} />
          <Route path="/maegler/case/:id" element={<CaseDetailsPage />} />
          <Route path="/maegler/sag/:id" element={<AgentCaseDetail />} />
          <Route path="/maegler/afgiv-tilbud/:id" element={<SubmitOffer />} />
          <Route path="/maegler/tilbud/:id" element={<ViewOffer />} />
          <Route path="/maegler/mine-tilbud" element={<AgentMyOffers />} />
          <Route path="/maegler/beskeder" element={<AgentMessages />} />
          <Route path="/maegler/profil" element={<AgentProfile />} />
          <Route path="/maegler/indstillinger" element={<AgentSettings />} />
          <Route path="/maegler/statistik" element={<AgentStatistics />} />
          <Route path="/maegler/arkiv" element={<AgentArchive />} />
          <Route path="/maegler/vilkaar" element={<AgentTerms />} />
          <Route path="/maegler/bekræftelse" element={<AgentConfirmation />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Legal routes */}
          <Route path="/privatlivspolitik" element={<PrivatlivsPolitik />} />
          <Route path="/vilkaar" element={<Vilkaar />} />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
