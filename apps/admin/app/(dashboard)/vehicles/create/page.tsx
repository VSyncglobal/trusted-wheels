'use client'

import { useState, useEffect } from "react"
import { createVehicleAction, getFeatureTemplates } from "./actions"
import { Plus, Trash2, CheckCircle2, ChevronDown, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

// Default options (fallback)
const DEFAULT_BRANDS = ["Toyota", "Mercedes-Benz", "BMW", "Audi", "Land Rover", "Nissan", "Honda", "Mazda", "Volkswagen", "Porsche"]
const DEFAULT_TYPES = ["SUV", "Sedan", "Pickup Truck", "Crossover", "Hatchback", "Coupe", "Convertible", "Van"]
const FUEL_TYPES = ["PETROL", "DIESEL", "HYBRID", "ELECTRIC"]
const TRANSMISSIONS = ["AUTOMATIC", "MANUAL", "CVT"]
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)

export default function CreateVehiclePage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  
  // --- DYNAMIC DATA STATE ---
  const [templates, setTemplates] = useState<any[]>([])
  const [brandOptions, setBrandOptions] = useState<string[]>(DEFAULT_BRANDS)
  const [typeOptions, setTypeOptions] = useState<string[]>(DEFAULT_TYPES)

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    type: "",
    condition: "Foreign Used",
    sellingPrice: "",
    basePrice: "", // Internal Cost
    // Specs
    engineSizeCC: "",
    mileage: "",
    fuelType: "PETROL",
    transmission: "AUTOMATIC"
  })

  // Custom Specs (Key-Value pairs)
  const [customSpecs, setCustomSpecs] = useState<{ key: string, value: string, options?: string[] }[]>([])
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [newSpec, setNewSpec] = useState({ key: "", value: "" })

  // --- LOAD TEMPLATES ---
  useEffect(() => {
    getFeatureTemplates().then((data) => {
       setTemplates(data);

       // FIX: Explicitly type 't' as any
       const brands = data.find((t: any) => t.label.toLowerCase().includes("brand"));
       if (brands) setBrandOptions(brands.options);

       // FIX: Explicitly type 't' as any
       const types = data.find((t: any) => t.label.toLowerCase().includes("body") || t.label.toLowerCase().includes("type"));
       if (types) setTypeOptions(types.options);
    });
  }, [])

  // --- HANDLERS ---
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addFromTemplate = (templateId: string) => {
    const template = templates.find((t: any) => t.id === templateId); // FIX: Explicitly type 't'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    
    const payload = { ...formData, customSpecs }
    const result = await createVehicleAction(payload)

    if (result.success) {
      router.push(`/vehicles/${result.vehicleId}`) // Redirect to edit page to add images
    } else {
      alert("Error: " + result.error)
      setIsPending(false)
    }
  }

  // --- RENDER HELPERS ---
  const labelClass = "block text-xs font-extrabold text-black uppercase tracking-widest mb-2 ml-1"

  return (
    <div className="max-w-5xl mx-auto pb-32">
       
       {/* HEADER */}
       <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-black">Add New Vehicle</h1>
          <p className="text-gray-500 font-medium">Step 1: Vehicle Identity & Specs</p>
       </div>

       <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: CORE IDENTITY */}
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
             <h2 className="text-xl font-extrabold text-black mb-6 border-b border-gray-200 pb-2">Core Identity</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div>
                   <label className={labelClass}>Brand / Make</label>
                   {/* If we have template options, use Select, else Input */}
                   <select 
                     className="input-field" 
                     value={formData.brand} 
                     onChange={(e) => handleChange("brand", e.target.value)}
                     required
                   >
                     <option value="">- Select Brand -</option>
                     {brandOptions.map(b => <option key={b} value={b}>{b}</option>)}
                   </select>
                </div>

                <div>
                   <label className={labelClass}>Model</label>
                   <input 
                     required
                     className="input-field" 
                     placeholder="e.g. Land Cruiser Prado" 
                     value={formData.model} 
                     onChange={(e) => handleChange("model", e.target.value)} 
                   />
                </div>

                <div>
                   <label className={labelClass}>Year</label>
                   <select className="input-field" value={formData.year} onChange={(e) => handleChange("year", parseInt(e.target.value))}>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                   </select>
                </div>

                <div>
                   <label className={labelClass}>Body Type</label>
                   <select className="input-field" value={formData.type} onChange={(e) => handleChange("type", e.target.value)} required>
                      <option value="">- Select Type -</option>
                      {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
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

          {/* SECTION 2: SPECS */}
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
             <h2 className="text-xl font-extrabold text-black mb-6 border-b border-gray-200 pb-2">Technical Specs</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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

             {/* CUSTOM SPECS */}
             <div className="bg-blue-50/50 p-6 rounded-[1.5rem] border border-blue-100">
                <div className="flex justify-between items-center mb-6 border-b border-blue-200/50 pb-4">
                    <h3 className="text-sm font-extrabold text-blue-600 uppercase tracking-widest">Additional Features</h3>
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
                                <div className="fixed inset-0 z-40" onClick={() => setShowQuickAdd(false)} />
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 shadow-xl rounded-xl z-50 max-h-60 overflow-y-auto p-2">
                                    {templates
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

                <div className="space-y-3 mb-6">
                    {customSpecs.length === 0 && (
                        <div className="text-center py-6">
                            <p className="text-sm text-gray-400 font-medium">No custom features added.</p>
                        </div>
                    )}

                    {customSpecs.map((spec, idx) => (
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

                        <button type="button" onClick={() => setCustomSpecs(customSpecs.filter((_, i) => i !== idx))} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                            <Trash2 size={18}/>
                        </button>
                        </div>
                    ))}
                </div>

                {/* MANUAL ADDER */}
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">Manual Add</p>
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
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
             <h2 className="text-xl font-extrabold text-black mb-6 border-b border-gray-200 pb-2">Financials</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="opacity-70 hover:opacity-100 transition-opacity">
                   <label className={labelClass}>Base Cost (Internal)</label>
                   <div className="relative">
                      <span className="absolute left-4 top-3.5 text-gray-400 font-bold">KES</span>
                      <input type="number" className="input-field pl-14" placeholder="0.00" value={formData.basePrice} onChange={(e) => handleChange("basePrice", e.target.value)} />
                   </div>
                   <p className="text-[10px] text-gray-400 mt-2 ml-1">For profit calculation only. Not public.</p>
                </div>
                <div>
                   <label className={labelClass}>Listing Price (Public)</label>
                   <div className="relative">
                      <span className="absolute left-4 top-3.5 text-gray-400 font-bold">KES</span>
                      <input type="number" className="input-field pl-14 border-blue-200 focus:border-blue-600" placeholder="0.00" value={formData.sellingPrice} onChange={(e) => handleChange("sellingPrice", e.target.value)} required />
                   </div>
                </div>
             </div>
          </div>

          {/* SUBMIT */}
          <div className="fixed bottom-6 right-6 md:right-12 z-50">
              <button 
                type="submit" 
                disabled={isPending}
                className="btn-primary flex items-center gap-3 shadow-2xl shadow-blue-900/40 text-lg px-8 py-4 rounded-full"
              >
                {isPending ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
                Create & Continue
              </button>
          </div>

       </form>
    </div>
  )
}