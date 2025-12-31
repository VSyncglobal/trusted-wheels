import { MapPin, Phone, Mail, Clock } from "lucide-react"

export const metadata = { title: "Contact | Trust Rides" }

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto py-24">
      <div className="grid md:grid-cols-2 gap-16">
        
        <div className="space-y-12">
           <div>
             <h1 className="text-5xl font-bold tracking-tighter text-strong-black mb-6">Visit Our Yard.</h1>
             <p className="text-lg text-gray-500 leading-relaxed">
               Experience the quality firsthand. Our team is ready to walk you through our inventory 
               and answer any technical questions.
             </p>
           </div>

           <div className="space-y-8">
              <div className="flex gap-4">
                 <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full"><MapPin size={20} /></div>
                 <div>
                    <h3 className="font-bold text-strong-black">Ridgeways, Kiambu Road</h3>
                    <p className="text-sm text-gray-500">Nairobi, Kenya</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full"><Phone size={20} /></div>
                 <div>
                    <h3 className="font-bold text-strong-black">+254 700 000 000</h3>
                    <p className="text-sm text-gray-500">Sales & Inquiries</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full"><Clock size={20} /></div>
                 <div>
                    <h3 className="font-bold text-strong-black">Opening Hours</h3>
                    <p className="text-sm text-gray-500">Mon - Sat: 8:00 AM - 6:00 PM</p>
                    <p className="text-sm text-gray-500">Sun: Closed</p>
                 </div>
              </div>
           </div>
        </div>

        {/* MAP PLACEHOLDER */}
        <div className="bg-gray-200 rounded-xl min-h-[400px] flex items-center justify-center">
           <p className="text-gray-500 font-medium">Google Maps Integration</p>
           {/* You can embed an iframe here later */}
        </div>

      </div>
    </div>
  )
}