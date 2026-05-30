/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  ShieldAlert,
  Search,
  BookOpen,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  Briefcase,
  Users,
  Lock,
  Globe,
  MapPin,
  ChevronDown,
  Star
} from "lucide-react";
import {
  SERVICE_AREAS,
  MEMBERSHIP_PLANS,
  CITIES_COVERED,
  MOCK_BLOGS,
  MOCK_FAQS,
  MOCK_TESTIMONIALS,
  FAQ,
  BlogPost
} from "../types";

interface MarketingPagesProps {
  currentLang: "EN" | "HI";
  activeSection: string;
  setActiveSection: (sec: string) => void;
  openConsultForm: (planName?: string) => void;
}

export default function MarketingPages({
  currentLang,
  activeSection,
  setActiveSection,
  openConsultForm
}: MarketingPagesProps) {
  const [selectedFAQ, setSelectedFAQ] = React.useState<string | null>(null);
  const [selectedCity, setSelectedCity] = React.useState(CITIES_COVERED[0]);
  const [leadName, setLeadName] = React.useState("");
  const [leadPhone, setLeadPhone] = React.useState("");
  const [leadQuery, setLeadQuery] = React.useState("");
  const [leadStatus, setLeadStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");
  const [leadFeedback, setLeadFeedback] = React.useState("");

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) {
      setLeadStatus("error");
      setLeadFeedback("Please enter correct name and phone details");
      return;
    }
    setLeadStatus("submitting");
    try {
      const response = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: leadName,
          phone: leadPhone,
          query: leadQuery,
          city: selectedCity.city,
          planSelected: "Individual Basic Campaign"
        })
      });
      const data = await response.json();
      if (data.success) {
        setLeadStatus("success");
        setLeadFeedback(data.message);
        setLeadName("");
        setLeadPhone("");
        setLeadQuery("");
      } else {
        setLeadStatus("error");
        setLeadFeedback(data.message || "Failed to submit lead");
      }
    } catch (err) {
      setLeadStatus("error");
      setLeadFeedback("Server communication issue. Please try again.");
    }
  };

  // --------------------------------------------------
  // 1. HOME SECTION
  // --------------------------------------------------
  if (activeSection === "home") {
    return (
      <div className="space-y-24 pb-20">
        {/* Elite Hero with absolute negative space and professional design */}
        <div className="relative overflow-hidden bg-brand-navy text-brand-beige py-24 sm:py-32">
          {/* Subtle geometric pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              <div className="space-y-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-emerald/20 border border-brand-emerald text-brand-gold rounded-full text-xs font-mono font-semibold uppercase tracking-wider">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{currentLang === "EN" ? "98.4% Emergency SLAs Restorations" : "98.4% त्वरित समाधान दर"}</span>
                </div>
                
                <h1 className="text-4xl sm:text-6xl font-display font-bold text-white tracking-tight leading-none leading-[1.05]">
                  {currentLang === "EN" ? (
                    <>
                      Your trusted <span className="text-brand-gold italic">legal safety net</span> for everyday life & emergencies.
                    </>
                  ) : (
                    <>
                      दैनिक जीवन और <span className="text-brand-gold italic">आपात स्थिति</span> के लिए आपका विश्वसनीय कानूनी सुरक्षा कवच।
                    </>
                  )}
                </h1>

                <p className="text-lg text-gray-300 max-w-xl font-sans font-light">
                  {currentLang === "EN" 
                    ? "Wakil offers instant connections to verified independent advocates under Bar Councils, comprehensive document vaults, and preventative memberships. Modern protection designed for families, founders, and small businesses."
                    : "वकील बार काउंसिल के तहत पंजीकृत सत्यापित स्वतंत्र एडवोकेट्स, व्यापक सुरक्षा तिजोरी, औरनिवारक योजनाओं से त्वरित संपर्क प्रदान करता है। आपके व्यवसाय और परिवार के लिए आधुनिक कवच।"}
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button 
                    onClick={() => setActiveSection("emergency_panel")}
                    className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-mono text-sm uppercase tracking-wider font-bold rounded shadow-xl hover:shadow-2xl transition-all text-center"
                  >
                    🚨 {currentLang === "EN" ? "Simulate Legal Emergency" : "आपातकालीन कनेक्शन शुरू करें"}
                  </button>
                  <button 
                    onClick={() => setActiveSection("pricing")}
                    className="px-6 py-4 bg-transparent hover:bg-white/5 text-white border border-gray-600 hover:border-brand-gold rounded text-sm font-semibold tracking-wide transition-all text-center flex items-center justify-center gap-2"
                  >
                    <span>{currentLang === "EN" ? "Explore Shield Membership" : "मेंबरशिप प्लान्स देखें"}</span>
                    <ArrowRight className="w-4 h-4 text-brand-gold" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 text-center sm:text-left">
                  <div>
                    <span className="block text-2xl font-display font-medium text-brand-gold">4,500+</span>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400">
                      {currentLang === "EN" ? "Advocates Audited" : "पंजीकृत वरिष्ठ काउंसिल"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-2xl font-display font-medium text-brand-gold">9 Mins</span>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400">
                      {currentLang === "EN" ? "Avg. Response Speed" : "औसत प्रतिक्रिया समय"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-2xl font-display font-medium text-brand-gold">45 Cities</span>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400">
                      {currentLang === "EN" ? "Pan-India Coverage" : "समग्र भारतीय कवरेज"}
                    </span>
                  </div>
                </div>

              </div>

              {/* Dynamic Interactive Lead capture box right inside Hero */}
              <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-xl border border-blue-400/20 shadow-2xl relative">
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-0.5 bg-blue-950 border border-blue-800 rounded text-[9px] font-mono text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  <span>ONLINE ACTIVE</span>
                </div>
                
                <h3 className="text-xl font-display font-black text-white mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-brand-gold" />
                  <span>{currentLang === "EN" ? "Consult a Verified Lawyer" : "सत्यापित वकील से बात करें"}</span>
                </h3>
                <p className="text-xs text-blue-200 mb-6">
                  {currentLang === "EN" 
                    ? "Leave details with our priority helpdesk. Guaranteed first response from senior advocates."
                    : "हमारी प्राथमिकता डेस्क पर विवरण दर्ज करें। वरिष्ठ अधिवक्ताओं द्वारा १० मिनट में त्वरित वापसी।"}
                </p>

                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-blue-300 mb-1">
                      {currentLang === "EN" ? "Full Name" : "पूरा नाम"}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-950/85 border border-blue-900/60 focus:border-brand-gold rounded p-2.5 text-sm text-white focus:outline-none"
                      placeholder="e.g., Aditya Nair"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-blue-300 mb-1">
                      {currentLang === "EN" ? "Contact Number (WhatsApp)" : "व्हाट्सएप संपर्क मोबाइल नंबर"}
                    </label>
                    <input
                      type="tel"
                      className="w-full bg-slate-950/85 border border-blue-900/60 focus:border-brand-gold rounded p-2.5 text-sm text-white focus:outline-none"
                      placeholder="e.g., +91 99000 88000"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-blue-300 mb-1">
                      {currentLang === "EN" ? "Legal Context (brief summary)" : "मामले का विवरण (संक्षेप में)"}
                    </label>
                    <textarea
                      rows={2}
                      className="w-full bg-slate-950/85 border border-blue-900/60 focus:border-brand-gold rounded p-2.5 text-sm text-white focus:outline-none"
                      placeholder="e.g., Landlord withholding 2 months security deposit arbitrarily"
                      value={leadQuery}
                      onChange={(e) => setLeadQuery(e.target.value)}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={leadStatus === "submitting"}
                    className="w-full py-3 bg-brand-gold text-brand-navy hover:bg-opacity-95 font-bold rounded text-xs uppercase tracking-wider transition-all block disabled:opacity-50 shadow-sm"
                  >
                    {leadStatus === "submitting" ? "Requesting Desk..." : (currentLang === "EN" ? "Initiate Triage Connect" : "सलाह शुरू करें")}
                  </button>

                  {leadStatus === "success" && (
                    <div className="p-3 bg-brand-emerald/20 border border-brand-emerald rounded text-xs text-brand-gold">
                      ✓ {leadFeedback}
                    </div>
                  )}

                  {leadStatus === "error" && (
                    <div className="p-3 bg-red-950/40 border border-red-800 rounded text-xs text-red-300">
                      ⚠ {leadFeedback}
                    </div>
                  )}
                </form>

              </div>

            </div>
          </div>
        </div>

        {/* Brand positioning intro */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-gold font-bold">
              {currentLang === "EN" ? "Redefining Legal Access in India" : "भारत में पहली बार"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-medium text-brand-charcoal">
              {currentLang === "EN" 
                ? "Everyday Advice. Emergency Support. Unified Membership." 
                : "दैनिक कानूनी सलाह। आपातकालीन वकील बैकअप। एक एकीकृत सदस्यता।"}
            </h2>
            <p className="text-md text-gray-600 font-sans">
              {currentLang === "EN"
                ? "Wakil addresses unique realities in the Indian judicial framework. We build absolute security layers so you do not stand alone during inspections, financial fraud recoveries, or property disputes."
                : "वकील भारतीय न्यायिक ढांचे की वास्तविकताओं को संबोधित करता है। हम निरपेक्ष सुरक्षा कवच प्रदान करते हैं ताकि आप किसी भी पुलिस पूछताछ, वित्तीय धोखाधड़ी या संपत्ति विवाद में अकेले न खड़े हों।"}
            </p>
          </div>

          {/* Grid of Service Areas / Practice Domains */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {SERVICE_AREAS.map((area) => (
              <div 
                key={area.id}
                className="bg-white p-8 rounded-xl border border-gray-150 shadow-sm hover:shadow-md transition-all group cursor-pointer hover:-translate-y-1"
                onClick={() => {
                  setLeadQuery(`Inquiry regarding: ${area.label}. Please connect me with specialists.`);
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
              >
                <div className="w-12 h-12 bg-brand-beige group-hover:bg-brand-navy rounded-lg flex items-center justify-center transition-all mb-6 border border-gray-200">
                  <ShieldAlert className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="text-lg font-display font-medium text-brand-charcoal mb-2 group-hover:text-brand-emerald transition-colors">
                  {area.label}
                </h3>
                <p className="text-sm text-gray-500 mb-4 font-light">
                  {area.desc}
                </p>
                <div className="p-3 bg-brand-beige/50 rounded text-xs font-mono text-gray-600 border border-brand-gold/10">
                  {area.detail}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-brand-gold font-semibold uppercase tracking-wider mt-6">
                  <span>{currentLang === "EN" ? "Consult Specialist" : "वकील से बात करें"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Geographical Coverage & Map Integration Showcase */}
        <div className="bg-brand-navy text-brand-beige py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Real-Time Operations</span>
                <h2 className="text-3xl font-display font-medium text-white tracking-tight mt-2 mb-6">
                  {currentLang === "EN" ? "Active Advocate Coverage Near You" : "देश भर में सत्यापित कानून नेटवर्क"}
                </h2>
                <p className="text-gray-300 font-sans font-light mb-8">
                  {currentLang === "EN"
                    ? "Through our dynamic allocation protocol, Wakil partners are online across major Indian Tier-1 and Tier-2 clusters. Select a city to review active council density:"
                    : "हमारी प्रणालियों के माध्यम से, प्रमुख भारतीय टियर-१ और टियर-२ शहरों में वकीलों का नेटवर्क २४/७ सक्रिय रहता है। लाइव नेटवर्क स्थिति देखने के लिए शहर चुनें:"}
                </p>

                {/* City list picker */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CITIES_COVERED.map((ct) => (
                    <button
                      key={ct.city}
                      onClick={() => setSelectedCity(ct)}
                      className={`p-3 text-left rounded border transition-all ${
                        selectedCity.city === ct.city
                          ? "bg-brand-gold text-brand-charcoal border-brand-gold font-semibold"
                          : "bg-white/5 text-gray-300 border-gray-700 hover:bg-white/10"
                      }`}
                    >
                      <span className="block text-xs font-display">{ct.city}</span>
                      <span className="text-[10px] font-mono text-opacity-80 block">
                        {ct.count} {currentLang === "EN" ? "Active Council" : "सक्रिय वकील"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Geographic Live Panel simulation */}
              <div className="p-8 bg-brand-navy rounded-xl border border-white/10 relative overflow-hidden h-96 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-red-500 animate-bounce" />
                    <div>
                      <span className="font-mono text-xs block text-gray-400">CURRENT TARGET FIELD</span>
                      <span className="font-display font-medium text-sm text-white">{selectedCity.city} ({selectedCity.state})</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 border border-brand-gold text-brand-gold font-mono text-[9px] rounded uppercase">
                    EST wait: &lt; 9 Mins
                  </span>
                </div>

                {/* Display elegant grid node representing a map area */}
                <div className="flex-1 my-6 relative bg-slate-900/80 rounded-lg p-4 font-mono text-xs flex flex-col justify-between border border-white/5 space-y-4">
                  <div className="text-[10px] text-brand-gold">
                    {"[WAKIL-OS-CONNECT: " + selectedCity.city.toUpperCase() + "_GRID]"}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span>Verified Advocates Scheduled:</span>
                      <span className="text-white">{(selectedCity.count * 0.4).toFixed(0)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span>Emergency Dispatch Nodes:</span>
                      <span className="text-white">Active</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span>SLA Compliance Track rate:</span>
                      <span className="text-emerald-400 font-bold">99.1%</span>
                    </div>
                  </div>

                  <div className="w-full bg-brand-emerald/15 p-2.5 rounded border border-brand-emerald/40 text-emerald-400 text-[11px]">
                    ● {currentLang === "EN" ? "Immediate police connection and civil advice routes are green in local networks." : "आपातकालीन वकील संपर्क चैनल इस क्षेत्र में पूर्ण रूप से चालू हैं।"}
                  </div>
                </div>

                <div className="font-mono text-[10px] text-gray-500 text-center">
                  *Wakil facilitates immediate access to independent council registered under Bar Councils of India.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Preview Panel */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Answers / Information</span>
            <h2 className="text-3xl font-display font-medium text-brand-charcoal">
              {currentLang === "EN" ? "Frequently Asked Questions" : "सामान्य प्रश्नोत्तरी"}
            </h2>
          </div>

          <div className="space-y-4">
            {MOCK_FAQS.map((faq) => (
              <div 
                key={faq.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setSelectedFAQ(selectedFAQ === faq.id ? null : faq.id)}
                  className="w-full text-left p-5 flex items-center justify-between hover:bg-brand-beige/30 transition-colors"
                >
                  <span className="font-display font-medium text-brand-charcoal text-sm sm:text-md">
                    {currentLang === "EN" ? faq.question.en : faq.question.hi}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${selectedFAQ === faq.id ? "rotate-180" : ""}`} />
                </button>
                {selectedFAQ === faq.id && (
                  <div className="p-5 border-t border-gray-100 bg-brand-beige/20 text-sm text-gray-600 leading-relaxed font-light">
                    {currentLang === "EN" ? faq.answer.en : faq.answer.hi}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Lead Capture Footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-emerald text-brand-beige p-8 sm:p-12 rounded-xl grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-3xl font-display font-bold text-white">
                {currentLang === "EN" ? "Join over 12,000 Protected Indian Families" : "१२,००० से अधिक भारतीय परिवारों का सुरक्षित विकल्प"}
              </h2>
              <p className="text-gray-200 font-light max-w-xl">
                {currentLang === "EN"
                  ? "Ensure a continuous digital link to top-tier advocate services. Memberships start under ₹199/month. Completely transparent, pay-on-renewal cancellations."
                  : "बार काउंसिल के तहत सत्यापित वरिष्ठ काउंसिल वकीलों की सुरक्षा प्राप्त करें। योजना मात्र ₹199/माह से शुरू। जब चाहें रद्द करें।"
                }
              </p>
            </div>
            <div>
              <button
                onClick={() => setActiveSection("pricing")}
                className="w-full sm:w-auto px-8 py-4 bg-brand-gold text-brand-charcoal hover:bg-opacity-95 font-semibold uppercase tracking-wider text-xs rounded transition-all inline-block shadow-lg"
              >
                {currentLang === "EN" ? "Select Your Membership Shield" : "अपना सुरक्षा शील्ड चुनें"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // 2. HOW IT WORKS SECTION
  // --------------------------------------------------
  if (activeSection === "how_it_works") {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Practical Workflows</span>
          <h1 className="text-4xl font-display font-bold text-brand-charcoal">
            {currentLang === "EN" ? "How Wakil Protects You" : "वकील (Wakil) कैसे काम करता है"}
          </h1>
          <p className="text-md text-gray-600 max-w-2xl mx-auto">
            {currentLang === "EN"
              ? "We bridge the gap between complex legal books and instantaneous, on-the-spot support. Through our system, you secure everyday validation and immediate emergency routing."
              : "हम जटिल कानूनी धाराओं और मौके पर त्वरित सहायता के बीच की दूरी को पाटते हैं।"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-xl border border-gray-150 relative">
            <span className="absolute top-4 right-4 text-4xl font-mono text-brand-gold opacity-30 font-bold">01</span>
            <h3 className="text-xl font-display font-medium text-brand-charcoal mb-4">
              {currentLang === "EN" ? "1-Click Emergency Trigger" : "1-क्लिक इमरजेंसी संकट बटन"}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed font-light">
              {currentLang === "EN" 
                ? "Facing an unexpected police checkpoint, road dispute, or suspicious bank cyber account lock? Push the unified emergency button. The platform captures your current geolocation nodes and prioritizes triage queues immediately."
                : "अचानक पुलिस पूछताछ, सड़क विवाद, या बैंक फ्रॉड का सामना कर रहे हैं? पैनिक बटन दबाएं। सिस्टम आपका लाइव लोकेशन दर्ज कर प्रक्रिया शुरू करता है।"}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-xl border border-gray-150 relative">
            <span className="absolute top-4 right-4 text-4xl font-mono text-brand-gold opacity-30 font-bold">02</span>
            <h3 className="text-xl font-display font-medium text-brand-charcoal mb-4">
              {currentLang === "EN" ? "Verified Advocate Dispatch" : "सत्यापित काउंसिल आवंटन"}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed font-light">
              {currentLang === "EN" 
                ? "Our system routes the issue to vetted independent attorneys nearby. In under 9 minutes, an attorney reviews your intake details and initiates immediate secure consult call support, guiding you through on-the-spot instructions."
                : "हमारा सिस्टम मुद्दे को आपके नजदीकी बार कौंसिल सत्यापित वकीलों को आवंटित करता है। ९ मिनट के भीतर वकील तत्काल आपको सुरक्षित रूप से मार्गदर्शन प्रदान करते हैं।"}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-xl border border-gray-150 relative">
            <span className="absolute top-4 right-4 text-4xl font-mono text-brand-gold opacity-30 font-bold">03</span>
            <h3 className="text-xl font-display font-medium text-brand-charcoal mb-4">
              {currentLang === "EN" ? "AI Legal Triage Analysis" : "एआई विधिक ट्राइएज"}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed font-light">
              {currentLang === "EN" 
                ? "Instantly draft precise informational checklists, review sections of the Code of Criminal Procedure/IT acts, or analyze suspicious rent agreements in real-time. Powerful guidance before speaking with other corporate entities."
                : "आप मौके पर ही अधिकारों की सूची पा सकते हैं, प्रमुख धाराओं की जानकारी प्राप्त कर सकते हैं या किसी भी किराए के समझौते की समीक्षा कर सकते हैं।"}
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-8 rounded-xl border border-gray-150 relative">
            <span className="absolute top-4 right-4 text-4xl font-mono text-brand-gold opacity-30 font-bold">04</span>
            <h3 className="text-xl font-display font-medium text-brand-charcoal mb-4">
              {currentLang === "EN" ? "Preventative Vault Storage" : "निवारक डिजिटल तिजोरी"}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed font-light">
              {currentLang === "EN" 
                ? "Maintain all relevant credentials — vehicle registration papers, driver declarations, property agreements or previous receipts — directly inside a secure dashboard VAULT. Instantly share with advocates during spot disputes."
                : "वाहन दस्तावेज, ड्राइविंग लाइसेंस, संपत्ति अनुबंध सुरक्षित पर्सनल तिजोरी वॉल्ट में रखें और विवाद के दौरान वकीलों के साथ तुरंत साझा करें।"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // 3. MEMBERSHIP PLANS SECTION
  // --------------------------------------------------
  if (activeSection === "pricing") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Flexible Tiering</span>
          <h1 className="text-4xl font-display font-bold text-brand-charcoal">
            {currentLang === "EN" ? "Select Your Legal Safety Membership" : "अपनी कानूनी कवच सदस्यता चुनें"}
          </h1>
          <p className="text-md text-gray-600 max-w-xl mx-auto">
            {currentLang === "EN"
              ? "Transparent, India-optimized plans. Safeguard yourself, your loved ones, or your business against unexpected hurdles."
              : "पारदर्शी और किफायती प्लान्स। स्वयं, अपने परिवार या अपने व्यापार को किसी भी जटिल कानूनी परिस्थिति से बचाएं।"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {MEMBERSHIP_PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-white rounded-xl border p-8 flex flex-col justify-between transition-all relative ${
                plan.tier === "PLUS" 
                  ? "border-brand-gold ring-2 ring-brand-gold/20" 
                  : "border-gray-200"
              }`}
            >
              {plan.tier === "PLUS" && (
                <span className="absolute top-4 right-4 px-2 py-0.5 bg-brand-gold text-brand-charcoal font-semibold tracking-wider text-[9px] uppercase font-mono rounded">
                  {currentLang === "EN" ? "TOP RECOMMENDED" : "सर्वश्रेष्ठ विकल्प"}
                </span>
              )}

              <div>
                <h3 className="text-xl font-display font-bold text-brand-charcoal">{plan.name}</h3>
                <div className="my-6">
                  <span className="text-4xl font-display font-extrabold text-brand-charcoal">₹{plan.priceINR}</span>
                  <span className="text-gray-500 text-xs font-mono block mt-1">/ {plan.billingPeriod === "MONTHLY" ? "Month" : "Year"}</span>
                </div>

                <div className="space-y-4 border-t border-gray-100 pt-6">
                  {currentLang === "EN" ? (
                    plan.features.en.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-gray-600">
                        <CheckCircle className="w-4.5 h-4.5 text-brand-gold shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))
                  ) : (
                    plan.features.hi.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-gray-600">
                        <CheckCircle className="w-4.5 h-4.5 text-brand-gold shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-gray-100">
                <button
                  onClick={() => openConsultForm(plan.name)}
                  className={`w-full py-3 rounded text-center text-xs font-bold uppercase tracking-wider transition-colors ${
                    plan.tier === "PLUS"
                      ? "bg-brand-gold text-brand-navy hover:bg-opacity-95 shadow-sm"
                      : "bg-brand-navy hover:bg-opacity-90 text-white shadow-sm"
                  }`}
                >
                  {currentLang === "EN" ? "Activate Cover" : "कवच सक्रिय करें"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // 4. FOR FAMILIES SECTION
  // --------------------------------------------------
  if (activeSection === "families") {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Family Shield Protection</span>
          <h1 className="text-4xl font-display font-bold text-brand-charcoal">
            {currentLang === "EN" ? "Complete Legal Armor for Your Family" : "आपके परिवार के लिए पूर्ण विधिक सुरक्षा"}
          </h1>
          <p className="text-md text-gray-600 max-w-xl mx-auto font-light">
            {currentLang === "EN"
              ? "Protect your parents, spouse, or college-going children from arbitrary roadside stops and digital UPI transaction frauds instantly."
              : "माता-पिता, जीवनसाथी या कॉलेज जाने वाले बच्चों को मनमानी ट्रैफिक पुलिस रुकावटों या यूपीआई वित्तीय फ्रॉड से सुरक्षित रखें।"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 items-center">
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg border border-gray-150">
              <h3 className="font-display font-medium text-brand-charcoal text-sm uppercase tracking-wider mb-2">
                🏠 {currentLang === "EN" ? "Joint Family Account Dashboard" : "संयुक्त पारिवारिक खाता"}
              </h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                {currentLang === "EN" 
                  ? "Manage up to 4 accounts from a single premium panel. Family members get independent panic triggers and secure VAULT directories."
                  : "एकल प्रीमियम पैनल से ४ पारिवारिक सदस्यों को प्रबंधित करें। सभी को स्वतंत्र पैनिक बटन और व्यक्तिगत तिजोरी की सुविधा।"}
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-gray-150">
              <h3 className="font-display font-medium text-brand-charcoal text-sm uppercase tracking-wider mb-2">
                👵 {currentLang === "EN" ? "Elder Parent Panic Routing" : "बुजुर्ग माता-पिता आपातकालीन मार्ग"}
              </h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                {currentLang === "EN" 
                  ? "Ensure senior citizens have a 1-tap connection to regional legal experts if questioned or harassed over property claims."
                  : "वरिष्ठ नागरिकों को किसी भी संपत्ति दावे को लेकर धमकी या रुकावट होने पर तुरंत स्थानीय वकीलों से संपर्क कराएं।"}
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-gray-150">
              <h3 className="font-display font-medium text-brand-charcoal text-sm uppercase tracking-wider mb-2">
                🔒 {currentLang === "EN" ? "Women Safety Legal Assistance Desk" : "महिला सुरक्षा कानूनी डेस्क"}
              </h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                {currentLang === "EN"
                  ? "Vetted advocates specialized in procedural safety standards, workplace grievances, and cybersecurity matters provide immediate representation."
                  : "प्रक्रियात्मक सुरक्षा मानकों, कार्यस्थल की शिकायतों और साइबर सुरक्षा विवादों में विशेषज्ञता वाले अधिवक्ताओं द्वारा तत्काल सहायता।"}
              </p>
            </div>
          </div>

          <div className="bg-brand-navy text-brand-beige p-8 rounded-xl border border-white/5 space-y-6 relative shadow-md">
            <span className="text-xs font-mono uppercase text-brand-gold tracking-widest block font-bold">FAMILY COGNIZANCE</span>
            <h3 className="text-2xl font-display font-black text-white">
              {currentLang === "EN" ? "Activate Family Shield Cover Today" : "आज ही फैमिली शील्ड सक्रिय करें"}
            </h3>
            <p className="text-sm text-gray-300 font-light leading-relaxed">
              {currentLang === "EN"
                ? "Secure all-access coverage for just ₹699/month. Includes shared property document verification frameworks entirely free."
                : "सिर्फ ₹699/माह में पूरे परिवार को सुनिश्चित कवच प्रदान करें। मुफ़्त किराया एवं संपत्ति दस्तावेज जांच सेवा शामिल।"}
            </p>
            <div className="border-t border-blue-900 pt-6">
              <button
                onClick={() => openConsultForm("Family Shield")}
                className="px-6 py-3 bg-brand-gold hover:bg-opacity-95 text-brand-navy text-xs font-mono uppercase tracking-wider font-bold rounded block text-center shadow-sm"
              >
                {currentLang === "EN" ? "Request Family Shield" : "फैमिली शील्ड आवेदन करें"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // 5. FOR BUSINESSES SECTION
  // --------------------------------------------------
  if (activeSection === "businesses") {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">SME and Startup Suite</span>
          <h1 className="text-4xl font-display font-bold text-brand-charcoal">
            {currentLang === "EN" ? "Preventative Legal Shield for Indian Startups" : "भारतीय स्टार्टअप और एमएसएमई के लिए सुरक्षा"}
          </h1>
          <p className="text-md text-gray-600 max-w-xl mx-auto font-light">
            {currentLang === "EN"
              ? "Safeguard your corporate assets against sudden vendor breaches, GST compliance audit demands, and employment contracts."
              : "विक्रेता चूक, अचानक जीएसटी अनुपालन मांग और रोजगार अनुबंधों के खिलाफ आपकी व्यावसायिक परिसंपत्तियों की रक्षा करें।"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Feature 1 */}
          <div className="p-8 bg-white border border-gray-150 rounded-xl space-y-4">
            <div className="w-10 h-10 rounded bg-brand-gold/10 flex items-center justify-center text-brand-gold">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-md text-brand-charcoal">
              {currentLang === "EN" ? "Contract and NDA Audits" : "अनुबंध और एनडीए जांच"}
            </h3>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              {currentLang === "EN"
                ? "Get expert advocates to review co-founder agreements, SaaS vendor agreements, and employment offers within flat SLAs."
                : "सह-संस्थापक समझौतों, विक्रेता समझौतों और रोजगार प्रस्तावों की तत्काल समीक्षा वरिष्ठ वकीलों और एडवोकेट्स से कराएं।"}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 bg-white border border-gray-150 rounded-xl space-y-4">
            <div className="w-10 h-10 rounded bg-brand-emerald/10 flex items-center justify-center text-brand-emerald">
              <CheckCircle className="w-5 h-5 text-brand-emerald" />
            </div>
            <h3 className="font-display font-bold text-md text-brand-charcoal">
              {currentLang === "EN" ? "GST & Tax Node Grievances" : "जीएसटी और टैक्स नोटिस उत्तर"}
            </h3>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              {currentLang === "EN"
                ? "Legal assistance navigating complex tax audits, compliance requirements, or arbitrary billing recoveries in a unified desk."
                : "व्यापार कर और जीएसटी विवादों में सटीक प्रतिक्रिया और प्रतिक्रियात्मक वकालत सेवाएं।"}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 bg-white border border-gray-150 rounded-xl space-y-4">
            <div className="w-10 h-10 rounded bg-brand-navy/10 flex items-center justify-center text-brand-navy">
              <Users className="w-5 h-5 text-brand-navy" />
            </div>
            <h3 className="font-display font-bold text-md text-brand-charcoal">
              {currentLang === "EN" ? "Startup Founders Support" : "संस्थापक कानूनी पैकेज"}
            </h3>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              {currentLang === "EN"
                ? "Protect intellectual property, register trademarks (referrals), resolve equity issues, and safeguard employer capabilities."
                : "आईपी सुरक्षा, ट्रेडमार्क रजिस्ट्रेशन रेफ़रल, इक्विटी आवंटन और कर्मचारी कानूनी कल्याण।"
              }
            </p>
          </div>
        </div>

        <div className="bg-brand-navy text-neutral-200 p-8 sm:p-12 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center border border-white/10 mt-12">
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs font-mono uppercase text-brand-gold tracking-widest block">CORPORATE ACCOUNT DESK</span>
            <h3 className="text-2xl font-display font-semibold text-white">
              {currentLang === "EN" ? "Protect up to 10 Employees under Corporate Plan" : "कॉर्पोरेट सुरक्षा योजना - १० सीटों तक"}
            </h3>
            <p className="text-xs text-gray-400 font-light">
              {currentLang === "EN"
                ? "Include premium video consultation sessions on litigation, regulatory audits and employment guidelines. Starts under ₹2499/month."
                : "नियामक ऑडिट और कानूनी आवश्यकताओं के लिए वकीलों से असीमित वीडियो परामर्श शामिल।"}
            </p>
          </div>
          <div className="text-right">
            <button
              onClick={() => openConsultForm("Business Starter")}
              className="w-full md:w-auto px-6 py-3 bg-brand-gold hover:bg-opacity-95 text-brand-navy font-sans text-xs uppercase tracking-wider font-bold rounded shadow-sm"
            >
              {currentLang === "EN" ? "Apply for Corporate Shield" : "कॉर्पोरेट शील्ड अनुरोध करें"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // 6. ABOUT US & TRUST SECTION
  // --------------------------------------------------
  if (activeSection === "about") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Integrity node</span>
          <h1 className="text-4xl font-display font-bold text-brand-charcoal">
            {currentLang === "EN" ? "Vouching for Absolute Legal Transparency" : "अटूट विश्वास और विधिक पारदर्शिता की नीव"}
          </h1>
          <p className="text-md text-gray-600 max-w-xl mx-auto font-light">
            {currentLang === "EN"
              ? "Wakil is built on trust, certified lawyer vetting, and strict Bar Council operational alignment. We never promise magical outcomes but assure continuous support."
              : "वकील बार काउंसिल मानकों के कड़े पालन और पूर्ण जवाबदेही पर खड़ा है। हम भ्रामक दावे नहीं करते, बल्कि सटीक कानूनी सेवा उपलब्ध कराते हैं।"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-medium text-brand-charcoal">
              {currentLang === "EN" ? "Our Ethics Charter" : "हमारा नैतिक घोषणापत्र"}
            </h3>
            <p className="text-sm font-sans font-light text-gray-600 leading-relaxed">
              {currentLang === "EN"
                ? "The Indian Advocate Act prohibits direct advertising or client solicitation by advocates. Wakil operates strictly as a logistical technology facilitator, permitting independent clients to search, discover, and request support from certified advocates in case of emergencies and general evaluations."
                : "भारतीय एडवोकेट अधिनियम वकीलों को सीधे विज्ञापन या ग्राहकों की याचना करने से मना करता है। वकील एक तकनीकी प्लेटफॉर्म है जो वकीलों और ग्राहकों को पारदर्शी रूप से जोड़ता है।"}
            </p>

            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-xs text-gray-600 font-mono">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{currentLang === "EN" ? "100% Bar Council ID Verified Lawyers" : "100% बार काउंसिल आईडी सत्यापित वकील"}</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-600 font-mono">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{currentLang === "EN" ? "No Middlemen commissions or hidden kickbacks" : "बिचौलियों और अतिरिक्त कमीशन की पूर्ण अनुपस्थिति"}</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-600 font-mono">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{currentLang === "EN" ? "Encrypted Vaults and confidential messages history" : "एन्क्रिप्टेड संदेश इतिहास और पर्सनल तिजोरी (Vault)"}</span>
              </li>
            </ul>
          </div>

          <div className="bg-brand-navy text-brand-beige p-8 rounded-xl space-y-6 border border-blue-900 shadow-md">
            <span className="text-xs font-mono uppercase text-brand-gold tracking-widest block font-bold">CREDENTIAL STANDARDS</span>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-white">
                    {currentLang === "EN" ? "Complete Privacy Control" : "गोपनीयता नियंत्रण"}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    {currentLang === "EN"
                      ? "All uploaded FIR drafts, rent deeds or notifications are isolated under AES-256 standard encryption algorithms."
                      : "दस्तावेज सुरक्षित AES-256 एन्क्रिप्शन एल्गोरिदम के तहत संरक्षित हैं।"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-white">
                    {currentLang === "EN" ? "Verified Advocates Network" : "सत्यापित भारतीय वकीलों का नेटवर्क"}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    {currentLang === "EN"
                      ? "Attorneys undergo strict cross-checks with valid bar enrollments before activating priority queue eligibility."
                      : "कतार में आने से पहले वकीलों के नामांकन का कड़ाई से मिलान किया जाता है।"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
