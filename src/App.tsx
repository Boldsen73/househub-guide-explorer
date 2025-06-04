
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from './components/ScrollToTop';
import { ROUTES } from './constants/routes';

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
import SellerWishes from "./pages/seller/SellerWishes";
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
          <Route path={ROUTES.HOME} element={<Index />} />
          <Route path={ROUTES.LANDING} element={<LandingPage />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.THANKS} element={<Thanks />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.ABOUT_US} element={<AboutUs />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />
          <Route path={ROUTES.HOW_IT_WORKS} element={<HowItWorks />} />

          {/* Seller routes */}
          <Route path={ROUTES.SELLER_START} element={<SellerStart />} />
          <Route path="/seller/start" element={<SellerStart />} />
          <Route path="/saelger/start" element={<SellerStart />} /> {/* Danish route */}
          <Route path={ROUTES.SELLER_SIGNUP} element={<SellerSignup />} />
          <Route path={ROUTES.SELLER_LOGIN} element={<SellerLogin />} />
          <Route path={ROUTES.SELLER_DASHBOARD} element={<SellerDashboard />} />
          <Route path={ROUTES.SELLER_PROPERTY_DATA} element={<PropertyData />} />
          <Route path={ROUTES.SELLER_PROPERTY_DATA_NEW} element={<PropertyData />} />
          <Route path={ROUTES.SELLER_PROPERTY_DATA_EXTENDED} element={<PropertyDataExtended />} />
          <Route path={ROUTES.SELLER_WISHES} element={<SellerWishes />} />
          <Route path={ROUTES.SELLER_PRICE_INFO} element={<PriceInfo />} />
          <Route path={ROUTES.SELLER_PRICE_DETAILS} element={<PriceInfo />} />
          <Route path={ROUTES.SELLER_MY_CASE} element={<SellerMyCase />} />
          <Route path={ROUTES.SELLER_OFFERS} element={<SellerOffers />} />
          <Route path={ROUTES.SELLER_MESSAGES} element={<SellerMessages />} />
          <Route path={ROUTES.SELLER_INFO} element={<SellerInfo />} />
          <Route path={ROUTES.SELLER_TERMS} element={<SellerTerms />} />
          <Route path={ROUTES.SELLER_SETTINGS} element={<SellerSettings />} />
          <Route path={ROUTES.SELLER_PAYMENT} element={<SellerPayment />} />
          <Route path={ROUTES.SELLER_CONFIRMATION} element={<SellerConfirmation />} />
          <Route path={ROUTES.SELLER_THANK_YOU} element={<SellerThankYou />} />
          <Route path={ROUTES.SELLER_THANK_YOU_PAGE} element={<SellerThankYouPage />} />
          <Route path={ROUTES.SELLER_FINAL_CONFIRMATION} element={<SellerFinalConfirmation />} />
          <Route path={ROUTES.SELLER_CASE_STATUS} element={<SellerCaseStatus />} />
          <Route path={ROUTES.SELLER_UPLOAD_DOCUMENTS} element={<UploadDocuments />} />
          <Route path={ROUTES.SELLER_WAITING_FOR_OFFERS} element={<WaitingForOffers />} />

          {/* Agent routes - updated to English paths */}
          <Route path={ROUTES.AGENT_START} element={<AgentStart />} />
          <Route path="/agent/start" element={<AgentStart />} />
          <Route path="/maegler" element={<AgentStart />} /> {/* Legacy redirect */}
          <Route path={ROUTES.AGENT_SIGNUP} element={<AgentSignup />} />
          <Route path="/maegler/opret-bruger" element={<AgentSignup />} /> {/* Legacy redirect */}
          <Route path={ROUTES.AGENT_LOGIN} element={<AgentLogin />} />
          <Route path="/maegler/login" element={<AgentLogin />} /> {/* Legacy redirect */}
          <Route path={ROUTES.AGENT_DASHBOARD} element={<AgentDashboard />} />
          <Route path="/maegler/dashboard" element={<AgentDashboard />} /> {/* Legacy redirect */}
          <Route path={ROUTES.AGENT_BROWSE_CASES} element={<BrowseCases />} />
          <Route path="/maegler/gennemse-sager" element={<BrowseCases />} /> {/* Legacy redirect */}
          <Route path="/maegler/browse-cases" element={<BrowseCases />} /> {/* Legacy redirect */}
          <Route path={ROUTES.AGENT_CASE_DETAIL} element={<CaseDetailsPage />} />
          <Route path="/maegler/case/:id" element={<CaseDetailsPage />} /> {/* Legacy redirect */}
          <Route path="/maegler/sag/:id" element={<AgentCaseDetail />} /> {/* Legacy redirect */}
          <Route path={ROUTES.AGENT_SUBMIT_OFFER} element={<SubmitOffer />} />
          <Route path="/maegler/afgiv-tilbud/:id" element={<SubmitOffer />} /> {/* Legacy redirect */}
          <Route path={ROUTES.AGENT_VIEW_OFFER} element={<ViewOffer />} />
          <Route path="/maegler/tilbud/:id" element={<ViewOffer />} /> {/* Legacy redirect */}
          <Route path={ROUTES.AGENT_MY_OFFERS} element={<AgentMyOffers />} />
          <Route path="/maegler/mine-tilbud" element={<AgentMyOffers />} /> {/* Legacy redirect */}
          <Route path={ROUTES.AGENT_MESSAGES} element={<AgentMessages />} />
          <Route path="/maegler/beskeder" element={<AgentMessages />} /> {/* Legacy redirect */}
          <Route path={ROUTES.AGENT_PROFILE} element={<AgentProfile />} />
          <Route path="/maegler/profil" element={<AgentProfile />} /> {/* Legacy redirect */}
          <Route path={ROUTES.AGENT_SETTINGS} element={<AgentSettings />} />
          <Route path="/maegler/indstillinger" element={<AgentSettings />} /> {/* Legacy redirect */}
          <Route path={ROUTES.AGENT_STATISTICS} element={<AgentStatistics />} />
          <Route path="/maegler/statistik" element={<AgentStatistics />} /> {/* Legacy redirect */}
          <Route path={ROUTES.AGENT_ARCHIVE} element={<AgentArchive />} />
          <Route path="/maegler/arkiv" element={<AgentArchive />} /> {/* Legacy redirect */}
          <Route path={ROUTES.AGENT_TERMS} element={<AgentTerms />} />
          <Route path="/maegler/vilkaar" element={<AgentTerms />} /> {/* Legacy redirect */}
          <Route path={ROUTES.AGENT_CONFIRMATION} element={<AgentConfirmation />} />
          <Route path="/maegler/bekræftelse" element={<AgentConfirmation />} /> {/* Legacy redirect */}

          {/* Admin routes */}
          <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />

          {/* Legal routes */}
          <Route path={ROUTES.PRIVACY_POLICY} element={<PrivatlivsPolitik />} />
          <Route path={ROUTES.TERMS_AND_CONDITIONS} element={<Vilkaar />} />

          {/* 404 route */}
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
