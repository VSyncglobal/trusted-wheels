'use client'

import { useState, useTransition } from "react"
import { Loader2, Plus, Trash2, CheckCircle2, Zap, ChevronDown } from "lucide-react"
import { updateVehicleDetails } from "../(dashboard)/vehicles/[id]/actions"

// Reusing constants as fallbacks
const DEFAULT_BRANDS = ["Toyota", "Mercedes-Benz", "BMW", "Audi", "Land Rover", "Nissan", "Honda", "Mazda", "Volkswagen", "Porsche"]
const DEFAULT_TYPES = ["SUV", "Sedan", "Pickup Truck", "Crossover", "Hatchback", "Coupe", "Convertible", "Van"]
const FUEL_TYPES = ["PETROL", "DIESEL", "HYBRID", "ELECTRIC"]
const TRANSMISSIONS = ["AUTOMATIC", "MANUAL", "CVT"]
const STATUSES = ["DRAFT", "PUBLISHED", "SOLD", "ARCHIVED"]
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)

// Add templates to props
export function EditForm({ vehicle, features, costs, templates = [] }: any) {
  const [isPending, startTransition] = useTransition()
  
  // UI State
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  
  // --- 1. DYNAMIC OPTIONS LOGIC ---
  // Fetch Brand Options from DB Templates or use Default
  const brandTemplate = templates.find((t: any) => t.label.toLowerCase().includes("brand"));
  const brandOptions = brandTemplate && brandTemplate.options.length > 0 ? brandTemplate.options : DEFAULT_BRANDS;

  // Fetch Body Type Options from DB Templates or use Default
  const typeTemplate = templates.find((t: any) => t.label.toLowerCase().includes("body") || t.label.toLowerCase().includes("type"));
  const typeOptions = typeTemplate && typeTemplate.options.length > 0 ? typeTemplate.options : DEFAULT_TYPES;

  // Helper to extract existing feature values
  const getFeat = (k: string) => features.find((f: any) => f.key === k)?.value || ""
  
  // Initial State Setup
  const initialEngine = getFeat("Engine Size").replace(" cc", "")
  const initialMileage = getFeat("Mileage").replace(" km", "")
  const coreKeys = ["Engine Size", "Mileage", "Fuel Type", "Transmission", "Condition"]
  
  // Parse initial custom specs AND try to map them to templates if possible (for dropdowns)
  const initialCustomSpecs = features
    .filter((f: any) => !coreKeys.includes(f.key))
    .map((f: any) => {
        const matchingTemplate = templates.find((t: any) => t.label === f.key)
        return {
            key: f.key,
            value: f.value,
            options: matchingTemplate ? matchingTemplate.options : []
        }
    })

  const [formData, setFormData] = useState({
    brand: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    type: vehicle.bodyType,
    status: vehicle.status,
    condition: getFeat("Condition") || "USED",
    engineSizeCC: initialEngine,
    transmission: getFeat("Transmission") || "AUTOMATIC",
    fuelType: getFeat("Fuel Type") || "PETROL",
    mileage: initialMileage,
    basePrice: costs.find((c: any) => c.description === "Base Purchase Cost")?.amount || "",
    sellingPrice: vehicle.listingPrice,
  })

  const [customSpecs, setCustomSpecs] = useState<any[]>(initialCustomSpecs)
  const [newSpec, setNewSpec] = useState({ key: "", value: "" })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // --- ADD FROM TEMPLATE ---
  const addFromTemplate = (templateId: string) => {
    if (!templateId) return;
    const template = templates.find((t: any) => t.id === templateId);
    if (template) {
        setCustomSpecs([
            ...customSpecs, 
            { 
                key: template.label, 
                value: "", 
                options: template.options 
            }
        ]);
    }
  };

  const updateSpec = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...customSpecs];
    updated[index] = { ...updated[index], [field]: val };
    setCustomSpecs(updated);
  };

  const handleSubmit = () => {
    startTransition(async () => {
       const cleanSpecs = customSpecs.map(({ key, value }) => ({ key, value }));
       const payload = { ...formData, customSpecs: cleanSpecs }
       
       const result = await updateVehicleDetails(vehicle.id, payload)
       if (result.success) {
         alert("Changes Saved Successfully")
       } else {
         alert("Failed to update.")
       }
    })
  }

  // STYLES
  const sectionClass = "bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 mb-8"
  const labelClass = "block text-xs font-extrabold text-black uppercase tracking-widest mb-2 ml-1"

  return (
    <div className="pb-24">
      <form className="space-y-8">
        
        {/* SECTION 1: CORE IDENTITY */}
        <div className={sectionClass}>
           <div className="flex justify-between items-center mb-8 border-b border-gray-200/50 pb-4">
              <h2 className="text-2xl font-extrabold text-black">Vehicle Identity</h2>
              <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200">
                 <label className="text-xs font-bold text-gray-400 uppercase px-2">Status</label>
                 <select 
                   value={formData.status}
                   onChange={(e) => handleChange("status", e.target.value)}
                   className="bg-gray-100 border-none text-sm font-bold rounded-lg px-4 py-2 text-black outline-none focus:ring-2 focus:ring-blue-500"
                 >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>Brand / Make</label>
                <select className="input-field" value={formData.brand} onChange={(e) => handleChange("brand", e.target.value)}>
                  {/* FIX: Use dynamic brandOptions */}
                  {brandOptions.map((b: string) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Model Name</label>
                <input type="text" className="input-field" placeholder="e.g. Land Cruiser Prado" value={formData.model} onChange={(e) => handleChange("model", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Year of Manufacture</label>
                <select className="input-field" value={formData.year} onChange={(e) => handleChange("year", e.target.value)}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Body Type</label>
                <select className="input-field" value={formData.type} onChange={(e) => handleChange("type", e.target.value)}>
                  {/* FIX: Use dynamic typeOptions */}
                  {typeOptions.map((t: string) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
           </div>
        </div>

        {/* SECTION 2: TECHNICAL SPECS */}
        <div className={sectionClass}>
           <h2 className="text-2xl font-extrabold text-black mb-8">Technical Specs</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                 <label className={labelClass}>Engine Size (CC)</label>
                 <input type="number" className="input-field" placeholder="e.g. 2800" value={formData.engineSizeCC} onChange={(e) => handleChange("engineSizeCC", e.target.value)} />
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

           {/* --- UPDATED CUSTOM SPECS SECTION --- */}
           <div className="bg-blue-50/50 p-6 rounded-[1.5rem] border border-blue-100">
              <div className="flex justify-between items-center mb-6 border-b border-blue-200/50 pb-4">
                 <h3 className="text-sm font-extrabold text-blue-600 uppercase tracking-widest">Features</h3>
                 
                 {/* QUICK ADD CUSTOM DROPDOWN */}
                 <div className="relative">
                    <button 
                        type="button"
                        onClick={() => setShowQuickAdd(!showQuickAdd)}
                        className="flex items-center gap-2 bg-white border border-blue-200 text-blue-800 text-xs font-bold rounded-lg px-3 py-2 hover:bg-blue-50 transition-colors shadow-sm"
                    >
                        <span>+ Select Saved Feature</span>
                        <ChevronDown size={14} className={`transition-transform ${showQuickAdd ? 'rotate-180' : ''}`}/>
                    </button>
                    
                    {showQuickAdd && (
                        <>
                            {/* Backdrop */}
                            <div className="fixed inset-0 z-40" onClick={() => setShowQuickAdd(false)} />
                            
                            {/* Menu with Scrollbar */}
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 shadow-xl rounded-xl z-50 max-h-60 overflow-y-auto p-2">
                                {templates
                                    // FIX: Ensure main dropdowns (Brand/Body) don't appear in custom features
                                    .filter((t: any) => !t.label.toLowerCase().includes("brand") && !t.label.toLowerCase().includes("body type"))
                                    .map((t: any) => (
                                    <button 
                                      key={t.id} 
                                      type="button"
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
                                {templates.length === 0 && <div className="p-3 text-xs text-gray-400 text-center">No templates found.</div>}
                            </div>
                        </>
                    )}
                 </div>
              </div>
              
              {/* EDITABLE LIST */}
              <div className="space-y-3 mb-6">
                 {customSpecs.length === 0 && (
                     <div className="text-center py-6">
                        <p className="text-sm text-gray-400 font-medium">No custom features added.</p>
                     </div>
                 )}

                 {customSpecs.map((spec: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-center bg-white p-3 rounded-xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                       <div className="w-1/3">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Name</label>
                            <input 
                                value={spec.key} 
                                onChange={(e) => updateSpec(idx, 'key', e.target.value)}
                                className="w-full bg-transparent font-bold text-black border-none p-0 focus:ring-0 text-sm"
                            />
                       </div>
                       
                       <div className="flex-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Value</label>
                            {spec.options && spec.options.length > 0 ? (
                                <select 
                                    value={spec.value} 
                                    onChange={(e) => updateSpec(idx, 'value', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-medium text-black focus:border-blue-500 outline-none"
                                >
                                    <option value="">- Select -</option>
                                    {spec.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            ) : (
                                <input 
                                    value={spec.value}
                                    onChange={(e) => updateSpec(idx, 'value', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-medium text-black focus:border-blue-500 outline-none"
                                />
                            )}
                       </div>

                       <button type="button" onClick={() => setCustomSpecs(customSpecs.filter((_:any, i:number) => i !== idx))} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                         <Trash2 size={18}/>
                       </button>
                    </div>
                 ))}
              </div>

              {/* MANUAL ADDER */}
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2"><Zap size={12}/> Manual Add</p>
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <input className="input-field text-sm py-2" placeholder="Name" value={newSpec.key} onChange={(e) => setNewSpec({...newSpec, key: e.target.value})} />
                    </div>
                    <div className="flex-1">
                        <input className="input-field text-sm py-2" placeholder="Value" value={newSpec.value} onChange={(e) => setNewSpec({...newSpec, value: e.target.value})} />
                    </div>
                    <button type="button" onClick={() => {
                        if(newSpec.key && newSpec.value) {
                            setCustomSpecs([...customSpecs, { ...newSpec, options: [] }])
                            setNewSpec({ key: "", value: "" })
                        }
                    }} className="bg-black text-white h-[42px] w-[42px] rounded-xl flex items-center justify-center hover:bg-gray-800 transition-colors">
                        <Plus size={20}/>
                    </button>
                </div>
              </div>

           </div>
        </div>

        {/* SECTION 3: FINANCIALS */}
        <div className={sectionClass}>
           <h2 className="text-2xl font-extrabold text-black mb-8">Financials</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="opacity-70 hover:opacity-100 transition-opacity">
                 <label className={labelClass}>Base Cost (Internal)</label>
                 <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-400 font-bold">KES</span>
                    <input type="number" className="input-field pl-14" placeholder="0.00" value={formData.basePrice} onChange={(e) => handleChange("basePrice", e.target.value)} />
                 </div>
              </div>
              <div>
                 <label className={labelClass}>Listing Price (Public)</label>
                 <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-400 font-bold">KES</span>
                    <input type="number" className="input-field pl-14 border-blue-200 focus:border-blue-600" placeholder="0.00" value={formData.sellingPrice} onChange={(e) => handleChange("sellingPrice", e.target.value)} />
                 </div>
              </div>
           </div>
        </div>

      </form>
      
      {/* FLOATING SAVE BAR */}
      <div className="fixed bottom-6 right-6 md:right-12 z-50">
          <button 
            onClick={handleSubmit} 
            disabled={isPending}
            className="btn-primary flex items-center gap-3 shadow-2xl shadow-blue-900/40 text-lg px-8 py-4 rounded-full"
          >
            {isPending ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
            Save Changes
          </button>
      </div>
    </div>
  )
}