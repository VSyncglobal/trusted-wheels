"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Plus, Trash2, AlertCircle } from "lucide-react";
import { clsx } from "clsx";

// --- CONSTANTS ---
const BRANDS = ["Toyota", "Mercedes-Benz", "BMW", "Audi", "Land Rover", "Nissan", "Honda", "Mazda"];
const TYPES = ["SUV", "Sedan", "Pickup Truck", "Crossover", "Hatchback", "Coupe"];
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
const FUEL_TYPES = ["PETROL", "DIESEL", "HYBRID", "ELECTRIC"];
const TRANSMISSIONS = ["AUTOMATIC", "MANUAL", "CVT"];
const CONDITIONS = ["USED", "NEW"];

// --- TYPES ---
interface CustomSpec {
  key: string;
  value: string;
}

export default function CreateVehiclePage() {
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
    isAccidentFree: true,
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

  const isStep1Valid = formData.brand && formData.model && formData.year && formData.type;
  const isStep2Valid = formData.engineSizeCC && formData.mileage;

  return (
    <div className="max-w-4xl mx-auto pt-6 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-strong-black">Add New Vehicle</h1>
        <p className="text-grey-500 mt-1">Step {step} of 3</p>
        <div className="w-full h-1 bg-grey-200 mt-4 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-strong-black"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid gap-8">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 bg-off-white p-8 rounded-xl border border-grey-200">
             <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-grey-500 uppercase tracking-wider">Brand</label>
                <select className="w-full p-3 rounded-lg border border-grey-300 bg-white" value={formData.brand} onChange={(e) => handleChange("brand", e.target.value)}>
                  <option value="">Select Brand</option>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-grey-500 uppercase tracking-wider">Model</label>
                <input type="text" className="w-full p-3 rounded-lg border border-grey-300 bg-white" placeholder="Model" value={formData.model} onChange={(e) => handleChange("model", e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-grey-500 uppercase tracking-wider">Year</label>
                <select className="w-full p-3 rounded-lg border border-grey-300 bg-white" value={formData.year} onChange={(e) => handleChange("year", e.target.value)}>
                  <option value="">Select Year</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-grey-500 uppercase tracking-wider">Body Type</label>
                <select className="w-full p-3 rounded-lg border border-grey-300 bg-white" value={formData.type} onChange={(e) => handleChange("type", e.target.value)}>
                  <option value="">Select Type</option>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="bg-off-white p-8 rounded-xl border border-grey-200 space-y-6">
              <h3 className="text-lg font-bold text-strong-black flex items-center gap-2">Core Specifications</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-grey-500 uppercase tracking-wider">Engine Size (CC)</label>
                   <input type="number" className="w-full p-3 rounded-lg border border-grey-300 bg-white" value={formData.engineSizeCC} onChange={(e) => handleChange("engineSizeCC", e.target.value)} />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-grey-500 uppercase tracking-wider">Mileage (Km)</label>
                   <input type="number" className="w-full p-3 rounded-lg border border-grey-300 bg-white" value={formData.mileage} onChange={(e) => handleChange("mileage", e.target.value)} />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-grey-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-strong-black">Custom Features</h3>
              </div>
              <div className="flex gap-4 items-end bg-off-white p-4 rounded-lg">
                <input type="text" className="flex-1 p-3 rounded-lg border border-grey-300" placeholder="Feature Name" value={newSpec.key} onChange={(e) => setNewSpec({...newSpec, key: e.target.value})} />
                <input type="text" className="flex-1 p-3 rounded-lg border border-grey-300" placeholder="Value" value={newSpec.value} onChange={(e) => setNewSpec({...newSpec, value: e.target.value})} />
                <button onClick={addCustomSpec} className="p-3 bg-black text-white rounded-lg"><Plus size={20} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {customSpecs.map((spec, idx) => (
                  <div key={idx} className="flex justify-between p-3 border rounded-lg">
                    <span>{spec.key}: {spec.value}</span>
                    <button onClick={() => removeCustomSpec(idx)}><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="fixed bottom-0 left-64 right-0 p-6 bg-white border-t border-grey-200 flex justify-between z-40">
        <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="flex items-center gap-2 text-grey-500 hover:text-black disabled:opacity-30"><ChevronLeft /> Back</button>
        <button onClick={() => setStep(Math.min(3, step + 1))} disabled={(step === 1 && !isStep1Valid)} className="flex items-center gap-2 px-8 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">Continue <ChevronRight /></button>
      </div>
    </div>
  );
}
