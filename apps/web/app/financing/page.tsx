import { Banknote, Building2, Car, CheckCircle2, Wallet } from "lucide-react";
import Link from "next/link";

export default function FinancingPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      
      {/* HEADER */}
      <div className="max-w-[1400px] mx-auto px-6 mb-16 text-center">
        <h1 className="text-5xl font-extrabold text-black tracking-tight mb-6">Drive Your Dream Today.</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
           We believe owning a car should be exciting, not stressful. That's why we offer multiple flexible payment paths tailored to your financial comfort.
        </p>
      </div>

      {/* PAYMENT METHODS GRID */}
      <div className="max-w-[1400px] mx-auto px-6 grid md:grid-cols-3 gap-8 mb-20">
         
         {/* 1. BANK FINANCE */}
         <div className="bg-blue-600 text-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-600/20 relative overflow-hidden group hover:scale-[1.02] transition-all">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Building2 size={120}/></div>
            <div className="relative z-10">
               <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6"><Building2 size={28}/></div>
               <h3 className="text-2xl font-bold mb-4">Bank Financing</h3>
               <p className="text-blue-100 mb-8 leading-relaxed">
                 We partner with major banks (NCBA, Stanbic, Coop) to offer up to <strong>80% financing</strong>. Pay in manageable monthly installments over 60 months.
               </p>
               <ul className="space-y-3 mb-8 text-sm font-medium">
                 <li className="flex items-center gap-2"><CheckCircle2 size={16}/> Competitive Interest Rates</li>
                 <li className="flex items-center gap-2"><CheckCircle2 size={16}/> Fast Approval Process</li>
                 <li className="flex items-center gap-2"><CheckCircle2 size={16}/> Logbook retained by Bank</li>
               </ul>
            </div>
         </div>

         {/* 2. CASH / MPESA */}
         <div className="bg-gray-50 text-black p-8 rounded-[2.5rem] border border-gray-100 group hover:border-black transition-all">
            <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><Wallet size={28}/></div>
            <h3 className="text-2xl font-bold mb-4">Cash</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              The fastest way to get behind the wheel. We accept direct bank transfers, RTGS, and BANK Direct payments for a seamless, paperless transaction.
            </p>
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
               <span className="block text-xs font-extrabold uppercase text-gray-400 tracking-widest mb-1">Benefit</span>
               <span className="font-bold text-lg">Instant Transfer of Ownership</span>
            </div>
         </div>

         {/* 3. TRADE IN */}
         <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200 group hover:scale-[1.02] transition-all">
            <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-6"><Car size={28}/></div>
            <h3 className="text-2xl font-bold mb-4">Trade-In</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
               Upgrade your ride without the hassle of selling your old one. We accept your current vehicle as part of the payment (Top-up).
            </p>
            <Link href="/contact" className="block w-full py-4 rounded-xl bg-white text-black font-bold text-center hover:bg-gray-200 transition-colors">
               Get Valuation
            </Link>
         </div>

      </div>

      {/* CALL TO ACTION */}
      <div className="text-center">
         <p className="text-gray-500 font-bold mb-4">Not sure which option is best for you?</p>
         <Link href="/contact" className="inline-flex items-center gap-2 text-blue-600 font-extrabold text-lg hover:underline">
            Talk to our Finance Expert <Banknote size={20}/>
         </Link>
      </div>

    </div>
  )
}