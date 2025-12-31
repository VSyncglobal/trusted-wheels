import { CheckCircle2 } from "lucide-react"

export const metadata = { title: "Financing | Trust Rides" }

export default function FinancingPage() {
  return (
    <div className="max-w-4xl mx-auto py-24 space-y-16">
      <div className="space-y-6">
         <h1 className="text-5xl font-bold tracking-tighter text-strong-black">Flexible Payment Plans.</h1>
         <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
           We partner with Kenya's leading financial institutions to offer you competitive rates. 
           Whether you are employed or in business, we have a solution for you.
         </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="p-8 bg-gray-50 border border-gray-100 rounded-xl">
           <h3 className="text-xl font-bold text-strong-black mb-6">Requirements</h3>
           <ul className="space-y-4">
             {["6 Months Certified Bank Statements", "Copy of ID & KRA PIN", "Employment Contract / Business Registration", "20% Minimum Deposit"].map(item => (
               <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                 <CheckCircle2 size={16} className="text-green-600 shrink-0" /> {item}
               </li>
             ))}
           </ul>
        </div>

        <div className="p-8 bg-black text-white rounded-xl">
           <h3 className="text-xl font-bold mb-4">Calculate Your Ability</h3>
           <p className="text-gray-400 text-sm mb-8">
             Use our calculator on any vehicle page to see estimated monthly repayments based on your deposit.
           </p>
           <a href="/inventory" className="block w-full py-4 bg-white text-black text-center text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
             View Inventory
           </a>
        </div>
      </div>
    </div>
  )
}