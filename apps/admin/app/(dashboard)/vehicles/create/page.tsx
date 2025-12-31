"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronDown, Plus, Trash2, Loader2, CheckCircle2, Zap, Settings } from "lucide-react";
import Link from "next/link";
import { createVehicleAction, getFeatureTemplates } from "./actions";

// --- CONSTANTS ---
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
const FUEL_TYPES = ["PETROL", "DIESEL", "HYBRID", "ELECTRIC"];
const TRANSMISSIONS = ["AUTOMATIC", "MANUAL", "CVT"];

// --- TYPES ---
interface CustomSpec {
  key: string;
  value: string;
  templateId?: string;
  options?: string[]; 
}

interface Template {
  id: string;
  label: string;
  options: string[];
}

export default function CreateVehiclePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1);
  
  // --- UI STATE ---
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // --- DYNAMIC DATA STATE ---
  const [templates, setTemplates] = useState<Template[]>([]);
  const [brandOptions, setBrandOptions] = useState<string[]>([]);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);

  // Load configuration on mount
  useEffect(() => {
    getFeatureTemplates().then((data) => {
      setTemplates(data);

      const brands = data.find(t => t.label.toLowerCase().includes("brand"));
      if (brands) setBrandOptions(brands.options);

      const types = data.find(t => t.label.toLowerCase().includes("body") || t.label.toLowerCase().includes("type"));
      if (types) setTypeOptions(types.options);
    });
  }, []);
  
  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    type: "",
    condition: "Foreign Used",
    engineSizeCC: "",
    transmission: "AUTOMATIC",
    fuelType: "PETROL",
    mileage: "",
    basePrice: "",
    sellingPrice: "",
  });

  const [customSpecs, setCustomSpecs] = useState<CustomSpec[]>([]);
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addFromTemplate = (templateId: string) => {
    if (!templateId) return;
    const template = templates.find(t => t.id === templateId);
    
    if (template) {
        setCustomSpecs([
            ...customSpecs, 
            { 
                key: template.label, 
                value: "", 
                templateId: template.id, 
                options: template.options 
            }
        ]);
    }
  };

  const addManualSpec = () => {
    if (newSpec.key && newSpec.value) {
      setCustomSpecs([...customSpecs, { ...newSpec }]);
      setNewSpec({ key: "", value: "" });
    }
  };

  const updateSpec = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...customSpecs];
    updated[index] = { ...updated[index], [field]: val };
    setCustomSpecs(updated);
  };

  const removeCustomSpec = (index: number) => {
    setCustomSpecs(customSpecs.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    startTransition(async () => {
      const cleanSpecs = customSpecs.map(({ key, value }) => ({ key, value }));
      const payload: any = { ...formData, customSpecs: cleanSpecs };
      
      const result = await createVehicleAction(payload);
      if (result.success) {
        router.push("/vehicles"); 
      } else {
        alert("Failed to create vehicle.");
      }
    });
  };

  const labelClass = "block text-xs font-extrabold text-black uppercase tracking-widest mb-2 ml-1";
  const sectionClass = "bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 mb-8";

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-black tracking-tight mb-2">Create Vehicle</h1>
          <p className="text-gray-500 font-medium">Add new inventory to the fleet.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
             <span className={`text-xs font-bold uppercase ${step >= 1 ? "text-blue-600" : "text-gray-300"}`}>1. Identity</span>
             <ChevronRight size={14} className="text-gray-300" />
             <span className={`text-xs font-bold uppercase ${step >= 2 ? "text-blue-600" : "text-gray-300"}`}>2. Specs</span>
             <ChevronRight size={14} className="text-gray-300" />
             <span className={`text-xs font-bold uppercase ${step >= 3 ? "text-blue-600" : "text-gray-300"}`}>3. Financials</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        
        {/* STEP 1: BASIC DETAILS */}
        {step === 1 && (
          <div className={sectionClass}>
            <div className="flex justify-between items-start mb-8">
               <h2 className="text-2xl font-extrabold text-black">Vehicle Identity</h2>
               <Link href="/features" target="_blank" className="flex items-center gap-1 text-[10px] font-bold uppercase bg-gray-100 px-3 py-1.5 rounded-lg text-gray-500 hover:bg-black hover:text-white transition-colors">
                  <Settings size={12}/> Edit Dropdowns
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>Brand</label>
                {brandOptions.length === 0 ? (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-yellow-700 font-medium">
                    No "Brand" list found. <Link href="/features" className="underline font-bold">Create one in Features</Link> named "Brand".
                  </div>
                ) : (
                  <select className="input-field" value={formData.brand} onChange={(e) => handleChange("brand", e.target.value)}>
                    <option value="">Select Brand</option>
                    {brandOptions.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                )}
              </div>

              <div>
                <label className={labelClass}>Model</label>
                <input type="text" className="input-field" placeholder="e.g. C-Class" value={formData.model} onChange={(e) => handleChange("model", e.target.value)} />
              </div>

              <div>
                <label className={labelClass}>Year</label>
                <select className="input-field" value={formData.year} onChange={(e) => handleChange("year", e.target.value)}>
                  <option value="">Select Year</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>Body Type</label>
                {typeOptions.length === 0 ? (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-yellow-700 font-medium">
                    No "Body Type" list found. <Link href="/features" className="underline font-bold">Create one in Features</Link>.
                  </div>
                ) : (
                  <select className="input-field" value={formData.type} onChange={(e) => handleChange("type", e.target.value)}>
                    <option value="">Select Type</option>
                    {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                )}
              </div>
              
              <div>
                 <label className={labelClass}>Condition</label>
                 <select className="input-field" value={formData.condition} onChange={(e) => handleChange("condition", e.target.value)}>
                    <option value="Foreign Used">Foreign Used</option>
                    <option value="Locally Used">Locally Used</option>
                    <option value="Brand New">Brand New</option>
                 </select>
              </div>

            </div>
          </div>
        )}

        {/* STEP 2: SPECS */}
        {step === 2 && (
          <div className="space-y-8">
            <div className={sectionClass}>
              <h2 className="text-2xl font-extrabold text-black mb-8">Technical Specs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <label className={labelClass}>Engine Size (CC)</label>
                   <input type="number" className="input-field" placeholder="e.g. 2500" value={formData.engineSizeCC} onChange={(e) => handleChange("engineSizeCC", e.target.value)} />
                </div>
                <div>
                   <label className={labelClass}>Mileage (Km)</label>
                   <input type="number" className="input-field" placeholder="e.g. 45000" value={formData.mileage} onChange={(e) => handleChange("mileage", e.target.value)} />
                </div>
                 <div>
                   <label className={labelClass}>Fuel Type</label>
                   <select className="input-field" value={formData.fuelType} onChange={(e) => handleChange("fuelType", e.target.value)}>
                     {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                   </select>
                </div>
                <div>
                   <label className={labelClass}>Transmission</label>
                   <select className="input-field" value={formData.transmission} onChange={(e) => handleChange("transmission", e.target.value)}>
                     {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                </div>
              </div>
            </div>

            {/* Custom Features Section */}
            <div className={sectionClass}>
              <div className="flex justify-between items-center mb-6 border-b border-gray-200/50 pb-4">
                 <h2 className="text-2xl font-extrabold text-black">Features</h2>
                 
                 {/* --- CUSTOM DROPDOWN FOR HEIGHT LIMIT --- */}
                 <div className="relative">
                    <button 
                        type="button"
                        onClick={() => setShowQuickAdd(!showQuickAdd)}
                        className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold rounded-lg px-3 py-2 hover:bg-blue-100 transition-colors"
                    >
                        <span>+ Select Saved Feature</span>
                        <ChevronDown size={14} className={`transition-transform ${showQuickAdd ? 'rotate-180' : ''}`}/>
                    </button>
                    
                    {/* DROPDOWN MENU */}
                    {showQuickAdd && (
                        <>
                            {/* Backdrop to close on click outside */}
                            <div className="fixed inset-0 z-40" onClick={() => setShowQuickAdd(false)} />
                            
                            {/* Scrollable Menu */}
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 shadow-xl rounded-xl z-50 max-h-60 overflow-y-auto p-2">
                                {templates
                                   .filter(t => !t.label.toLowerCase().includes("brand") && !t.label.toLowerCase().includes("body type"))
                                   .map(t => (
                                   <button 
                                      key={t.id} 
                                      onClick={() => {
                                          addFromTemplate(t.id);
                                          setShowQuickAdd(false);
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors flex items-center justify-between group"
                                   >
                                      {t.label}
                                      <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                   </button>
                                ))}
                                {templates.length === 0 && (
                                    <div className="p-3 text-xs text-gray-400 text-center">No templates found.</div>
                                )}
                            </div>
                        </>
                    )}
                 </div>
              </div>

              <div className="space-y-3 mb-8">
                {customSpecs.map((spec, idx) => (
                  <div  key={idx} className="flex gap-4 items-center bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                    <div className="w-1/3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Feature</label>
                        <input value={spec.key} onChange={(e) => updateSpec(idx, 'key', e.target.value)} className="w-full bg-transparent font-bold text-black border-none p-0 focus:ring-0 text-sm"/>
                    </div>
                    <div className="flex-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Value</label>
                        {spec.options && spec.options.length > 0 ? (
                            <select value={spec.value} onChange={(e) => updateSpec(idx, 'value', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-medium text-black focus:border-blue-500 outline-none">
                                <option value="">- Select -</option>
                                {spec.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        ) : (
                            <input value={spec.value} onChange={(e) => updateSpec(idx, 'value', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-medium text-black focus:border-blue-500 outline-none"/>
                        )}
                    </div>
                    <button onClick={() => removeCustomSpec(idx)} className="text-gray-300 hover:text-red-500 transition-colors p-2"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2"><Zap size={12}/> Add Custom Feature</p>
                <div className="flex gap-4 items-end">
                    <div className="flex-1"><input className="input-field text-sm py-2" placeholder="Name" value={newSpec.key} onChange={(e) => setNewSpec({...newSpec, key: e.target.value})} /></div>
                    <div className="flex-1"><input className="input-field text-sm py-2" placeholder="Value" value={newSpec.value} onChange={(e) => setNewSpec({...newSpec, value: e.target.value})} /></div>
                    <button onClick={addManualSpec} className="h-[42px] px-4 bg-black text-white rounded-xl hover:bg-gray-800 flex items-center justify-center"><Plus size={20} /></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: FINANCIALS */}
        {step === 3 && (
          <div className="space-y-8">
            <div className={sectionClass}>
              <h2 className="text-2xl font-extrabold text-black mb-8">Financials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <label className={labelClass}>Base Cost (Private)</label>
                   <input type="number" className="input-field" placeholder="0.00" value={formData.basePrice} onChange={(e) => handleChange("basePrice", e.target.value)} />
                </div>
                <div>
                   <label className={labelClass}>Listing Price (Public)</label>
                   <input type="number" className="input-field" placeholder="0.00" value={formData.sellingPrice} onChange={(e) => handleChange("sellingPrice", e.target.value)} />
                </div>
              </div>
            </div>
            
            {/* Review Card */}
            <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-500/30">
               <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><CheckCircle2 size={24} /> Review & Publish</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                  <div><span className="block text-blue-200 text-xs uppercase font-extrabold tracking-widest mb-1">Vehicle</span><span className="text-white font-bold text-lg">{formData.brand} {formData.model}</span></div>
                  <div><span className="block text-blue-200 text-xs uppercase font-extrabold tracking-widest mb-1">Year</span><span className="text-white font-bold text-lg">{formData.year}</span></div>
                  <div><span className="block text-blue-200 text-xs uppercase font-extrabold tracking-widest mb-1">Features</span><span className="text-white font-bold text-lg">{customSpecs.length} Added</span></div>
                  <div><span className="block text-blue-200 text-xs uppercase font-extrabold tracking-widest mb-1">Listing Price</span><span className="text-white font-bold text-lg">{formData.sellingPrice ? `KES ${Number(formData.sellingPrice).toLocaleString()}` : '-'}</span></div>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="fixed bottom-6 right-6 md:right-12 flex gap-4 z-50">
          <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1 || isPending} className="px-6 py-3 bg-white text-gray-600 rounded-xl font-bold hover:bg-gray-100 disabled:opacity-0 shadow-lg border border-gray-100 transition-all">Back</button>
          
          {step < 3 ? (
            <button onClick={() => setStep(Math.min(3, step + 1))} className="btn-primary shadow-blue-500/40">Next Step <ChevronRight size={18}/></button>
          ) : (
            <button onClick={handleSubmit} disabled={isPending} className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 hover:scale-105 shadow-xl shadow-green-500/30 flex items-center gap-2 transition-all">
              {isPending ? <Loader2 className="animate-spin" size={20}/> : "Publish Vehicle"}
            </button>
          )}
      </div>
    </div>
  );
}