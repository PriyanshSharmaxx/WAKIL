/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ==========================================
// DB SCHEMA SIMULATION & SHARED TYPES
// ==========================================

export enum UserRole {
  VISITOR = "VISITOR",
  USER = "USER",
  FAMILY_OWNER = "FAMILY_OWNER",
  FAMILY_MEMBER = "FAMILY_MEMBER",
  BUSINESS_OWNER = "BUSINESS_OWNER",
  BUSINESS_STAFF = "BUSINESS_STAFF",
  LAWYER = "LAWYER",
  OPERATIONS_STAFF = "OPERATIONS_STAFF",
  SUPPORT_AGENT = "SUPPORT_AGENT",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  CONTENT_MANAGER = "CONTENT_MANAGER",
  FINANCE_ADMIN = "FINANCE_ADMIN",
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  city: string;
  state: string;
  preferredLanguage: string; // 'EN' | 'HI'
  kycVerified: boolean;
  kycDocType?: string;
  kycDocNumber?: string;
}

export interface FamilyMember {
  id: string;
  ownerId: string;
  name: string;
  relation: string;
  phone: string;
  email?: string;
  kycVerified: boolean;
  emergencyEnabled: boolean;
}

export interface BusinessAccount {
  id: string;
  ownerId: string;
  companyName: string;
  gstin?: string;
  industry: string;
  seatCount: number;
  activePlan: string;
}

export interface TeamMember {
  id: string;
  businessId: string;
  userId: string;
  fullName: string;
  email: string;
  roleInCompany: string;
}

export interface Lawyer {
  id: string;
  userId: string;
  fullName: string;
  barCouncilNumber: string;
  verified: boolean;
  status: "PENDING" | "VERIFIED" | "SUSPENDED";
  experienceYears: number;
  languages: string[];
  practiceAreas: string[];
  city: string;
  rating: number;
  activeStatus: "ONLINE" | "OFFLINE" | "BUSY";
  avatarUrl: string;
}

export interface Consultation {
  id: string;
  clientId: string;
  clientName: string;
  lawyerId: string;
  lawyerName: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  practiceArea: string;
  createdAt: string;
  isEmergency: boolean;
  messages: ConsultationMessage[];
}

export interface ConsultationMessage {
  id: string;
  consultationId: string;
  senderId: string;
  senderRole: "CLIENT" | "LAWYER" | "AI_ASSISTANT";
  senderName: string;
  content: string;
  createdAt: string;
}

export interface EmergencyRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  location: { latitude: number; longitude: number; address: string };
  category: string; // e.g., 'POLICE_STOP', 'TRAFFIC_CHALLAN', 'DOMESTIC', 'CYBER_FRAUD'
  status: "INITIATED" | "QUEUE" | "CONNECTED" | "RESOLVED";
  lawyerId?: string;
  lawyerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  ownerId: string;
  name: string;
  category: "ID_PROOF" | "VEHICLE" | "PROPERTY" | "CONTRACT" | "EMERGENCY_EVIDENCE" | "OTHER";
  fileUrl: string;
  fileSize: string;
  uploadedAt: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  priceINR: number;
  billingPeriod: "MONTHLY" | "YEARLY";
  tier: "FREE" | "BASIC" | "PLUS" | "FAMILY" | "BUSINESS" | "SMB_PRO";
  features: { en: string[]; hi: string[] };
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  amountINR: number;
  gstINR: number;
  totalINR: number;
  status: "PAID" | "UNPAID" | "FAILED";
  issuedAt: string;
  planId: string;
}

export interface BlogPost {
  id: string;
  title: { en: string; hi: string };
  category: string;
  readTime: string;
  excerpt: { en: string; hi: string };
  content: { en: string; hi: string };
  publishedAt: string;
}

export interface FAQ {
  id: string;
  question: { en: string; hi: string };
  answer: { en: string; hi: string };
  category: string;
}

// ==========================================
// STATIC PLATFORM DATA (INDIA-FIRST)
// ==========================================

