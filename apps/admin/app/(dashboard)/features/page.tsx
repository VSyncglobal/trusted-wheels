import { prisma } from "@repo/database"
import { Plus, SlidersHorizontal, Layers } from "lucide-react"
import { addTemplate } from "./actions"
import { FeatureCard } from "./feature-card" 

// --- PAGE COMPONENT ---
export default async function FeaturesPage() {
  const templates = await prisma.featureTemplate.findMany({
    orderBy: { label: 'asc' }
  })

  return (
    <div className="space-y-8 pb-20">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
        <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
           <SlidersHorizontal size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">System Configuration</h1>
          <p className="text-gray-500 font-medium">Manage Brands, Body Types, and Sub-Features.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* CREATE FORM (Left Column) */}
        <div className="lg:col-span-1">
          <div className="bg-black text-white p-8 rounded-[2rem] shadow-2xl shadow-gray-200/50 sticky top-8">
             <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
               <Layers size={20} className="text-blue-400"/>
               <h3 className="font-bold text-lg">Add New Category</h3>
             </div>
             
             <form action={addTemplate} className="space-y-6">
               <div>
                 <label className="block text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2">Category Name</label>
                 <input 
                   name="label" 
                   required 
                   placeholder="e.g. Brand, Body Type, Interior" 
                   className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors font-bold text-sm" 
                 />
               </div>
               
               <div>
                 <label className="block text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2">Initial Options</label>
                 <textarea 
                   name="options" 
                   required 
                   placeholder="Option 1, Option 2, Option 3..." 
                   className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors h-32 text-sm font-medium leading-relaxed" 
                 />
                 <p className="text-[10px] text-gray-500 mt-2">Separate by comma. You can add more later.</p>
               </div>

               <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold text-sm hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                 <Plus size={18} /> Create Configuration
               </button>
             </form>
          </div>
        </div>

        {/* LIST (Right Columns) */}
        <div className="lg:col-span-2 space-y-6">
           {templates.length === 0 && (
             <div className="p-12 text-center bg-white/50 border border-dashed border-gray-200 rounded-[2rem]">
               <p className="text-gray-400 font-bold">No configurations defined yet.</p>
             </div>
           )}
           
           <div className="grid md:grid-cols-2 gap-6">
             {/* FIX: Explicitly type 't' as any to satisfy build strictness */}
             {templates.map((t: any) => (
                <FeatureCard key={t.id} template={t} />
             ))}
           </div>
        </div>

      </div>
    </div>
  )
}