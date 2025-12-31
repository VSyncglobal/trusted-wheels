"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Plus, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { createVehicleAction } from "./actions";

// --- CONSTANTS ---
const BRANDS = ["Toyota", "Mercedes-Benz", "BMW", "Audi", "Land Rover", "Nissan", "Honda", "Mazda"];
const TYPES = ["SUV", "Sedan", "Pickup Truck", "Crossover", "Hatchback", "Coupe"];
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
const FUEL_TYPES = ["PETROL", "DIESEL", "HYBRID", "ELECTRIC"];
const TRANSMISSIONS = ["AUTOMATIC", "MANUAL", "CVT"];

// --- TYPES ---
interface CustomSpec {
  key: string;
  value: string;
}

export default function CreateVehiclePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1);
  
  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    type: "",
    condition: "USED",
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

  const addCustomSpec = () => {
    if (newSpec.key && newSpec.value) {
      setCustomSpecs([...customSpecs, { ...newSpec }]);
      setNewSpec({ key: "", value: "" });
    }
  };

  const removeCustomSpec = (index: number) => {
    setCustomSpecs(customSpecs.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    startTransition(async () => {
      const payload: any = { ...formData, customSpecs };
      const result = await createVehicleAction(payload);
      if (result.success) {
        router.push("/"); 
      } else {
        alert("Failed to create vehicle: " + (result.error || "Unknown error"));
      }
    });
  };

  // Standard styles for maximum visibility
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2";
  const inputClass = "w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all";
  const sectionClass = "bg-white p-8 rounded-xl border border-gray-200 shadow-sm mb-6";

  const isStep1Valid = formData.brand && formData.model && formData.year;

  return (
    <div className="min-h-screen bg-gray-50 pb-32 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 mb-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Add New Vehicle</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
             <span className={step >= 1 ? "text-black font-semibold" : ""}>1. Classification</span>
             <ChevronRight size={14} />
             <span className={step >= 2 ? "text-black font-semibold" : ""}>2. Specifications</span>
             <ChevronRight size={14} />
             <span className={step >= 3 ? "text-black font-semibold" : ""}>3. Review</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6">
        
        {/* STEP 1: CLASSIFICATION */}
        {step === 1 && (
          <div className={sectionClass}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Brand</label>
                <select className={inputClass} value={formData.brand} onChange={(e) => handleChange("brand", e.target.value)}>
                  <option value="">Select Brand</option>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Model</label>
                <input type="text" className={inputClass} placeholder="e.g. C-Class" value={formData.model} onChange={(e) => handleChange("model", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Year</label>
                <select className={inputClass} value={formData.year} onChange={(e) => handleChange("year", e.target.value)}>
                  <option value="">Select Year</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Body Type</label>
                <select className={inputClass} value={formData.type} onChange={(e) => handleChange("type", e.target.value)}>
                  <option value="">Select Type</option>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SPECIFICATIONS */}
        {step === 2 && (
          <div className="space-y-6">
            <div className={sectionClass}>
              <h2 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">Core Specs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className={labelClass}>Engine Size (CC)</label>
                   <input type="number" className={inputClass} value={formData.engineSizeCC} onChange={(e) => handleChange("engineSizeCC", e.target.value)} />
                </div>
                <div>
                   <label className={labelClass}>Mileage (Km)</label>
                   <input type="number" className={inputClass} value={formData.mileage} onChange={(e) => handleChange("mileage", e.target.value)} />
                </div>
                 <div>
                   <label className={labelClass}>Fuel Type</label>
                   <select className={inputClass} value={formData.fuelType} onChange={(e) => handleChange("fuelType", e.target.value)}>
                     {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                   </select>
                </div>
                <div>
                   <label className={labelClass}>Transmission</label>
                   <select className={inputClass} value={formData.transmission} onChange={(e) => handleChange("transmission", e.target.value)}>
                     {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                </div>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Custom Features</h2>
              <div className="flex gap-3 items-end mb-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Feature</label>
                  <input type="text" className="w-full p-2 border border-gray-300 rounded text-sm text-black" placeholder="e.g. Sunroof" value={newSpec.key} onChange={(e) => setNewSpec({...newSpec, key: e.target.value})} />
                </div>
                <div className="flex-1">
                   <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Value</label>
                  <input type="text" className="w-full p-2 border border-gray-300 rounded text-sm text-black" placeholder="e.g. Panoramic" value={newSpec.value} onChange={(e) => setNewSpec({...newSpec, value: e.target.value})} />
                </div>
                <button onClick={addCustomSpec} className="h-[38px] px-3 bg-black text-white rounded hover:bg-gray-800 flex items-center justify-center">
                  <Plus size={16} />
                </button>
              </div>
              
              {customSpecs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customSpecs.map((spec, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded text-sm">
                      <span className="text-gray-900 font-medium">{spec.key}: <span className="text-gray-600 font-normal">{spec.value}</span></span>
                      <button onClick={() => removeCustomSpec(idx)} className="text-gray-400 hover:text-red-600 p-1"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic text-center py-2">No custom features added.</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW & PRICING */}
        {step === 3 && (
          <div className="space-y-6">
            <div className={sectionClass}>
              <h2 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className={labelClass}>Base Cost (Private)</label>
                   <div className="relative">
                      <span className="absolute left-3 top-3.5 text-gray-500 text-sm font-bold">KES</span>
                      <input type="number" className={`${inputClass} pl-12`} placeholder="0.00" value={formData.basePrice} onChange={(e) => handleChange("basePrice", e.target.value)} />
                   </div>
                </div>
                <div>
                   <label className={labelClass}>Listing Price (Public)</label>
                   <div className="relative">
                      <span className="absolute left-3 top-3.5 text-gray-500 text-sm font-bold">KES</span>
                      <input type="number" className={`${inputClass} pl-12`} placeholder="0.00" value={formData.sellingPrice} onChange={(e) => handleChange("sellingPrice", e.target.value)} />
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-black text-white rounded-xl p-8 shadow-xl">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <CheckCircle2 className="text-green-500" size={20} /> Review Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                 <div>
                    <span className="block text-gray-500 text-xs uppercase font-bold mb-1">Vehicle</span>
                    <span className="text-white font-medium text-lg">{formData.brand} {formData.model}</span>
                 </div>
                 <div>
                    <span className="block text-gray-500 text-xs uppercase font-bold mb-1">Year</span>
                    <span className="text-white font-medium text-lg">{formData.year}</span>
                 </div>
                 <div>
                    <span className="block text-gray-500 text-xs uppercase font-bold mb-1">Features</span>
                    <span className="text-white font-medium text-lg">{customSpecs.length} items</span>
                 </div>
                 <div>
                    <span className="block text-gray-500 text-xs uppercase font-bold mb-1">Listing Price</span>
                    <span className="text-white font-medium text-lg">{formData.sellingPrice ? `KES ${Number(formData.sellingPrice).toLocaleString()}` : '-'}</span>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-200 z-50">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => setStep(Math.max(1, step - 1))} 
            disabled={step === 1 || isPending} 
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-black disabled:opacity-30 text-sm font-bold uppercase tracking-wider transition-colors"
          >
            <ChevronLeft size={16}/> Back
          </button>
          
          {step < 3 ? (
            <button 
              onClick={() => setStep(Math.min(3, step + 1))} 
              disabled={(step === 1 && !isStep1Valid)} 
              className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 font-bold uppercase tracking-wider shadow-lg transition-transform active:scale-95"
            >
              Continue <ChevronRight size={16}/>
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              disabled={isPending} 
              className="flex items-center gap-2 px-10 py-3 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-70 font-bold uppercase tracking-wider shadow-lg transition-all"
            >
              {isPending ? <><Loader2 className="animate-spin" size={18}/> Processing...</> : "Save Vehicle"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}