export const CITIES_COVERED = [
  { city: "Delhi / NCR", state: "Delhi", count: 120 },
  { city: "Mumbai", state: "Maharashtra", count: 185 },
  { city: "Bengaluru", state: "Karnataka", count: 145 },
  { city: "Hyderabad", state: "Telangana", count: 95 },
  { city: "Pune", state: "Maharashtra", count: 80 },
  { city: "Kolkata", state: "West Bengal", count: 65 },
  { city: "Chennai", state: "Tamil Nadu", count: 70 },
  { city: "Gurugram", state: "Haryana", count: 85 },
  { city: "Noida", state: "Uttar Pradesh", count: 60 }
];

export const SERVICE_AREAS = [
  { id: "police_guidance", label: "Police & FIR Guidance", desc: "Police interactions, FIR registration help, detention protocols, first disclosures.", detail: "Critical guidance if detoured, stopped, or called into local stations." },
  { id: "cyber_fraud", label: "Cyber Fraud & Theft", desc: "Immediate steps for financial scams, UPI frauds, card thefts, identity theft protection.", detail: "Immediate advice for freezing bank records and escalating with cyber-cells." },
  { id: "tenant_disputes", label: "Property & Landlord-Tenant", desc: "Security deposit recovery, eviction issues, leasing agreements, co-working spaces.", detail: "Prevent and mitigate local landlord or tenant co-living escalations." },
  { id: "family_advice", label: "Family & Inheritances", desc: "Marital rights, custody advice, wills drafting guidance, partition concerns, safety measures.", detail: "Compassionate, human legal consultation under strict privacy boundaries." },
  { id: "business_compliance", label: "Small Business & Startups", desc: "GST alignment, founder agreements, vendor agreements, legal notice responses.", detail: "Preventative legal armor for small Indian businesses, consultants and SaaS founders." },
  { id: "challan_emergency", label: "Traffic Stop / Challans", desc: "Arbitrary vehicle towing, road rule violation validation, over-speeding citations.", detail: "Assess legal bounds, appropriate documentation matching, fine procedures." }
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "pay_per_use",
    name: "Pay As You Go",
    priceINR: 0,
    billingPeriod: "MONTHLY",
    tier: "FREE",
    features: {
      en: [
        "1-click Emergency Queue Placement",
        "Direct connection to verified advocate (₹999 / consult)",
        "Standard access to template vault",
        "Real-time location capture during help"
      ],
      hi: [
        "1-क्लिक इमरजेंसी कतार",
        "सत्यापित वकील से सीधा संपर्क (₹999 प्रति परामर्श)",
        "मानक कानूनी दस्तावेज टेम्पलेट",
        "मदद के दौरान वास्तविक समय की स्थिति"
      ]
    }
  },
  {
    id: "indiv_basic",
    name: "Individual Basic",
    priceINR: 199,
    billingPeriod: "MONTHLY",
    tier: "BASIC",
    features: {
      en: [
        "1 Emergency Call / Month (Free Connect)",
        "1 Preventive Scheduled Call / Month",
        "Access in 5 Indian Languages",
        "Basic Secure Personal VAULT (50MB)",
        "Direct SMS Alert to 2 Emergency Contacts"
      ],
      hi: [
        "1 आपातकालीन कॉल / महीना (मुफ्त)",
        "1 पूर्व नियोजित परामर्श / महीना",
        "5 भारतीय भाषाओं में समर्थन",
        "सुरक्षित पर्सनल वॉल्ट (50MB)",
        "2 आपातकालीन संपर्कों को सीधे एसएमएस अलर्ट"
      ]
    }
  },
  {
    id: "indiv_plus",
    name: "Individual Plus",
    priceINR: 399,
    billingPeriod: "MONTHLY",
    tier: "PLUS",
    features: {
      en: [
        "Unlimited Emergency Connections",
        "3 Preventive Scheduled Calls / Month",
        "Priority Support Line (SLA < 5 mins)",
        "Complete Legal Document Pre-Analysis by AI",
        "Family Escalation Panel",
        "Personal Secure VAULT (500MB)"
      ],
      hi: [
        "असीमित आपातकालीन संपर्क स्थिति",
        "3 पूर्व नियोजित परामर्श / महीना",
        "प्राथमिकता सहायता लाइन (कम से कम 5 मिनट)",
        "एआई द्वारा कानूनी दस्तावेज की जांच",
        "पारिवारिक आपातकालीन पैनल",
        "सुरक्षित पर्सनल वॉल्ट (500MB)"
      ]
    }
  },
  {
    id: "family_shield",
    name: "Family Shield",
    priceINR: 699,
    billingPeriod: "MONTHLY",
    tier: "FAMILY",
    features: {
      en: [
        "Covers up to 4 Family Members",
        "Unlimited Emergency Connect for all members",
        "Shared Family Vault (2GB)",
        "Direct elder parent panic support route",
        "Dedicated Women Safety Legal Assistance",
        "Free review of up to 4 rent/property deeds / year"
      ],
      hi: [
        "4 परिवार के सदस्यों तक का कवर",
        "सभी सदस्यों के लिए असीमित आपातकालीन परामर्श",
        "साझा फैमिली वॉल्ट (2GB)",
        "बुजुर्ग माता-पिता के लिए पैनिक सहायता रूट",
        "विशेष महिला सुरक्षा कानूनी सहायता",
        "साल में 4 किराए/संपत्ति दस्तावेजों की मुफ्त समीक्षा"
      ]
    }
  },
  {
    id: "business_starter",
    name: "Business Starter",
    priceINR: 2499,
    billingPeriod: "MONTHLY",
    tier: "BUSINESS",
    features: {
      en: [
        "Up to 10 Employee / Team Seats",
        "Legal Wellness Audits for Company",
        "GST Notice response frameworks",
        "Unlimited contract review and template generation",
        "Corporate Lawyer Consults (Video Call)",
        "Corporate Secure Vault (10GB)"
      ],
      hi: [
        "10 कर्मचारी / टीम सीट",
        "कंपनी के लिए कानूनी ऑडिट",
        "जीएसटी नोटिस जवाब रूपरेखा",
        "असीमित अनुबंध समीक्षा और निर्माण",
        "कॉर्पोरेट वकील परामर्श (वीडियो कॉल)",
        "कॉर्पोरेट सुरक्षित वॉल्ट (10GB)"
      ]
    }
  }
];

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: "b1",
    category: "Police Rights",
    readTime: "4 min read",
    title: {
      en: "Your Fundamental Rights During a Police Stop in India",
      hi: "भारत में पुलिस कार्रवाई के दौरान आपके मौलिक अधिकार"
    },
    excerpt: {
      en: "Learn exactly what state rules mandate regarding identity verification, vehicle search, and legal protection under the Indian legal code.",
      hi: "पहचान पत्र की जांच, वाहन की तलाशी और कानून के तहत सुरक्षा के बारे में जानें।"
    },
    content: {
      en: "Articles 20, 21, and 22 of the Indian Constitution construct a vital security shield for citizens. Under law, unless an officer has a direct warrant or reasonable suspect boundaries for non-bailable matters, they cannot force detention without declaring the specific grounds. Always demand standard ID cards, request women representation if conducting queries past sunset, and note down vehicle or batch particulars.",
      hi: "भारतीय संविधान के अनुच्छेद 20, 21 और 22 नागरिकों के लिए महत्वपूर्ण सुरक्षा कवच बनाते हैं। कानून के तहत, जब तक किसी अधिकारी के पास कोई सीधा वारंट नहीं होता, वे बंदी नहीं बना सकते।"
    },
    publishedAt: "May 25, 2026"
  },
  {
    id: "b2",
    category: "Cyber Crime",
    readTime: "5 min read",
    title: {
      en: "Frozen Bank Accounts: What to do after UPI Scams",
      hi: "खाता फ्रीज होने पर क्या करें: यूपीआई फ्रॉड से बचने की गाइड"
    },
    excerpt: {
      en: "A step-by-step checklist on raising cyber disputes, registering online grievances, and avoiding escalation.",
      hi: "साइबर फ्रॉड के बाद बैंक रिकॉर्ड को ब्लॉक करने और शिकायत दर्ज करने की चरणबद्ध गाइड।"
    },
    content: {
      en: "With instant transactions, UPI scams have grown. In case you lose money via fictitious phishing links or fake agents, file a national grievance immediately on cybercrime.gov.in. Take screenshots of transaction IDs, report to your bank node within 2 hours, and contact legal professionals for freezing accounts safely.",
      hi: "यूपीआई फ्रॉड होने पर तुरंत cybercrime.gov.in पर राष्ट्रीय शिकायत दर्ज करें। लेनदेन आईडी का स्क्रीनशॉट लें और २ घंटे के भीतर बैंक को रिपोर्ट करें।"
    },
    publishedAt: "May 20, 2026"
  }
];

