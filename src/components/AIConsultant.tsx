/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, FileText, CheckSquare, AlertCircle, HelpCircle, Loader2, ArrowRight } from "lucide-react";

interface AIConsultantProps {
  currentLang: "EN" | "HI";
}

export default function AIConsultant({ currentLang }: AIConsultantProps) {
  const [activePlayground, setActivePlayground] = React.useState<"triage" | "document">("triage");
  
  // Triage state
  const [triageQuery, setTriageQuery] = React.useState("");
  const [triageCategory, setTriageCategory] = React.useState("POLICE_STOP");
  const [triageResult, setTriageResult] = React.useState("");
  const [loadingTriage, setLoadingTriage] = React.useState(false);
  const [isLiveKey, setIsLiveKey] = React.useState(false);

  // Document analysis state
  const [docName, setDocName] = React.useState("Rental Agreement Excerpt");
  const [docContent, setDocContent] = React.useState("");
  const [analysisResult, setAnalysisResult] = React.useState("");
  const [loadingAnalysis, setLoadingAnalysis] = React.useState(false);

  const sampleQueries = [
    {
      label: currentLang === "EN" ? "Police Stop past 10 PM" : "रात १० बजे के बाद पुलिस चेकिंग",
      text: "I was driving home and stopped by police. They are demanding to search my car without any warrant. What are my rights?"
    },
    {
      label: currentLang === "EN" ? "Cyber Scammed ₹15,000" : "१५,००० रुपये का तत्काल साइबर फ्रॉड",
      text: "I received a message with a fake electricity bill link. I clicked it and lost ₹15,000 from my GPay account. What step should I take now?"
    },
    {
      label: currentLang === "EN" ? "Arbitrary Tenant Eviction" : "मकान मालिक द्वारा अचानक बेदखली",
      text: "My landlord has asked me to vacate the flat arbitrarily in 5 days, violating our 11-month rent deed which specifies 1 month notice."
    }
  ];

  const handleTriageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!triageQuery) return;
    setLoadingTriage(true);
    setTriageResult("");
    try {
      const res = await fetch("/api/ai/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: triageQuery,
          category: triageCategory,
          preferredLanguage: currentLang
        })
      });
      const data = await res.json();
      if (data.success) {
        setTriageResult(data.triageText);
        setIsLiveKey(data.keyStatus === "live");
      } else {
        setTriageResult("Error contacting AI triage service. Please check configuration.");
      }
    } catch (err) {
      setTriageResult("Communication node failure.");
    } finally {
      setLoadingTriage(false);
    }
  };

  const handleDocumentAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docContent) return;
    setLoadingAnalysis(true);
    setAnalysisResult("");
    try {
      const res = await fetch("/api/ai/document-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docName,
          docContent
        })
      });
      const data = await res.json();
      if (data.success) {
        setAnalysisResult(data.analysisText);
      } else {
        setAnalysisResult("Failed to execute contract pre-analysis. Please check back-end nodes.");
      }
    } catch (err) {
      setAnalysisResult("Document analysis node communication issue.");
    } finally {
      setLoadingAnalysis(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-150 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-600">
            <Sparkles className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-brand-charcoal">
              {currentLang === "EN" ? "Wakil AI Legal Sandbox" : "वकील (Wakil) एआई लीगल सैंडबॉक्स"}
            </h3>
            <span className="text-xs text-gray-400 font-mono">Augmenting, never replacing, licensed advocates</span>
          </div>
        </div>

        {/* Control toggles */}
        <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50 shrink-0">
          <button
            onClick={() => setActivePlayground("triage")}
            className={`px-4 py-2 text-xs font-semibold tracking-wide rounded-md transition-colors ${
              activePlayground === "triage"
                ? "bg-white text-brand-charcoal shadow-sm border border-gray-150"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {currentLang === "EN" ? "Emergency Triage Assistant" : "आपातकालीन ट्राइएज"}
          </button>
          <button
            onClick={() => setActivePlayground("document")}
            className={`px-4 py-2 text-xs font-semibold tracking-wide rounded-md transition-colors ${
              activePlayground === "document"
                ? "bg-white text-brand-charcoal shadow-sm border border-gray-150"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {currentLang === "EN" ? "Express Document Auditor" : "अग्रीमेंट विश्लेषक"}
          </button>
        </div>
      </div>

      {activePlayground === "triage" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Triage Inputs */}
          <div className="space-y-6">
            <form onSubmit={handleTriageSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1">
                  {currentLang === "EN" ? "Choose Urgent Category" : "आपातकालीन श्रेणी"}
                </label>
                <select
                  value={triageCategory}
                  onChange={(e) => setTriageCategory(e.target.value)}
                  className="w-full bg-brand-beige border border-gray-200 focus:border-brand-emerald rounded p-2.5 text-xs text-brand-charcoal focus:outline-none focus:ring-1 focus:ring-brand-emerald"
                >
                  <option value="POLICE_STOP">{currentLang === "EN" ? "Police stopped me/Checkpoint" : "पुलिस कार्रवाई / नाका चेकिंग"}</option>
                  <option value="CYBER_FRAUD">{currentLang === "EN" ? "UPI Financial scams/Identity theft" : "यूपीआई फ्रॉड / साइबर अपराध"}</option>
                  <option value="TENANT_DISPUTE">{currentLang === "EN" ? "Tenant eviction/arbitrary claims" : "किरायेदार-मकान मालिक विवाद"}</option>
                  <option value="TRAFFIC_CHALLAN">{currentLang === "EN" ? "Traffic spot citations/challans limit" : "ट्रैफिक चालान विवाद"}</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1">
                  {currentLang === "EN" ? "Describe Context details" : "स्थिति का विवरण दर्ज करें"}
                </label>
                <textarea
                  rows={4}
                  value={triageQuery}
                  onChange={(e) => setTriageQuery(e.target.value)}
                  className="w-full bg-brand-beige border border-gray-200 focus:border-brand-emerald rounded p-3 text-sm text-brand-charcoal focus:outline-none focus:ring-1 focus:ring-brand-emerald placeholder-gray-400"
                  placeholder={currentLang === "EN" ? "Type situational query or pick quick template samples..." : "स्थिति का विवरण टाइप करें या नीचे से त्वरित विकल्प चुनें..."}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loadingTriage}
                className="w-full py-3 bg-brand-emerald hover:bg-opacity-95 text-white font-semibold rounded text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loadingTriage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing Legal Code...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-brand-gold" />
                    <span>{currentLang === "EN" ? "Process Legal Triage" : "एआई विधिक ट्राइएज प्रोसेस करें"}</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Templates */}
            <div>
              <span className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-2">
                {currentLang === "EN" ? "Sample Scenarios for Quick Triage" : "त्वरित उदाहरण परिदृश्य"}
              </span>
              <div className="space-y-2">
                {sampleQueries.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTriageQuery(q.text)}
                    className="w-full text-left p-3 border border-gray-200 hover:border-brand-gold rounded text-xs transition-colors hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span className="font-medium text-brand-charcoal">{q.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-gold" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Triage Output Panel */}
          <div className="bg-brand-beige/50 rounded-xl border border-gray-200 p-6 flex flex-col justify-between h-[450px]">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <span className="font-mono text-xs uppercase text-gray-400 font-bold tracking-wider">
                {currentLang === "EN" ? "Triage Results Overview" : "ट्राइएज परिणाम रिपोर्ट"}
              </span>
              <span className={`px-2 py-0.5 text-[9px] font-mono rounded uppercase border font-semibold ${
                isLiveKey 
                  ? "bg-emerald-100 border-emerald-300 text-emerald-800" 
                  : "bg-amber-100 border-amber-300 text-amber-800"
              }`}>
                {isLiveKey ? "Gemini-3.5 Mode" : "Sandbox Simulator"}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto text-sm text-gray-700 leading-relaxed font-light scrollbar-thin scrollbar-thumb-gray-200">
              {triageResult ? (
                <div className="whitespace-pre-wrap font-mono text-xs text-brand-charcoal bg-white p-4 rounded border border-gray-150">
                  {triageResult}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full text-gray-400 gap-2">
                  <HelpCircle className="w-8 h-8 text-gray-300" />
                  <p className="text-xs">
                    {currentLang === "EN"
                      ? "Submit situational overview to parse relevant Indian Penal Code provisions, immediate rights, and procedural disclaimers."
                      : "संविधान और भारतीय दंड संहिता संहिताओं के आधार पर अधिकार देखने के लिए मामला जमा करें।"}
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 bg-red-100/50 border border-red-250 rounded text-[11px] text-red-800 mt-4 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>
                <strong>Warning:</strong> AI output aids triage only. In custody or arrest concerns, immediately contact our verified human dispatch nodes.
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Document Pre-Analysis Inputs */}
          <div className="space-y-6">
            <form onSubmit={handleDocumentAudit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1">
                  {currentLang === "EN" ? "File Indicator / Title" : "दस्तावेज का नाम / शीर्षक"}
                </label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full bg-brand-beige border border-gray-200 focus:border-brand-emerald rounded p-2.5 text-xs text-brand-charcoal focus:outline-none"
                  placeholder="e.g., 11 Months rent contract Mumbai.pdf"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1">
                  {currentLang === "EN" ? "Paste Deed / Clause excerpt" : "कॉन्ट्रैक्ट का अंश यहाँ पेस्ट करें"}
                </label>
                <textarea
                  rows={6}
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  className="w-full bg-brand-beige border border-gray-200 focus:border-brand-emerald rounded p-3 text-xs text-brand-charcoal font-mono focus:outline-none placeholder-gray-400"
                  placeholder={currentLang === "EN" ? "Paste contract clauses... e.g., 'The tenant shall not claim any refund of security deposits inside lock-in period of 24 months...'" : "अनुबंध की धाराएं पेस्ट करें..."}
                  required
                ></textarea>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDocContent("Clause 4: Eviction policy. The lessor reserves the right to immediately terminate client tenancy with 48 hours notice without reimbursing security deposits in case of standard minor internal repairs.")}
                  className="px-3 py-1.5 border border-gray-200 rounded text-[10px] font-mono hover:border-brand-gold"
                >
                  Load Eviction Clause Sample
                </button>
                <button
                  type="button"
                  onClick={() => setDocContent("Clause 9: Arbitration & Litigation jurisdictions. Disputes arising shall only be contested in a tribunal located in Port Blair, Andaman Islands, and governed strictly by private maritime guidelines.")}
                  className="px-3 py-1.5 border border-gray-200 rounded text-[10px] font-mono hover:border-brand-gold"
                >
                  Load Remote Forum Sample
                </button>
              </div>

              <button
                type="submit"
                disabled={loadingAnalysis}
                className="w-full py-3 bg-brand-navy hover:bg-opacity-95 text-white font-bold rounded text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
              >
                {loadingAnalysis ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing clauses risk...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 text-brand-gold" />
                    <span>Run Rapid contract Pre-audit</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Analysis Outputs */}
          <div className="bg-brand-beige/50 rounded-xl border border-gray-200 p-6 flex flex-col justify-between h-[450px]">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <span className="font-mono text-xs uppercase text-gray-400 font-bold tracking-wider">
                Risk Safety Highlights
              </span>
              <span className="px-2 py-0.5 bg-brand-emerald/10 text-brand-gold border border-brand-emerald/40 text-[9px] font-mono rounded">
                Pre-Audit Active
              </span>
            </div>

            <div className="flex-1 overflow-y-auto text-sm text-gray-700 leading-relaxed font-light scrollbar-thin scrollbar-thumb-gray-200">
              {analysisResult ? (
                <div className="whitespace-pre-wrap font-mono text-xs text-brand-charcoal bg-white p-4 rounded border border-gray-150">
                  {analysisResult}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full text-gray-400 gap-2">
                  <CheckSquare className="w-8 h-8 text-gray-300" />
                  <p className="text-xs">
                    Paste contract parameters or load samples to highlight 3 structural warning points and potential legal traps early.
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-800 mt-4">
              💡 <strong>Note:</strong> Standard pre-audits identify generic contract loopholes in Indian agreements. Registered members can submit files for a full detailed human check with validated litigation counsel.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
