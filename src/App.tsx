/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import Navigation from "./components/Navigation";
import MarketingPages from "./components/MarketingPages";
import Dashboard from "./components/Dashboard";
import AIConsultant from "./components/AIConsultant";
import { 
  Shield, 
  MapPin, 
  CheckCircle, 
  PhoneCall, 
  X, 
  Layers, 
  AlertTriangle 
} from "lucide-react";
import { CITIES_COVERED } from "./types";

export default function App() {
  const [currentLang, setLang] = React.useState<"EN" | "HI">("EN");
  const [activeTab, setActiveTab] = React.useState<string>("home");

  // Contact / Book modal campaign states
  const [isConsultModalOpen, setIsConsultModalOpen] = React.useState(false);
  const [modalName, setModalName] = React.useState("");
  const [modalPhone, setModalPhone] = React.useState("");
  const [modalMsg, setModalMsg] = React.useState("");
  const [modalPlan, setModalPlan] = React.useState("General Advice");
  const [modalStatus, setModalStatus] = React.useState<"idle" | "sending" | "success" | "error">("idle");
  const [modalFeedback, setModalFeedback] = React.useState("");

  const handleOpenConsultForm = (planName?: string) => {
    if (planName) {
      setModalPlan(planName);
    } else {
      setModalPlan("General Advice");
    }
    setModalStatus("idle");
    setModalFeedback("");
    setIsConsultModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalName || !modalPhone) {
      setModalStatus("error");
      setModalFeedback("Both name and phone details are required.");
      return;
    }
    setModalStatus("sending");
    try {
      const response = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: modalName,
          phone: modalPhone,
          query: modalMsg || "Campaign callback requested",
          planSelected: modalPlan,
          city: "Delhi / NCR"
        })
      });
      const data = await response.json();
      if (data.success) {
        setModalStatus("success");
        setModalFeedback(data.message);
        setModalName("");
        setModalPhone("");
        setModalMsg("");
      } else {
        setModalStatus("error");
        setModalFeedback(data.message || "Failed to process callback query.");
      }
    } catch {
      setModalStatus("error");
      setModalFeedback("Server node connection error.");
    }
  };

  return (
    <div className="bg-brand-beige min-h-screen flex flex-col justify-between selection:bg-brand-gold selection:text-brand-charcoal text-brand-charcoal antialiased">
      
      {/* 1. Global Alert Ribbon (India-wide coverage status) */}
      <div className="bg-brand-emerald text-white text-[11px] font-mono py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 border-b border-white/5">
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0"></span>
        <span>
          {currentLang === "EN" 
            ? "Wakil Bar Council Network Nodes active across 45+ cities in Maharashtra, Delhi NCR, Karnataka, Punjab & Telangana." 
            : "महाराष्ट्र, दिल्ली एनसीआर, कर्नाटक, पंजाब और तेलंगाना के 45+ शहरों में वकील नेटवर्क चालू है।"}
        </span>
      </div>

      {/* 2. Brand Sticky Navigation Header */}
      <Navigation
        currentLang={currentLang}
        setLang={setLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenConsultForm={() => handleOpenConsultForm()}
      />

      {/* 3. Primary Controller Routing Content Space */}
      <main className="flex-1 w-full">
        {/* Render Dashboard tab directly or Public marketing frameworks */}
        {activeTab === "dashboard" ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Dashboard currentLang={currentLang} />
          </div>
        ) : activeTab === "emergency_panel" ? (
          <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">
            <div className="text-center space-y-4">
              <span className="text-xs font-mono uppercase text-red-600 tracking-widest font-bold">Priority Triage Area</span>
              <h1 className="text-4xl font-display font-black text-brand-charcoal tracking-tight leading-none">
                {currentLang === "EN" ? "Interactive Legal Emergency Sandbox" : "आपातकालीन कानूनी सहायता कक्ष"}
              </h1>
              <p className="text-gray-500 font-sans max-w-xl mx-auto text-sm font-light">
                {currentLang === "EN"
                  ? "Test our groundbreaking legal triage system. Type any scenario to extract custom rights, or trigger direct mock dispatches."
                  : "हमारे विधिक ट्राइएज का उपयोग करें। किसी भी संकट स्थिति को टाइप कर अधिकारों की सूची और धाराएं देखें।"}
              </p>
            </div>

            {/* Embedded conversational AI block */}
            <AIConsultant currentLang={currentLang} />

            {/* Rapid instructions guide */}
            <div className="bg-white p-6 border border-gray-150 rounded-xl space-y-4">
              <span className="text-xs font-mono uppercase text-brand-gold font-bold">Standard Procedure Under Indian Codes</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
                <div>
                  <h4 className="font-semibold text-brand-charcoal mb-2">1. Establish Legal representation</h4>
                  <p className="text-gray-500 leading-relaxed font-light">
                    You have the right to request a verified advocate. Demanding counsel before signing statements stops arbitrary coercion.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-charcoal mb-2">2. Demand Badges & Identity</h4>
                  <p className="text-gray-500 leading-relaxed font-light">
                    Public servants must state their specific designation, squad, or station bounds. Note badge names and vehicle digits carefully.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-charcoal mb-2">3. Women Safety Shields</h4>
                  <p className="text-gray-500 leading-relaxed font-light">
                    Under standard procedural codes, no female user shall be subjected to physical searches past sunset without verified women representation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <MarketingPages
              currentLang={currentLang}
              activeSection={activeTab}
              setActiveSection={setActiveTab}
              openConsultForm={handleOpenConsultForm}
            />

            {/* Append conversational sandbox widget at the bottom of the home or works section to drive conversion! */}
            {(activeTab === "home" || activeTab === "how_it_works") && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-200">
                <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
                  <span className="text-xs font-mono uppercase text-brand-gold tracking-widest font-bold">Try Wakil Technology</span>
                  <h2 className="text-3xl font-display font-medium text-brand-charcoal leading-tight">
                    {currentLang === "EN" ? "Explore Custom Rights Instant Sandbox" : "वकील (Wakil) एआई लीगल सैंडबॉक्स"}
                  </h2>
                  <p className="text-gray-500 text-sm font-light">
                    Try typing any legal dispute (e.g. UPI online scam details, rent contract warning highlights). Get custom instant checklists.
                  </p>
                </div>
                <AIConsultant currentLang={currentLang} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* 4. Complete footer with disclaimers and compliance indicators */}
      <footer className="bg-brand-navy text-brand-beige border-t border-blue-900 pt-16 pb-8 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-white text-brand-navy flex items-center justify-center font-bold">
                  W
                </div>
                <span className="text-xl font-display font-bold text-white tracking-tight">WAKIL India</span>
              </div>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Empowering Indian citizens, families, and high-growth startups with instant, on-demand verified corporate council and preventative protection shields.
              </p>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400 uppercase">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Bar Council Vetted Nodes</span>
              </div>
            </div>

            {/* Column 2: Legal Use cases / domains */}
            <div className="space-y-3">
              <h4 className="text-white text-xs font-mono uppercase font-semibold tracking-wider">Practice Domains</h4>
              <ul className="space-y-1 text-xs text-gray-400 font-light">
                <li><a href="#triage" onClick={() => { setActiveTab("home"); }} className="hover:text-brand-gold">Police Stops & FIR Guidance</a></li>
                <li><a href="#triage" onClick={() => { setActiveTab("home"); }} className="hover:text-brand-gold">Cyber Scams & UPI recoveries</a></li>
                <li><a href="#triage" onClick={() => { setActiveTab("home"); }} className="hover:text-brand-gold">Property and Rent litigation</a></li>
                <li><a href="#triage" onClick={() => { setActiveTab("home"); }} className="hover:text-brand-gold">Co-Founder Startup compliance</a></li>
                <li><a href="#triage" onClick={() => { setActiveTab("home"); }} className="hover:text-brand-gold">Women Safeguard Assistance</a></li>
              </ul>
            </div>

            {/* Column 3: Regional Coverage */}
            <div className="space-y-3">
              <h4 className="text-white text-xs font-mono uppercase font-semibold tracking-wider">Regional Coverage Map</h4>
              <ul className="space-y-1 text-xs text-gray-400 font-light">
                <li>Mumbai Sector, Maharashtra</li>
                <li>Delhi / NCR HQ Metro</li>
                <li>Bengaluru Hub, Karnataka</li>
                <li>Hyderabad Center, Telangana</li>
                <li>Pune Sector, Maharashtra</li>
              </ul>
            </div>

            {/* Column 4: Trust Signatures */}
            <div className="space-y-3">
              <h4 className="text-white text-xs font-mono uppercase font-semibold tracking-wider">Trust credentials</h4>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Independent advocates connected on Wakil are registered with State Bar Councils under the Advocates Act, 1961. We enforce continuous SLA audit checks.
              </p>
            </div>
          </div>

          {/* Core Trust Disclaimer as required by legal guidelines */}
          <div className="p-4 bg-white/5 border border-white/10 rounded text-[11px] leading-relaxed text-gray-400 font-light space-y-2">
            <span className="block font-mono font-bold uppercase text-brand-gold text-[10px]">✓ Bar Council Regulatory Disclaimer Directive</span>
            <p>
              Disclaimer: Wakil India is an autonomous legal technology logistical network system. It is NOT a registered law firm and does NOT provide direct court representation or official legal advice. Our platform simplifies the identification and dispatch protocol of independent advocate counselors. Users are advised to review the credentials and pricing structures of assigned attorneys before signing any official Vakalatnamas.
            </p>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500 font-mono">
            <span>© {new Date().getFullYear()} Wakil India Technologies Private Limited. All rights reserved.</span>
            <div className="flex gap-4">
              <span className="hover:text-brand-gold cursor-pointer">Terms of Service</span>
              <span className="hover:text-brand-gold cursor-pointer">Privacy Charter</span>
              <span className="hover:text-brand-gold cursor-pointer">Grievance Nodal</span>
            </div>
          </div>

        </div>
      </footer>

      {/* ==========================================
          BOOK LEADS CONSULT MODAL CAMPAIGN
         ========================================== */}
      {isConsultModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-navy/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-gray-150 p-6 sm:p-8 space-y-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setIsConsultModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-brand-gold font-bold block">PRIORITY CAMPAIGN CONNECTOR</span>
              <h3 className="text-xl font-display font-bold text-brand-charcoal">
                {currentLang === "EN" ? `Connect for: ${modalPlan}` : `परामर्श आवेदन: ${modalPlan}`}
              </h3>
              <p className="text-xs text-gray-500 font-light">
                Submit details below. Our corporate helpdesk node will capture contact and arrange a registered call within minutes.
              </p>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4 pt-2">
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  placeholder="e.g., Pooja Sharma"
                  className="w-full bg-slate-50 border border-gray-250 rounded p-2.5 text-xs text-brand-charcoal focus:outline-none focus:border-brand-gold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500 block mb-1">WhatsApp Phone Number</label>
                <input
                  type="tel"
                  value={modalPhone}
                  onChange={(e) => setModalPhone(e.target.value)}
                  placeholder="e.g., +91 98000 77000"
                  className="w-full bg-slate-50 border border-gray-250 rounded p-2.5 text-xs text-brand-charcoal focus:outline-none focus:border-brand-gold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500 block mb-1">State brief query bounds (Optional)</label>
                <textarea
                  rows={2}
                  value={modalMsg}
                  onChange={(e) => setModalMsg(e.target.value)}
                  placeholder="e.g., Urgent verification of draft lease deed warning limits before paying deposits."
                  className="w-full bg-slate-50 border border-gray-250 rounded p-2.5 text-xs text-brand-charcoal focus:outline-none focus:border-brand-gold"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={modalStatus === "sending"}
                className="w-full py-3 bg-brand-navy hover:bg-opacity-95 text-white font-semibold text-xs tracking-wider uppercase rounded disabled:opacity-50 transition-colors shadow-sm"
              >
                {modalStatus === "sending" ? "Processing..." : (currentLang === "EN" ? "Submit Premium Query" : "पूछताछ जमा करें")}
              </button>

              {modalStatus === "success" && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded">
                  ✓ {modalFeedback}
                </div>
              )}

              {modalStatus === "error" && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded">
                  ⚠ {modalFeedback}
                </div>
              )}
            </form>

            <span className="block text-[9px] text-gray-400 font-mono text-center pt-2 border-t border-gray-100">
              *Secure transit: Your contact nodes are private under SSL rules.
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
