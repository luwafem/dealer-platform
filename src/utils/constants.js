// Subscription plans
export const SUBSCRIPTION_PLANS = {
  BASIC: 'basic',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
};

export const PLAN_DETAILS = {
  [SUBSCRIPTION_PLANS.BASIC]: {
    name: 'Basic',
    price: 0,
    maxListings: 2,
    features: [
      'Basic search',
      'View listings',
      '2 active listings max',
    ],
  },
  [SUBSCRIPTION_PLANS.PRO]: {
    name: 'Pro',
    price: 5000,
    maxListings: 15,
    features: [
      'Advanced search filters',
      'Compare tool',
      'Price alerts',
      'Priority support',
      'Eligible for verified badge',
      '15 active listings max',
    ],
  },
  [SUBSCRIPTION_PLANS.ENTERPRISE]: {
    name: 'Enterprise',
    price: 12000,
    maxListings: Infinity, // unlimited
    features: [
      'All Pro features',
      'Verified badge immediately',
      'API access',
      'Bulk listing tools',
      'Market intelligence reports',
      'Dedicated account manager',
      'Featured listings',
      'Unlimited active listings',
    ],
  },
};

// Paystack plan codes (create these in your Paystack dashboard)
export const PAYSTACK_PLANS = {
  PRO: 'PLN_3hz4w006cflo26x',      // replace with your actual plan code
  ENTERPRISE: 'PLN_3hz4w006cflo26x',
};

// WhatsApp contact fee (pay-per-contact)
export const WHATSAPP_CONTACT_FEE = 250; // ₦250 per contact

// Car categories
export const CAR_CATEGORIES = {
  TOKUNBO: 'tokunbo',
  NIGERIAN_USED: 'nigerian_used',
  NIGERIA_NEW: 'nigeria_new',
  FOREIGN_USED: 'foreign_used',
};

// Engine types
export const ENGINE_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];

// Transmission types
export const TRANSMISSION_TYPES = ['Automatic', 'Manual', 'CVT'];

// Locations (States in Nigeria)
export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

// Local Government Areas (can be expanded per state)
export const LGA_BY_STATE = {
  Lagos: ['Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry', 'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere'],
  // ... add others as needed
};

// Deal breaker options (for advanced filters)
export const DEAL_BREAKERS = [
  'rebuilt_engine',
  'accident_history',
  'customs_issues',
  'no_papers',
  'resprayed',
  'multiple_owners',
  'commercial_use',
];

// Must-have options
export const MUST_HAVES = [
  'sunroof',
  'leather',
  'navigation',
  '4x4',
  'original_paint',
  'service_history',
];

// Badge types
export const BADGE_TYPES = {
  BASIC: 'basic',
  VERIFIED: 'verified',
  TOP: 'top',
};

// Car makes (common in Nigeria)
export const CAR_MAKES = [
  'Toyota', 'Honda', 'Hyundai', 'Kia', 'Nissan', 'Mitsubishi', 'Ford',
  'Mercedes-Benz', 'BMW', 'Lexus', 'Mazda', 'Volkswagen', 'Peugeot',
  'Chevrolet', 'GMC', 'Jeep', 'Land Rover', 'Range Rover', 'Suzuki',
  'Chrysler', 'Dodge', 'Acura', 'Infiniti', 'Volvo', 'Audi', 'Porsche',
  'Jaguar', 'Ferrari', 'Lamborghini', 'Bentley', 'Rolls-Royce',
];

// Countries of origin for Tokunbo
export const TOKUNBO_COUNTRIES = ['USA', 'Canada', 'Japan', 'Europe', 'South Africa'];

// Customs status
export const CUSTOMS_STATUS = ['Paid', 'Partially paid', 'Not paid', 'Under dispute'];

// Customs document
export const CUSTOMS_DOCUMENT = ['Clean', 'Questionable', 'Fake'];

// Shipping damage
export const SHIPPING_DAMAGE = ['None', 'Minor', 'Major'];

// Ports of clearing
export const PORTS = ['Tin Can', 'PTML', 'Apapa', 'Cotonou'];

// Owner count
export const OWNER_COUNT = ['1', '2', '3', '4+'];

// Usage history
export const USAGE_HISTORY = ['Private', 'Commercial taxi', 'Commercial Uber', 'Company', 'Government'];

// Service history
export const SERVICE_HISTORY = ['Full documented', 'Partial', 'None'];

// Accident history in Nigeria
export const ACCIDENT_NIGERIA = ['None', 'Minor', 'Major', 'Wreck rebuild'];

// Roadworthiness
export const ROADWORTHINESS = ['Valid', 'Expired', 'Never had'];

// Engine condition
export const ENGINE_CONDITION = ['Original', 'Rebuilt', 'Replaced', 'Needs work'];

// Transmission condition
export const TRANSMISSION_CONDITION = ['Original', 'Rebuilt', 'Slipping', 'Needs work'];

// Paint
export const PAINT = ['Original', 'Resprayed recent', 'Resprayed old', 'Partial'];

// Rust
export const RUST = ['None', 'Surface', 'Structural'];

// Interior condition
export const INTERIOR_CONDITION = ['Mint', 'Good', 'Fair', 'Worn', 'Torn'];

// AC condition
export const AC_CONDITION = ['Working', 'Needs gas', 'Compressor dead', 'Not working'];