/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Shield, Languages, Menu, X, ArrowUpRight, AlertTriangle } from "lucide-react";

interface NavigationProps {
  currentLang: "EN" | "HI";
  setLang: (lang: "EN" | "HI") => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenConsultForm: () => void;
}

export default function Navigation({
  currentLang,
  setLang,
  activeTab,
  setActiveTab,
  onOpenConsultForm
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const links = [
    { id: "home", label: { en: "Home", hi: "मुख्य" } },
    { id: "how_it_works", label: { en: "How It Works", hi: "यह कैसे काम करता है" } },
    { id: "pricing", label: { en: "Memberships", hi: "की सदस्यता" } },
    { id: "families", label: { en: "For Families", hi: "परिवारों के लिए" } },
    { id: "businesses", label: { en: "For Businesses", hi: "व्यवसाय सुरक्षा" } },
    { id: "about", label: { en: "About Trust", hi: "ट्रस्ट और हमारे बारे में" } },
    { id: "dashboard", label: { en: "App Dashboard", hi: "एप्लिकेशन डैशबोर्ड" } }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-brand-navy text-white border-b border-blue-900 shadow-md backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { setActiveTab("home"); window.scrollTo(0,0); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded bg-white text-brand-navy flex items-center justify-center font-black text-lg shadow-sm transition-transform group-hover:scale-105">
              W
            </div>
            <div>
              <span className="text-xl font-display font-bold tracking-tight text-white block">
                WAKIL<span className="text-brand-gold font-sans font-medium text-xs ml-1 bg-white/10 px-1.5 py-0.5 rounded uppercase tracking-widest text-[9px]">India</span>
              </span>
              <span className="text-[9px] text-blue-200 font-mono tracking-wider uppercase block -mt-1 hidden sm:block">
                {currentLang === "EN" ? "Legal Protection layer" : "कानूनी सुरक्षा कवच"}
              </span>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors rounded ${
                  activeTab === link.id
                    ? "text-white bg-blue-800/80 shadow-sm border border-blue-600/30"
                    : "text-blue-100 hover:text-white hover:bg-white/5"
                }`}
              >
                {currentLang === "EN" ? link.label.en : link.label.hi}
              </button>
            ))}
          </div>

          {/* User Controls */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Lang Switcher */}
            <button
              onClick={() => setLang(currentLang === "EN" ? "HI" : "EN")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium text-blue-100 hover:text-white border border-blue-700/60 hover:border-blue-400 rounded transition-all bg-brand-navy/50"
            >
              <Languages className="w-3.5 h-3.5 text-brand-gold" />
              <span>{currentLang === "EN" ? "HI (हिन्दी)" : "EN (English)"}</span>
            </button>

            {/* Emergency CTA */}
            <button
              onClick={() => { setActiveTab("emergency_panel"); window.scrollTo(0,0); }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-md animate-pulse"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{currentLang === "EN" ? "Emergency" : "आपातकाल"}</span>
            </button>

            {/* Premium Consult Form Trigger */}
            <button
              onClick={onOpenConsultForm}
              className="flex items-center gap-1 px-4 py-1.5 bg-brand-gold text-brand-charcoal hover:bg-opacity-95 rounded text-xs font-bold tracking-wide shadow-sm"
            >
              <span>{currentLang === "EN" ? "Get Legal Help" : "सहायता लें"}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setLang(currentLang === "EN" ? "HI" : "EN")}
              className="flex items-center gap-1.5 px-2 py-1 text-xs border border-gray-700 rounded text-brand-gold"
            >
              <Languages className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => { setActiveTab("emergency_panel"); }}
              className="px-2.5 py-1.5 bg-red-600 text-white rounded text-xs font-bold"
            >
              🚨
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-blue-900 bg-brand-navy py-4 px-4 space-y-2">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors block rounded ${
                activeTab === link.id
                  ? "bg-blue-800 text-brand-gold"
                  : "text-blue-100 hover:bg-white/5"
              }`}
            >
              {currentLang === "EN" ? link.label.en : link.label.hi}
            </button>
          ))}
          <div className="pt-4 border-t border-blue-800/60 flex flex-col gap-3">
            <button
              onClick={() => {
                onOpenConsultForm();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center px-4 py-2.5 bg-brand-gold text-brand-charcoal rounded font-bold text-xs uppercase tracking-wide"
            >
              {currentLang === "EN" ? "Book Advocate Consult" : "वकील परामर्श बुक करें"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
