/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini SDK as required by system directives to avoid crash on startup
let aiClient: GoogleGenAI | null = null;
const isMockKey = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY";

function getGemini(): GoogleGenAI | null {
  if (isMockKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Memory database mock catalog for reactive client interaction
const mockLawyers = [
  {
    id: "l1",
    fullName: "Adv. Rajesh Kumar",
    barCouncilNumber: "MAH/4820/2012",
    verified: true,
    status: "VERIFIED",
    experienceYears: 14,
    languages: ["English", "Hindi", "Marathi"],
    practiceAreas: ["Cyber Crime", "Property Disputes", "Police Guidance"],
    city: "Mumbai",
    rating: 4.9,
    activeStatus: "ONLINE",
    avatarUrl: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "l2",
    fullName: "Adv. Smita Deshmukh",
    barCouncilNumber: "DEL/8912/2015",
    verified: true,
    status: "VERIFIED",
    experienceYears: 9,
    languages: ["English", "Hindi", "Marathi"],
    practiceAreas: ["Constitutional Law", "Women Safety & Family Advice", "Police Guidance"],
    city: "Delhi / NCR",
    rating: 4.8,
    activeStatus: "ONLINE",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "l3",
    fullName: "Adv. Anil Prasanna",
    barCouncilNumber: "KAR/1240/2008",
    verified: true,
    status: "VERIFIED",
    experienceYears: 18,
    languages: ["English", "Kannada", "Hindi"],
    practiceAreas: ["Startup Compliance", "Corporate Mergers", "Real Estate Disputes"],
    city: "Bengaluru",
    rating: 4.9,
    activeStatus: "BUSY",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "l4",
    fullName: "Adv. Vivek Oberoi",
    barCouncilNumber: "UP/7625/2018",
    verified: true,
    status: "VERIFIED",
    experienceYears: 8,
    languages: ["English", "Hindi"],
    practiceAreas: ["Consumer Redressal", "Contract Audit", "Traffic Stop / Challans"],
    city: "Noida",
    rating: 4.7,
    activeStatus: "ONLINE",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
  }
];

const mockLeads: any[] = [];
const mockEmergencies: any[] = [];

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. Get verified lawyer partners
app.get("/api/lawyers", (req, res) => {
  res.json({ success: true, lawyers: mockLawyers });
});

// 2. Lead Capturing & CRM for sales/consults
app.post("/api/leads/capture", (req, res) => {
  const { fullName, phone, email, query, planSelected, city } = req.body;
  if (!fullName || !phone) {
    return res.status(400).json({ success: false, message: "Full Name and Phone are required." });
  }
  const newLead = {
    id: `lead_${Date.now()}`,
    fullName,
    phone,
    email: email || "n/a",
    query: query || "General Inquiry",
    planSelected: planSelected || "None",
    city: city || "Unknown",
    timestamp: new Date().toISOString()
  };
  mockLeads.push(newLead);
  console.log("[Wakil CRM] Lead Captured successfully:", newLead);
  res.json({ success: true, message: "Our customer success node will reach out on WhatsApp within 10 minutes.", lead: newLead });
});

// 3. Emergency Dispatch Initiation Workflow
app.post("/api/emergency/initiate", (req, res) => {
  const { clientName, clientPhone, category, locationAddress, lat, lng } = req.body;
  if (!clientName || !clientPhone) {
    return res.status(400).json({ success: false, message: "Client Name and Phone are required for emergencies." });
  }

  // Auto assign an available lawyer in city if matchable (otherwise default first l1/l2)
  const assignedAdvocate = mockLawyers.find(l => l.activeStatus === "ONLINE") || mockLawyers[0];

  const emergencyRecord = {
    id: `em_${Date.now()}`,
    clientName,
    clientPhone,
    category: category || "GENERAL_CRISIS",
    location: {
      latitude: lat || 19.076,
      longitude: lng || 72.877,
      address: locationAddress || "High Court Road Link, India"
    },
    status: "CONNECTED",
    lawyerId: assignedAdvocate.id,
    lawyerName: assignedAdvocate.fullName,
    lawyerContact: "+91 98765 43210",
    estimatedResponseTimeMins: 3,
    createdAt: new Date().toISOString()
  };

  mockEmergencies.push(emergencyRecord);
  res.json({ success: true, dispatch: emergencyRecord });
});

// 4. Secure AI Legal Triage Assistant
app.post("/api/ai/triage", async (req, res) => {
  const { query, category, preferredLanguage } = req.body;
  if (!query) {
    return res.status(400).json({ success: false, message: "Query text is required for AI triage." });
  }

  const systemPrompt = `
    You are the Wakil AI Legal Triage Assistant for the Indian legal market.
    Your objective is to quickly analyze the user's situation and output structured response in perfect markdown.
    
    IMPORTANT RULES:
    1. NEVER present yourself as a licensed advocate or human lawyer. This is an informational triage aid.
    2. Provide a 3-point list of immediate, practical steps in the chosen language.
    3. Specify key Indian Laws, Sections, or Rights that apply to their query (e.g., Code of Criminal Procedure Sec 46, Motor Vehicles Act 1988, IT Act, etc.).
    4. Explicitly include a trust-first legal disclaimer at the end: 'Disclaimer: This informational material does not constitute official legal representation. For comprehensive counsel, contact our emergency verified advocates immediately.'
    
    User query: "${query}"
    Category context: "${category || 'General Access'}"
    Requested Language: "${preferredLanguage || 'EN'}"
  `;

  const ai = getGemini();

  if (!ai) {
    // Elegant simulated response in chosen language if no API key is set
    const fallbackText = preferredLanguage === "HI"
      ? `### वकील एआई ट्राइएज सहायता (सिमुलेशन)

**आपके अधिकारों का अवलोकन:**
1. **पहचान की पुष्टि करें:** जब भी लोक सेवक पूछताछ करें, हमेशा उनकी आधिकारिक आईडी और पदनाम देखने का अनुरोध करें।
2. **सहमति के दायरे:** पुलिस को मनमाने ढंग से हिरासत में लेने का अधिकार नहीं है जब तक कि उचित कारण या वारंट न हो (संविधान का अनुच्छेद 22)।
3. **तुरंत आपातकालीन सहायता बुलाएं:** वकील (Wakil) मंच पर हमारे सत्यापित अधिवक्ताओं से तुरंत संपर्क स्थापित करें।

*लागू धाराएं:* भारतीय दंड संहिता (IPC), मोटर वाहन अधिनियम (MVA)।
*अस्वीकरण: यह सामग्री केवल सामान्य जागरूकता के लिए है और इसे अंतिम कानूनी राय नहीं माना जाना चाहिए।*`
      : `### Wakil AI Legal Triage Assistant (Sandbox Preview)

**Immediate Checklist of Your Legal Rights:**
1. **Verify Official Identity:** You have the absolute right to demand a government card and badge details from any official initiating an inspection.
2. **Refuse Arbitrary Searches:** Unwarranted inspections or seizure has precise limitations under Indian procedure rules.
3. **Engage Professional Counsel:** Do not make statements under coercion without a registered advocate present.

*Applicable Legal Safeguards:* Articles 21 & 22 of the Indian Constitution, Section 100/165 of the Code of Criminal Procedure (CrPC).
*Disclaimer: This informational material does not constitute official legal representation. For comprehensive counsel, contact our emergency verified advocates immediately.*`;

    return res.json({ success: true, triageText: fallbackText, keyStatus: "sandbox_limit" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: systemPrompt,
    });
    res.json({ success: true, triageText: response.text, keyStatus: "live" });
  } catch (error: any) {
    console.error("[Wakil AI] Gemini triage failed:", error);
    res.status(500).json({ success: false, message: "Gemini server node error.", error: error.message });
  }
});

// 5. Document Pre-Analysis (AI Document Vault Module)
app.post("/api/ai/document-analyze", async (req, res) => {
  const { docName, docContent } = req.body;
  if (!docName || !docContent) {
    return res.status(400).json({ success: false, message: "Document inputs are required for audit pre-analysis." });
  }

  const systemPrompt = `
    You are the Wakil Document Audit Assistant. Your task is to inspect the textual description of an active Indian legal contract or notice, Rent Deed, or Agreement and locate exactly 3 critical warnings or potential legal traps (e.g., locking periods, high arbitrary rent hikes, vague termination boundaries, lack of notary/witness criteria). Format as high-contrast bullets.
    
    Document Subject: "${docName}"
    Supplied Text excerpt: "${docContent}"
  `;

  const ai = getGemini();

  if (!ai) {
    const fallbackText = `### AI Audit Safeguard Highlights for "${docName}":

1. **Vague Indemnity Provision**: The clause fails to restrict liability explicitly to intentional breach. This could expose you to secondary damages.
2. **Disproportionate Lock-in Exit Fees**: The 6-month exit penalty exceeds conventional Indian market practices (typically 1-3 months capped).
3. **Non-standard Forum Selection Clause**: Arbitration jurisdiction is set in a remote region, adding significant litigation cost to disputes.

*Disclaimer: This is a pre-verification analysis. Ensure final validation matches our certified lawyers under Wakil Membership plans.*`;
    return res.json({ success: true, analysisText: fallbackText, keyStatus: "sandbox_limit" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: systemPrompt,
    });
    res.json({ success: true, analysisText: response.text, keyStatus: "live" });
  } catch (error: any) {
    console.error("[Wakil AI] Document analyzer failed:", error);
    res.status(500).json({ success: false, message: "Doc analysis backend failed.", error: error.message });
  }
});

// ==========================================
// VITE OR STATIC HOOKUPS
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // In development mode, wire up the Vite development server as middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built files out of the /dist/ folder
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Wakil Full-Stack Legal Node booted successfully on port ${PORT}`);
  });
}

startServer();
