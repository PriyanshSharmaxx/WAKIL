/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Shield,
  PhoneCall,
  FileText,
  Users,
  Briefcase,
  Layers,
  CheckCircle,
  Clock,
  Trash2,
  Plus,
  Send,
  AlertTriangle,
  MapPin,
  TrendingUp,
  X,
  Languages,
  User,
  Power,
  DollarSign
} from "lucide-react";
import { CITIES_COVERED, SERVICE_AREAS } from "../types";

interface DashboardProps {
  currentLang: "EN" | "HI";
}

export default function Dashboard({ currentLang }: DashboardProps) {
  const [activeTab, setActiveTab] = React.useState<"user" | "family" | "business" | "lawyer" | "admin">("user");

  // ==========================================
  // SHARED STATES & DATA SIMULATORS
  // ==========================================
  
  // 1. User Documents Vault State
  const [vaultDocs, setVaultDocs] = React.useState([
    { id: "d1", name: "Aadhaar Card Copy.pdf", category: "ID_PROOF", size: "1.2 MB", date: "May 24, 2026" },
    { id: "d2", name: "Driving License MH-12.jpg", category: "VEHICLE", size: "850 KB", date: "May 25, 2026" },
    { id: "d3", name: "Rent Agreement - Mumbai Flat.pdf", category: "PROPERTY", size: "4.5 MB", date: "May 28, 2026" }
  ]);
  const [newDocName, setNewDocName] = React.useState("");
  const [newDocCat, setNewDocCat] = React.useState("ID_PROOF");

  // 2. Chat Simulation State
  const [chatMessages, setChatMessages] = React.useState([
    { id: "m1", sender: "Adv. Smita Deshmukh", role: "LAWYER", text: "Hello! I have reviewed your police-stop triage details. Do not sign any custody declarations or seizure memos until our team reaches. Are they currently inspecting the engine?" },
    { id: "m2", sender: "You (Client)", role: "CLIENT", text: "Got it, Smita. Yes, they are checking my vehicle paperwork now and demanding physical originals." }
  ]);
  const [currentChatInput, setCurrentChatInput] = React.useState("");

  // 3. Family Members State
  const [familyMembers, setFamilyMembers] = React.useState([
    { id: "f1", name: "Meera Nair", relation: "Spouse", phone: "+91 99000 77000", emergency: true },
    { id: "f2", name: "K. R. Nair", relation: "Father", phone: "+91 98112 33445", emergency: true }
  ]);
  const [newFamName, setNewFamName] = React.useState("");
  const [newFamRel, setNewFamRel] = React.useState("Spouse");
  const [newFamPhone, setNewFamPhone] = React.useState("");

  // 4. Business Accounts Details
  const [companySeats, setCompanySeats] = React.useState([
    { id: "s1", name: "Rohit Deshmukh", email: "rohit@nairtech.com", role: "Co-Founder", priorityAccess: true },
    { id: "s2", name: "Divya Sengupta", email: "divya@nairtech.com", role: "Sales Lead", priorityAccess: false }
  ]);
  const [newSeatName, setNewSeatName] = React.useState("");
  const [newSeatEmail, setNewSeatEmail] = React.useState("");

  // 5. Lawyer Panel Custom States
  const [isLawyerOnline, setIsLawyerOnline] = React.useState(true);
  const [lawyerStats, setLawyerStats] = React.useState({
    hourlyRate: 1500,
    earningsThisMonth: 42500,
    resolvedEmergencyCalls: 28,
    activeQueuesServed: 3
  });
  
  // 6. Admin Control Queue
  const [adminEmergencies, setAdminEmergencies] = React.useState([
    { id: "eq1", client: "Vikram Malhotra", phone: "+91 99887 76655", category: "POLICE_STOP", location: "Bandra Highway Checkpoint, Mumbai", waitTime: "3m ago", status: "DISPATCHED", lawyerAssigned: "Adv. Rajesh Kumar" },
    { id: "eq2", client: "Ananya Iyer", phone: "+91 91223 34455", category: "CYBER_FRAUD", location: "Koramangala 4th Block, Bengaluru", waitTime: "6m ago", status: "QUEUE", lawyerAssigned: "None" },
    { id: "eq3", client: "Siddharth Goel", phone: "+91 95556 67788", category: "TRAFFIC_CHALLAN", location: "Noida Sec 15 Flyover, NCR", waitTime: "12m ago", status: "RESOLVED", lawyerAssigned: "Adv. Vivek Oberoi" }
  ]);

  // 7. Simulated Emergency Launcher on User View
  const [userEmergencyStatus, setUserEmergencyStatus] = React.useState<"idle" | "connecting" | "active">("idle");
  const [userEmergencyDetails, setUserEmergencyDetails] = React.useState<any>(null);

  // ==========================================
  // DISPATCH HANDLERS
  // ==========================================
  
  const handleTriggerEmergency = async (category: string) => {
    setUserEmergencyStatus("connecting");
    try {
      const response = await fetch("/api/emergency/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: "You (Registered Client)",
          clientPhone: "+91 99000 88000",
          category,
          locationAddress: "Connaught Place, Central Delhi",
          lat: 28.630,
          lng: 77.217
        })
      });
      const data = await response.json();
      if (data.success) {
        setUserEmergencyStatus("active");
        setUserEmergencyDetails(data.dispatch);
        
        // Also inject into Admin emergencies in memory
        setAdminEmergencies(prev => [
          {
            id: data.dispatch.id,
            client: "You (Registered Client)",
            phone: "+91 99000 88000",
            category: data.dispatch.category,
            location: data.dispatch.location.address,
            waitTime: "Just now",
            status: "DISPATCHED",
            lawyerAssigned: data.dispatch.lawyerName
          },
          ...prev
        ]);
      }
    } catch (err) {
      setUserEmergencyStatus("idle");
      alert("Emergency node offline.");
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentChatInput) return;
    setChatMessages(prev => [
      ...prev,
      { id: `c_${Date.now()}`, sender: "You (Client)", role: "CLIENT", text: currentChatInput }
    ]);
    setCurrentChatInput("");

    // Simulate smart lawyer feedback after 2 seconds
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { 
          id: `cr_${Date.now()}`, 
          sender: "Adv. Smita Deshmukh", 
          role: "LAWYER", 
          text: "Understood. Keep recording coordinates if possible, and state clearly that you have legal representation with Wakil Shield active." 
        }
      ]);
    }, 2000);
  };

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;
    setVaultDocs(prev => [
      ...prev,
      {
        id: `doc_${Date.now()}`,
        name: newDocName.endsWith(".pdf") || newDocName.endsWith(".jpg") ? newDocName : `${newDocName}.pdf`,
        category: newDocCat,
        size: "1.5 MB",
        date: "Today"
      }
    ]);
    setNewDocName("");
  };

  const handleAddFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamName || !newFamPhone) return;
    setFamilyMembers(prev => [
      ...prev,
      { id: `fam_${Date.now()}`, name: newFamName, relation: newFamRel, phone: newFamPhone, emergency: true }
    ]);
    setNewFamName("");
    setNewFamPhone("");
  };

  const handleAddSeat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeatName || !newSeatEmail) return;
    setCompanySeats(prev => [
      ...prev,
      { id: `seat_${Date.now()}`, name: newSeatName, email: newSeatEmail, role: "Team Member", priorityAccess: true }
    ]);
    setNewSeatName("");
    setNewSeatEmail("");
  };

  const handleAdminAssign = (id: string, lawyerName: string) => {
    setAdminEmergencies(prev =>
      prev.map(em => em.id === id ? { ...em, status: "DISPATCHED", lawyerAssigned: lawyerName } : em)
    );
  };

  return (
    <div className="bg-white min-h-[750px] rounded-xl border border-slate-200 overflow-hidden shadow-md grid grid-cols-1 md:grid-cols-4">
      
      {/* Sidebar Controller */}
      <div className="bg-white text-slate-800 p-6 space-y-8 md:col-span-1 border-r border-slate-200">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#1e40af] uppercase block font-bold">DEMO CONSOLE</span>
          <h2 className="text-xl font-display font-black text-brand-navy mt-0.5">Wakil Workspace</h2>
        </div>

        <div className="space-y-1.5">
          <button
            onClick={() => setActiveTab("user")}
            className={`w-full text-left px-3 py-2.5 rounded text-xs font-bold tracking-wide uppercase transition-all flex items-center gap-2.5 border-l-4 ${
              activeTab === "user" 
                ? "bg-slate-100 text-[#1e3a8a] border-[#1e40af]" 
                : "text-slate-600 hover:bg-slate-50 border-transparent hover:text-[#1e3a8a]"
            }`}
          >
            <User className={`w-4 h-4 ${activeTab === "user" ? "text-[#1e3a8a]" : "text-slate-400"}`} />
            <span>User Client Panel</span>
          </button>

          <button
            onClick={() => setActiveTab("family")}
            className={`w-full text-left px-3 py-2.5 rounded text-xs font-bold tracking-wide uppercase transition-all flex items-center gap-2.5 border-l-4 ${
              activeTab === "family" 
                ? "bg-slate-100 text-[#1e3a8a] border-[#1e40af]" 
                : "text-slate-600 hover:bg-slate-50 border-transparent hover:text-[#1e3a8a]"
            }`}
          >
            <Users className={`w-4 h-4 ${activeTab === "family" ? "text-[#1e3a8a]" : "text-slate-400"}`} />
            <span>Family Shield ({familyMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("business")}
            className={`w-full text-left px-3 py-2.5 rounded text-xs font-bold tracking-wide uppercase transition-all flex items-center gap-2.5 border-l-4 ${
              activeTab === "business" 
                ? "bg-slate-100 text-[#1e3a8a] border-[#1e40af]" 
                : "text-slate-600 hover:bg-slate-50 border-transparent hover:text-[#1e3a8a]"
            }`}
          >
            <Briefcase className={`w-4 h-4 ${activeTab === "business" ? "text-[#1e3a8a]" : "text-slate-400"}`} />
            <span>Business Team</span>
          </button>

          <button
            onClick={() => setActiveTab("lawyer")}
            className={`w-full text-left px-3 py-2.5 rounded text-xs font-bold tracking-wide uppercase transition-all flex items-center gap-2.5 border-l-4 ${
              activeTab === "lawyer" 
                ? "bg-slate-100 text-[#1e3a8a] border-[#1e40af]" 
                : "text-slate-600 hover:bg-slate-50 border-transparent hover:text-[#1e3a8a]"
            }`}
          >
            <Layers className={`w-4 h-4 ${activeTab === "lawyer" ? "text-[#1e3a8a]" : "text-slate-400"}`} />
            <span>Lawyer Workspace</span>
          </button>

          <button
            onClick={() => setActiveTab("admin")}
            className={`w-full text-left px-3 py-2.5 rounded text-xs font-bold tracking-wide uppercase transition-all flex items-center gap-2.5 border-l-4 ${
              activeTab === "admin" 
                ? "bg-red-50 text-red-800 border-red-600 font-bold" 
                : "text-slate-600 hover:bg-slate-50 border-transparent hover:text-red-700"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>Ops Command Center</span>
          </button>
        </div>

        <div className="pt-6 border-t border-slate-200 space-y-3">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="block text-[8px] font-mono tracking-wider text-slate-400 font-bold">MEMBERSHIP COVER</span>
            <span className="block text-xs font-display font-black text-[#1e3a8a] uppercase mt-0.5">Shield Plus Tier</span>
            <span className="text-[10px] text-slate-500 font-light block mt-1">Renewal: 29-Jun-2026</span>
          </div>
        </div>
      </div>

      {/* Main Panel View Area */}
      <div className="md:col-span-3 p-6 sm:p-8 space-y-8 bg-brand-beige bg-opacity-30">
        
        {/* ==========================================
            USER CLIENT TAB VIEW
           ========================================== */}
        {activeTab === "user" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-4">
              <div>
                <h1 className="text-2xl font-display font-bold text-brand-charcoal">Client Dashboard</h1>
                <p className="text-xs text-gray-500 font-light">Manage emergency connections, review chat chains and security vaults.</p>
              </div>

              {/* Status capsule */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs shrink-0 self-start">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="font-mono text-[10px] text-gray-600 font-bold uppercase">Wakil Shield Protection ACTIVE</span>
              </div>
            </div>

            {/* Emergency trigger module */}
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5 text-red-700">
                  <PhoneCall className="w-5 h-5 shrink-0" />
                  <h3 className="font-display font-bold text-base">Instant Emergency Lawyer Connect</h3>
                </div>
                <span className="px-2 py-0.5 border border-red-300 text-red-800 text-[9px] font-mono rounded uppercase">
                  priority routing Node
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-light">
                Facing an active traffic checkpoint, questioning, or cyber theft? Pick your category and establish an instantaneous voice or chat link to our peer senior council.
              </p>

              {userEmergencyStatus === "idle" ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  <button onClick={() => handleTriggerEmergency("POLICE_STOP")} className="p-2.5 bg-red-650 hover:bg-red-700 text-white rounded text-xs font-mono font-medium tracking-wide uppercase transition-colors">
                    🚔 Police Stop
                  </button>
                  <button onClick={() => handleTriggerEmergency("CYBER_FRAUD")} className="p-2.5 bg-red-650 hover:bg-red-700 text-white rounded text-xs font-mono font-medium tracking-wide uppercase transition-colors">
                    💻 Cyber Scam
                  </button>
                  <button onClick={() => handleTriggerEmergency("TRAFFIC_CHALLAN")} className="p-2.5 bg-red-650 hover:bg-red-700 text-white rounded text-xs font-mono font-medium tracking-wide uppercase transition-colors">
                    🚗 Traffic Stop
                  </button>
                  <button onClick={() => handleTriggerEmergency("CIVIL_CRISIS")} className="p-2.5 bg-red-650 hover:bg-red-700 text-white rounded text-xs font-mono font-medium tracking-wide uppercase transition-colors">
                    ⚡ General Dispute
                  </button>
                </div>
              ) : userEmergencyStatus === "connecting" ? (
                <div className="p-4 bg-white/70 border border-red-200 rounded flex items-center justify-center gap-3">
                  <span className="w-4 h-4 rounded-full border-t-2 border-red-650 animate-spin"></span>
                  <span className="text-xs font-mono text-gray-600 uppercase">Allocating closest verified attorney near you...</span>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-800 font-bold uppercase">
                    <span>✓ DISPATCHED CONNECTED STATE</span>
                    <button onClick={() => setUserEmergencyStatus("idle")} className="text-red-600 hover:underline">Discharge</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-white border border-gray-100 rounded space-y-1">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-gray-400">ASSIGNED ADVISE ADVOCATE</span>
                      <strong className="block text-sm text-brand-charcoal">{userEmergencyDetails.lawyerName}</strong>
                      <span className="text-xs font-mono text-gray-500">{userEmergencyDetails.lawyerContact}</span>
                    </div>
                    <div className="p-3 bg-white border border-gray-100 rounded space-y-1">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-gray-400">ESTIMATED LAUNCH MEETING ARRIVAL</span>
                      <strong className="block text-sm text-brand-charcoal">&lt; 3 Minutes (Direct Dial)</strong>
                      <span className="text-xs text-gray-500">Security node is recording trace details</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Workspace + File Vault Side by Side Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Interactive Chat box simulating messaging client */}
              <div className="bg-white rounded-xl border border-gray-150 p-5 h-[400px] flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-gray-150 pb-3 mb-3">
                  <div>
                    <span className="font-display font-bold text-sm text-brand-charcoal block">Secure Consultation Channel</span>
                    <span className="text-[10px] font-mono text-gray-400 uppercase">End-to-end Encrypted</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 rounded text-emerald-700 text-[9px] font-mono uppercase font-bold border border-emerald-250">
                    Active Channel
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.role === "CLIENT" ? "items-end" : "items-start"}`}>
                      <span className="text-[9px] font-mono text-gray-400 font-bold mb-0.5">{msg.sender}</span>
                      <div className={`p-3 rounded-lg text-xs leading-relaxed max-w-[85%] ${
                        msg.role === "CLIENT" 
                          ? "bg-brand-charcoal text-white rounded-tr-none" 
                          : "bg-brand-beige border border-gray-200 text-brand-charcoal rounded-tl-none"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-gray-150 pt-3 mt-3">
                  <input
                    type="text"
                    value={currentChatInput}
                    onChange={(e) => setCurrentChatInput(e.target.value)}
                    placeholder="Type legal clarification request..."
                    className="flex-1 bg-brand-beige border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-gold text-brand-charcoal"
                  />
                  <button type="submit" className="p-2.5 bg-brand-gold text-brand-charcoal rounded hover:bg-opacity-95 text-xs font-semibold">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Personal Documents Vault */}
              <div className="bg-white rounded-xl border border-gray-150 p-5 h-[400px] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-150 pb-3">
                    <div>
                      <span className="font-display font-bold text-sm text-brand-charcoal block">Confidential Vault File System</span>
                      <span className="text-[10px] font-mono text-gray-400 uppercase">Isolated AES Storage</span>
                    </div>
                    <span className="text-xs font-mono text-gray-500">2.6 MB / 2 GB</span>
                  </div>

                  {/* Add document inputs */}
                  <form onSubmit={handleAddDoc} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Doc name (e.g. rent.pdf)"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      className="p-1.5 border border-gray-200 rounded text-xs col-span-2 focus:outline-none"
                      required
                    />
                    <button type="submit" className="p-1.5 bg-brand-charcoal text-white rounded text-xs font-semibold font-mono tracking-wider uppercase">
                      + VAULT
                    </button>
                  </form>

                  {/* Document Lists */}
                  <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1">
                    {vaultDocs.map(doc => (
                      <div key={doc.id} className="p-2 border border-gray-100 rounded text-xs flex items-center justify-between group bg-slate-50/50">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-brand-gold" />
                          <div>
                            <span className="block font-medium text-brand-charcoal">{doc.name}</span>
                            <span className="text-[9px] text-gray-400 font-mono italic uppercase">{doc.category} ({doc.size})</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setVaultDocs(prev => prev.filter(d => d.id !== doc.id))}
                          className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50 border border-blue-150 rounded text-[10px] text-blue-800">
                  🔒 Document Vault strictly obeys encryption frameworks. Rest assured our admins cannot access files unless shared during active emergencies.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==========================================
            FAMILY COVERS TAB VIEW
           ========================================== */}
        {activeTab === "family" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-display font-bold text-brand-charcoal">Family Shield Panel</h1>
              <p className="text-xs text-gray-500 font-light">Extend your on-demand emergency coverage limits to up to 4 trusted kin nodes.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Form to add */}
              <div className="bg-white p-6 border border-gray-200 rounded-xl space-y-4 lg:col-span-1">
                <h3 className="font-display font-bold text-sm text-brand-charcoal border-b border-gray-150 pb-2">Add Member Node</h3>
                
                <form onSubmit={handleAddFamily} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={newFamName}
                      onChange={(e) => setNewFamName(e.target.value)}
                      placeholder="e.g. Pooja Nair"
                      className="w-full bg-brand-beige border border-gray-200 focus:border-brand-gold rounded p-2.5 text-xs text-brand-charcoal"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500 block mb-1">Relation</label>
                    <select
                      value={newFamRel}
                      onChange={(e) => setNewFamRel(e.target.value)}
                      className="w-full bg-brand-beige border border-gray-200 focus:border-brand-gold rounded p-2.5 text-xs text-brand-charcoal"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Child">Child / Dependent</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500 block mb-1">WhatsApp Mobile Number</label>
                    <input
                      type="tel"
                      value={newFamPhone}
                      onChange={(e) => setNewFamPhone(e.target.value)}
                      placeholder="e.g. +91 94432 00112"
                      className="w-full bg-brand-beige border border-gray-200 focus:border-brand-gold rounded p-2.5 text-xs text-brand-charcoal"
                      required
                    />
                  </div>

                  <button type="submit" className="w-full py-2.5 bg-brand-gold text-brand-charcoal rounded hover:bg-opacity-95 font-semibold text-xs tracking-wider uppercase">
                    Connect Member Cover
                  </button>
                </form>
              </div>

              {/* List of family members */}
              <div className="bg-white p-6 border border-gray-200 rounded-xl space-y-4 lg:col-span-2">
                <div className="flex items-center justify-between border-b border-gray-150 pb-2">
                  <h3 className="font-display font-bold text-sm text-brand-charcoal">Protected Members</h3>
                  <span className="px-2 py-0.5 bg-brand-gold/10 text-brand-gold text-[9px] font-mono rounded uppercase font-bold">
                    {familyMembers.length} / 4 COVERED HOOKS
                  </span>
                </div>

                <div className="space-y-3">
                  {familyMembers.map(member => (
                    <div key={member.id} className="p-4 border border-gray-150 rounded-lg flex items-center justify-between bg-slate-50/50">
                      <div>
                        <strong className="block text-sm text-brand-charcoal">{member.name}</strong>
                        <span className="text-xs text-gray-400 font-mono italic">{member.relation}  |  {member.phone}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-mono">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Emergency Guard Active</span>
                        </div>
                        <button
                          onClick={() => setFamilyMembers(prev => prev.filter(f => f.id !== member.id))}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==========================================
            BUSINESS TEAM REGISTRY TAB
           ========================================== */}
        {activeTab === "business" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-display font-bold text-brand-charcoal">Business Starter Administration Panel</h1>
              <p className="text-xs text-gray-500 font-light">Manage employee slots, regulatory compliance, and legal request allocation tracking.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Assign team seat panel */}
              <div className="bg-white p-6 border border-gray-200 rounded-xl space-y-4 lg:col-span-1">
                <h3 className="font-display font-bold text-sm text-brand-charcoal border-b border-gray-150 pb-2">Allocate Corporate Seat</h3>
                
                <form onSubmit={handleAddSeat} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500 block mb-1">Employee Name</label>
                    <input
                      type="text"
                      value={newSeatName}
                      onChange={(e) => setNewSeatName(e.target.value)}
                      placeholder="e.g. Divya Sengupta"
                      className="w-full bg-brand-beige border border-gray-200 focus:border-brand-gold rounded p-2.5 text-xs text-brand-charcoal"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500 block mb-1">Company Email</label>
                    <input
                      type="email"
                      value={newSeatEmail}
                      onChange={(e) => setNewSeatEmail(e.target.value)}
                      placeholder="e.g. divya@company.com"
                      className="w-full bg-brand-beige border border-gray-200 focus:border-brand-gold rounded p-2.5 text-xs text-brand-charcoal"
                      required
                    />
                  </div>

                  <button type="submit" className="w-full py-2.5 bg-brand-charcoal hover:bg-opacity-90 text-white rounded text-xs font-semibold tracking-wider uppercase">
                    Register Seat Node
                  </button>
                </form>
              </div>

              {/* Active employee roster list */}
              <div className="bg-white p-6 border border-gray-200 rounded-xl space-y-4 lg:col-span-2">
                <div className="flex items-center justify-between border-b border-gray-150 pb-2">
                  <h3 className="font-display font-bold text-sm text-brand-charcoal">Active Seats</h3>
                  <span className="px-2 py-0.5 bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/40 text-[9px] font-mono rounded uppercase font-bold">
                    {companySeats.length} / 10 SEATS REGISTERED
                  </span>
                </div>

                <div className="space-y-3">
                  {companySeats.map(seat => (
                    <div key={seat.id} className="p-4 border border-gray-150 rounded-lg flex items-center justify-between bg-slate-50/50">
                      <div>
                        <strong className="block text-sm text-brand-charcoal">{seat.name}</strong>
                        <span className="text-xs text-gray-400 font-mono italic">{seat.email}  |  {seat.role}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="px-2.5 py-1 bg-brand-emerald/20 border border-brand-emerald text-brand-gold font-mono text-[9px] uppercase font-bold rounded">
                          Priority Support Cover
                        </span>
                        <button
                          onClick={() => setCompanySeats(prev => prev.filter(s => s.id !== seat.id))}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==========================================
            LAWYER SPECIAL PANEL
           ========================================== */}
        {activeTab === "lawyer" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-4">
              <div>
                <h1 className="text-2xl font-display font-bold text-brand-charcoal">Lawyer Console Portal</h1>
                <p className="text-xs text-gray-500 font-light">Set availability states, consult earnings benchmarks, retrieve active files directory.</p>
              </div>

              {/* Active Status controls */}
              <button
                onClick={() => setIsLawyerOnline(!isLawyerOnline)}
                className={`px-4 py-2 text-xs font-mono font-semibold tracking-wide uppercase transition-all rounded border flex items-center gap-2 ${
                  isLawyerOnline 
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800" 
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                <Power className="w-4 h-4" />
                <span>Status: {isLawyerOnline ? "ONLINE AVAILABLE" : "OFFLINE COGNIZANT"}</span>
              </button>
            </div>

            {/* Quick stats counter */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-5 border border-gray-150 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-gray-400 font-bold block">Earnings This Month</span>
                  <strong className="text-xl font-display text-brand-charcoal">₹{lawyerStats.earningsThisMonth}</strong>
                </div>
              </div>

              <div className="bg-white p-5 border border-gray-150 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-gray-400 font-bold block">Emergencies Resolved</span>
                  <strong className="text-xl font-display text-brand-charcoal">{lawyerStats.resolvedEmergencyCalls} Calls</strong>
                </div>
              </div>

              <div className="bg-white p-5 border border-gray-150 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-gray-400 font-bold block">Active Network Queues</span>
                  <strong className="text-xl font-display text-brand-charcoal">3 Channels</strong>
                </div>
              </div>
            </div>

            {/* Simulated Case queues */}
            <div className="bg-white p-6 border border-gray-150 rounded-xl space-y-4">
              <h3 className="font-display font-medium text-brand-charcoal text-sm uppercase tracking-wider">Active Client Case Assignments</h3>
              
              <div className="space-y-4">
                <div className="p-4 border border-gray-150 rounded-lg bg-orange-50/40 divide-y divide-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="px-2 py-0.5 bg-orange-100 border border-orange-300 text-orange-850 font-mono text-[9px] uppercase font-bold rounded">
                      POLICE CRISIS ENCOUNTER
                    </span>
                    <strong className="block text-sm text-brand-charcoal mt-1">Vikram Malhotra (Bandra West, Mumbai)</strong>
                    <span className="text-xs text-gray-400 font-mono">Stopped past Sunset. Demanding original vehicle deeds.</span>
                  </div>
                  <button className="px-4 py-2 bg-brand-emerald hover:bg-opacity-95 text-white text-xs font-semibold rounded uppercase tracking-wider">
                    Respond / Start Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            ADMIN / OPS COMMAND CENTER TAB VIEW
           ========================================== */}
        {activeTab === "admin" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-150 pb-4">
              <div>
                <h1 className="text-2xl font-display font-bold text-brand-charcoal text-red-700">Ops Emergency Command Portal</h1>
                <p className="text-xs text-gray-500 font-light">Analyze nationwide queue assignments, allocate senior council vons, track dispatch times.</p>
              </div>
              <span className="px-3 py-1 bg-red-100 border border-red-300 text-red-800 text-xs font-mono font-bold uppercase rounded animate-pulse">
                SLA Track Active
              </span>
            </div>

            {/* Dashboard metrics header */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white border border-gray-150 rounded-lg text-center shadow-xs">
                <span className="block text-[8px] font-mono text-gray-400 uppercase tracking-widest font-bold">Emergency Queue size</span>
                <strong className="text-xl font-display text-amber-600 block mt-1">
                  {adminEmergencies.filter(e => e.status === "QUEUE").length} Pending
                </strong>
              </div>

              <div className="p-4 bg-white border border-gray-150 rounded-lg text-center shadow-xs">
                <span className="block text-[8px] font-mono text-gray-400 uppercase tracking-widest font-bold">Assigned Active Dispatches</span>
                <strong className="text-xl font-display text-emerald-600 block mt-1">
                  {adminEmergencies.filter(e => e.status === "DISPATCHED").length} Dispatched
                </strong>
              </div>

              <div className="p-4 bg-white border border-gray-150 rounded-lg text-center shadow-xs">
                <span className="block text-[8px] font-mono text-gray-400 uppercase tracking-widest font-bold">Avg. Verification Speed</span>
                <strong className="text-xl font-display text-brand-charcoal block mt-1">
                  8.2 Minutes
                </strong>
              </div>

              <div className="p-4 bg-white border border-gray-150 rounded-lg text-center shadow-xs">
                <span className="block text-[8px] font-mono text-gray-400 uppercase tracking-widest font-bold">SLA Compliance Index</span>
                <strong className="text-xl font-display text-emerald-700 block mt-1">
                  98.4%
                </strong>
              </div>
            </div>

            {/* Active System logs table */}
            <div className="bg-white rounded-xl border border-gray-150 overflow-hidden shadow-sm">
              <div className="p-4 bg-brand-charcoal text-brand-beige flex items-center justify-between">
                <span className="font-display font-bold text-xs uppercase tracking-wider text-brand-gold">
                  Incoming Emergency Broadcast queue
                </span>
                <span className="text-[10px] font-mono text-gray-400 uppercase">Updating live</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-200 uppercase font-mono text-[9px] text-gray-500">
                      <th className="p-4">Client Name</th>
                      <th className="p-4">Incident Category</th>
                      <th className="p-4">Geotag Location</th>
                      <th className="p-4">Allocation Status</th>
                      <th className="p-4">Assigned Lawyer</th>
                      <th className="p-4 text-right">Routing Nodes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {adminEmergencies.map(em => (
                      <tr key={em.id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <span className="font-semibold block text-brand-charcoal">{em.client}</span>
                          <span className="text-[10px] text-gray-400 block">{em.phone}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-semibold ${
                            em.category === "POLICE_STOP" ? "bg-red-100 text-red-800" :
                            em.category === "CYBER_FRAUD" ? "bg-amber-100 text-amber-800" :
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {em.category}
                          </span>
                        </td>
                        <td className="p-4 max-w-[200px] truncate font-mono text-gray-500">
                          {em.location}
                        </td>
                        <td className="p-4">
                          <span className={`font-mono font-bold text-[9px] uppercase ${
                            em.status === "DISPATCHED" ? "text-emerald-600" :
                            em.status === "QUEUE" ? "text-amber-500 animate-pulse" :
                            "text-gray-500"
                          }`}>
                            ● {em.status}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-brand-charcoal">
                          {em.lawyerAssigned}
                        </td>
                        <td className="p-4 text-right">
                          {em.status === "QUEUE" ? (
                            <div className="flex gap-1 justify-end">
                              <button
                                onClick={() => handleAdminAssign(em.id, "Adv. Smita Deshmukh")}
                                className="px-2 py-1 bg-brand-emerald text-white font-semibold rounded hover:bg-opacity-95 text-[10px]"
                              >
                                Smita
                              </button>
                              <button
                                onClick={() => handleAdminAssign(em.id, "Adv. Rajesh Kumar")}
                                className="px-2 py-1 bg-brand-charcoal text-white font-semibold rounded hover:bg-opacity-95 text-[10px]"
                              >
                                Rajesh
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Dispatched ✓</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick notice block */}
            <div className="p-4 bg-brand-beige border border-gray-200 rounded-lg text-xs leading-relaxed text-gray-500 font-light">
              💡 <strong>System Advisory:</strong> As a Super-Admin of the Wakil Platform, prioritize dispatch nodes within 5 minutes. If local council does not accept within SLA timeout, escalate to emergency coordinator nodes manually.
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
