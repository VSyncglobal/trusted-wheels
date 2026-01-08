// apps/web/app/contact/page.tsx

import { MapPin, Phone, Clock, Facebook } from "lucide-react"

export const metadata = { title: "Contact | Trust Rides" }

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-24 px-6">
      <div className="max-w-3xl w-full text-center space-y-16">
        
        {/* WELCOME SECTION */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-black">
             We're here to help.
           </h1>
           <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
             Welcome to Trust Rides. Whether you're looking for your next car or just have a quick question, 
             reach out to us! We pride ourselves on quick responses and transparent conversations.
           </p>
        </div>

        {/* CONTACT DETAILS GRID */}
        <div className="grid md:grid-cols-3 gap-8">
           {/* LOCATION */}
           <div className="flex flex-col items-center p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-100 transition-colors">
              <div className="w-12 h-12 bg-white shadow-sm flex items-center justify-center rounded-full mb-4 text-blue-600">
                <MapPin size={24} />
              </div>
              <h3 className="font-bold text-black mb-1">Visit Our Yard</h3>
              <p className="text-sm text-gray-500">Ridgeways, Kiambu Road</p>
              <p className="text-sm text-gray-500">Nairobi, Kenya</p>
           </div>

           {/* PHONE */}
           <div className="flex flex-col items-center p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-100 transition-colors">
              <div className="w-12 h-12 bg-white shadow-sm flex items-center justify-center rounded-full mb-4 text-green-600">
                <Phone size={24} />
              </div>
              <h3 className="font-bold text-black mb-1">Call or WhatsApp</h3>
              <p className="text-sm text-gray-500">+254 705 124 564</p>
              <p className="text-xs text-green-600 font-bold mt-2 bg-green-50 px-2 py-1 rounded-full">Available Now</p>
           </div>

           {/* HOURS */}
           <div className="flex flex-col items-center p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-100 transition-colors">
              <div className="w-12 h-12 bg-white shadow-sm flex items-center justify-center rounded-full mb-4 text-orange-500">
                <Clock size={24} />
              </div>
              <h3 className="font-bold text-black mb-1">Opening Hours</h3>
              <p className="text-sm text-gray-500">Mon - Sat: 8:00 AM - 6:00 PM</p>
              <p className="text-sm text-gray-400">Sunday: Closed</p>
           </div>
        </div>

        {/* FACEBOOK CTA */}
        <div className="pt-8 border-t border-gray-100">
            <p className="text-gray-400 text-sm font-medium mb-6 uppercase tracking-widest">Join our Community</p>
            
            <a 
              href="https://www.facebook.com/profile.php?id=100065310889126" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#1877F2] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#166fe5] hover:scale-105 transition-all shadow-lg shadow-blue-200"
            >
              <Facebook size={24} fill="currentColor" className="text-white" />
              Follow us on Facebook
            </a>
            <p className="text-gray-400 text-xs mt-4">Get daily updates on new stock and special offers.</p>
        </div>

      </div>
    </div>
  )
}