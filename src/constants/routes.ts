// src/constants/routes.ts

export const ROUTES = {
  // General routes
  HOME: '/',
  LANDING: '/landing',
  LOGIN: '/login',
  THANKS: '/tak', // Overvej at ændre til /thank-you for konsistens
  ABOUT: '/om', // Overvej at ændre til /about for konsistens
  ABOUT_US: '/om-os', // Overvej at ændre til /about-us for konsistens
  CONTACT: '/kontakt', // Overvej at ændre til /contact for konsistens
  HOW_IT_WORKS: '/hvordan-virker-det', // Overvej at ændre til /how-it-works for konsistens

  // Seller routes (disse er nu konsistente og bruger 'seller')
  SELLER_START: '/seller',
  SELLER_SIGNUP: '/seller/signup',
  SELLER_LOGIN: '/seller/login',
  SELLER_DASHBOARD: '/seller/dashboard',
  SELLER_PROPERTY_DATA: '/seller/property-data',
  SELLER_PROPERTY_DATA_NEW: '/seller/property-data-new',
  SELLER_PROPERTY_DATA_EXTENDED: '/seller/property-data-extended',
  SELLER_WISHES: '/seller/seller-wishes',
  SELLER_PRICE_INFO: '/seller/price-info',
  SELLER_PRICE_DETAILS: '/seller/price-details',
  SELLER_MY_CASE: '/seller/my-case',
  SELLER_OFFERS: '/seller/offers',
  SELLER_MESSAGES: '/seller/messages',
  SELLER_INFO: '/seller/seller-info',
  SELLER_TERMS: '/seller/terms',
  SELLER_SETTINGS: '/seller/settings',
  SELLER_PAYMENT: '/seller/payment',
  SELLER_CONFIRMATION: '/seller/confirmation',
  SELLER_THANK_YOU: '/seller/thank-you',
  SELLER_THANK_YOU_PAGE: '/seller/thank-you-page',
  SELLER_FINAL_CONFIRMATION: '/seller/final-confirmation',
  SELLER_CASE_STATUS: '/seller/case-status',
  SELLER_UPLOAD_DOCUMENTS: '/seller/upload-documents',
  SELLER_WAITING_FOR_OFFERS: '/seller/waiting-for-offers',

  // Agent routes (DISSE ER NU KORRIGERET og bruger 'agent' og engelske termer)
  AGENT_START: '/agent',
  AGENT_SIGNUP: '/agent/signup',
  AGENT_LOGIN: '/agent/login',
  AGENT_DASHBOARD: '/agent/dashboard',
  AGENT_BROWSE_CASES: '/agent/browse-cases',
  AGENT_CASE_DETAIL: '/agent/case/:id', // Den primære rute for sagsdetaljer
  AGENT_SUBMIT_OFFER: '/agent/submit-offer/:id',
  AGENT_VIEW_OFFER: '/agent/view-offer/:id',
  AGENT_MY_OFFERS: '/agent/my-offers',
  AGENT_MESSAGES: '/agent/messages',
  AGENT_PROFILE: '/agent/profile',
  AGENT_SETTINGS: '/agent/settings',
  AGENT_STATISTICS: '/agent/statistics',
  AGENT_ARCHIVE: '/agent/archive',
  AGENT_TERMS: '/agent/terms',
  AGENT_CONFIRMATION: '/agent/confirmation',

  // Overvej stærkt at fjerne disse alternative ruter, hvis de ikke bruges aktivt.
  // De kan skabe forvirring og duplikering. Hvis du beslutter at beholde dem,
  // skal du sikre, at de også bruger 'agent' korrekt.
  AGENT_BROWSE_CASES_ALT: '/agent/browse-cases-alt',
  AGENT_CASE_DETAIL_ALT: '/agent/case-detail-alt/:id',

  // Admin routes
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',

  // Legal routes (Overvej at ændre filnavnene i src/pages/legal/ til engelsk for konsistens)
  PRIVACY_POLICY: '/privacy-policy', // Tidligere /privatlivs-politik
  TERMS_AND_CONDITIONS: '/terms-and-conditions', // Tidligere /vilkaar

  // 404 Not Found route
  NOT_FOUND: '*', // Standard catch-all for ukendte ruter
};