export const MOCK_FAQS: FAQ[] = [
  {
    id: "f1",
    category: "General",
    question: {
      en: "Is Wakil a law firm?",
      hi: "क्या वकील (Wakil) एक लॉ फर्म है?"
    },
    answer: {
      en: "No, Wakil is a trusted legal technology platform. We facilitate direct, instant connections between active clients and peer-reviewed, verified, independent advocates registered under State Bar Councils. We never promise court outcomes but assure professional legal support.",
      hi: "नहीं, वकील एक लॉ-टेक कंपनी है। हम स्टेट बार काउंसिल के तहत पंजीकृत स्वतंत्र अधिवक्ताओं से आपका त्वरित संपर्क कराते हैं।"
    }
  },
  {
    id: "f2",
    category: "Emergency",
    question: {
      en: "How does the Emergency Lawyer Connection work?",
      hi: "इमरजेंसी एडवोकेट संपर्क सुविधा कैसे काम करती है?"
    },
    answer: {
      en: "Once you lock-in an emergency request with geotags, the platform automatically routes your issue to our high-priority lawyer network queue. Certified advocates active in your city will initiate an instant voice/chat consultation to navigate the spot procedure safely.",
      hi: "जैसे ही आप जियोटैग के साथ आपातकालीन अनुरोध भेजते हैं, हमारा सिस्टम आपके शहर में सक्रिय वकीलों को सूचित कर सीधे संपर्क स्थापित कराता है।"
    }
  },
  {
    id: "f3",
    category: "Pricing",
    question: {
      en: "Can I add multiple people to the Family Shield plan?",
      hi: "क्या मैं फैमिली शील्ड प्लान में कई लोगों को जोड़ सकता हूँ?"
    },
    answer: {
      en: "Yes, the Family Shield protects up to 4 family members. Each individual receives their own credentials and has direct access to the emergency connector and private document vaults.",
      hi: "हाँ, फैमिली शील्ड में आप परिवार के 4 सदस्यों को जोड़ सकते हैं। प्रत्येक सदस्य के पास स्वतंत्र लॉग-इन और आपातकालीन सहायता उपलब्ध होती है।"
    }
  }
];

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  city: string;
  quote: { en: string; hi: string };
  stars: number;
}

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Aditya Verma",
    role: "E-Commerce Startup Founder",
    city: "Bengaluru",
    quote: {
      en: "Wakil saved my business thousands of rupees in preventive contract errors. When a vendor dispute came out of nowhere, we consult-booked a verified corporate expert in minutes.",
      hi: "वकील ने हमारे स्टार्टअप को निवारक परामर्श से हजारों रुपये बचाए। जब एक विक्रेता विवाद अचानक सामने आया, तो हमें मिनटों में एक कॉर्पोरेट वकील से सहायता मिली।"
    },
    stars: 5
  },
  {
    id: "t2",
    name: "Pooja Sharma",
    role: "Freelance Creative Lead",
    city: "Mumbai",
    quote: {
      en: "Having the Emergency Shield active makes me feel ten times more secure when traffic enforcement or cyber-scams happen online. Fast responses & transparent pricing.",
      hi: "ट्रैफिक पुलिस या साइबर फ्रॉड होने पर इमरजेंसी शील्ड सक्रिय होने से मुझे बहुत सुरक्षित महसूस होता है। त्वरित प्रतिक्रिया और पारदर्शी शुल्क मूल्य!"
    },
    stars: 5
  }
];
