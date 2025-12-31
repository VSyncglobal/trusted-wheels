import { prisma } from "@repo/database"
import { Plus, Trash, SlidersHorizontal, Layers, List } from "lucide-react"
import { revalidatePath } from "next/cache"

// --- SERVER ACTIONS ---
async function addTemplate(formData: FormData) {
  'use server'
  const label = formData.get("label") as string
  const rawOptions = formData.get("options") as string
  
  // Clean up options: split by comma, trim whitespace, remove empty strings
  const options = rawOptions.split(",").map(s => s.trim()).filter(s => s.length > 0)
  
  await prisma.featureTemplate.create({
    data: {
      label,
      type: "DROPDOWN",
      options,
      isMandatory: false
    }
  })
  revalidatePath("/features")
}

async function deleteTemplate(id: string) {
  'use server'
  await prisma.featureTemplate.delete({ where: { id } })
  revalidatePath("/features")
}

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
          <p className="text-gray-500 font-medium">Define Brands, Body Types, and Vehicle Options here.</p>
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
                   placeholder="e.g. Brand, Body Type, Fuel" 
                   className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors font-bold text-sm" 
                 />
                 <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                    Use specific names like "Brand" or "Body Type" to populate system filters.
                 </p>
               </div>
               
               <div>
                 <label className="block text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2">Options List</label>
                 <textarea 
                   name="options" 
                   required 
                   placeholder="Toyota, BMW, Mercedes, Audi..." 
                   className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors h-32 text-sm font-medium leading-relaxed" 
                 />
                 <p className="text-[10px] text-gray-500 mt-2">Separate each option with a comma.</p>
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
               <p className="text-sm text-gray-400">Add "Brand" and "Body Type" to get started.</p>
             </div>
           )}
           
           <div className="grid md:grid-cols-2 gap-6">
             {templates.map((t) => (
               <div key={t.id} className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all group">
                 <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                       <List size={16} />
                     </div>
                     <h4 className="font-extrabold text-black text-lg">{t.label}</h4>
                   </div>
                   <form action={deleteTemplate.bind(null, t.id)}>
                     <button className="text-gray-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100">
                       <Trash size={16} />
                     </button>
                   </form>
                 </div>
                 
                 <div className="flex flex-wrap gap-2">
                   {t.options.map((opt, i) => (
                     <span key={i} className="text-xs font-bold bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg shadow-sm">
                       {opt}
                     </span>
                   ))}
                 </div>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  )
}