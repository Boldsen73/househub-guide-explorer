
export const ROUTES = {
  // General routes
  HOME: '/',
  LANDING: '/landing',
  LOGIN: '/login',
  THANKS: '/tak',
  ABOUT: '/om',
  ABOUT_US: '/om-os',
  CONTACT: '/kontakt',
  HOW_IT_WORKS: '/hvordan-virker-det',

  // Seller routes
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

  // Agent routes
  AGENT_START: '/maegler',
  AGENT_SIGNUP: '/maegler/opret-bruger',
  AGENT_LOGIN: '/maegler/login',
  AGENT_DASHBOARD: '/maegler/dashboard',
  AGENT_BROWSE_CASES: '/maegler/gennemse-sager',
  AGENT_BROWSE_CASES_ALT: '/maegler/browse-cases',
  AGENT_CASE_DETAIL: '/maegler/case/:id',
  AGENT_CASE_DETAIL_ALT: '/maegler/sag/:id',
  AGENT_SUBMIT_OFFER: '/maegler/afgiv-tilbud/:id',
  AGENT_VIEW_OFFER: '/maegler/tilbud/:id',
  AGENT_MY_OFFERS: '/maegler/mine-tilbud',
  AGENT_MESSAGES: '/maegler/beskeder',
  AGENT_PROFILE: '/maegler/profil',
  AGENT_SETTINGS: '/maegler/indstillinger',
  AGENT_STATISTICS: '/maegler/statistik',
  AGENT_ARCHIVE: '/maegler/arkiv',
  AGENT_TERMS: '/maegler/vilkaar',
  AGENT_CONFIRMATION: '/maegler/bekræftelse',

  // Admin routes
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',

  // Legal routes
  PRIVACY_POLICY: '/privatlivspolitik',
  TERMS_AND_CONDITIONS: '/vilkaar',

  // 404 route
  NOT_FOUND: '*',
};
