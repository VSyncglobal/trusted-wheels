'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { Trash2, UploadCloud, Loader2, Save, RotateCcw, XCircle } from "lucide-react"
import { getPresignedUploadUrl, updateVehicleGallery } from "../(dashboard)/vehicles/[id]/actions"

interface VehicleImage {
  id: string
  url: string
}

export function ImageManager({ vehicleId, initialImages }: { vehicleId: string, initialImages: VehicleImage[] }) {
  // --- STATE ---
  // 1. Existing images (from DB)
  const [currentImages, setCurrentImages] = useState<VehicleImage[]>(initialImages)
  // 2. Images marked for deletion
  const [deletedIds, setDeletedIds] = useState<string[]>([])
  // 3. New files selected (Local Preview)
  const [newFiles, setNewFiles] = useState<File[]>([])
  
  const [isSaving, setIsSaving] = useState(false)

  // --- ACTIONS ---

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeExisting = (id: string) => {
    setDeletedIds((prev) => [...prev, id])
  }

  const removeNew = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDiscard = () => {
    if (confirm("Discard all changes?")) {
      setNewFiles([])
      setDeletedIds([])
      // Reset view to initial
      setCurrentImages(initialImages) 
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const uploadedImages = []

      // 1. Upload NEW files to S3
      for (const file of newFiles) {
        // Get URL
        const { signedUrl, publicUrl, key } = await getPresignedUploadUrl(file.name, file.type)
        
        // Upload
        await fetch(signedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type }
        })
        
        uploadedImages.push({ url: publicUrl, key })
      }

      // 2. Sync with DB (Create New + Delete Old)
      const result = await updateVehicleGallery(vehicleId, uploadedImages, deletedIds)

      if (result.success) {
        // Clear staging state
        setNewFiles([])
        setDeletedIds([])
        // In a real app, we'd rely on revalidatePath to refresh 'initialImages',
        // but for immediate UI feedback we can reload or wait for the server prop to update.
        window.location.reload() 
      } else {
        alert("Failed to save gallery.")
      }

    } catch (error) {
      console.error(error)
      alert("An error occurred during save.")
    } finally {
      setIsSaving(false)
    }
  }

  // --- DERIVED STATE FOR UI ---
  // Filter out images marked for deletion
  const visibleExisting = currentImages.filter(img => !deletedIds.includes(img.id))
  const hasChanges = newFiles.length > 0 || deletedIds.length > 0

  return (
    <div className="space-y-6">
      
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
        <div>
           <h3 className="text-lg font-bold text-gray-900">Vehicle Gallery</h3>
           <p className="text-xs text-gray-500">
             {visibleExisting.length + newFiles.length} photos • {newFiles.length} new • {deletedIds.length} removed
           </p>
        </div>
        
        <div className="flex items-center gap-2">
           {hasChanges && (
             <>
               <button 
                 onClick={handleDiscard}
                 disabled={isSaving}
                 className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"
               >
                 <RotateCcw size={16} /> Discard
               </button>
               <button 
                 onClick={handleSave}
                 disabled={isSaving}
                 className="px-6 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 shadow-sm transition-all"
               >
                 {isSaving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />}
                 Confirm & Publish
               </button>
             </>
           )}
           
           <label className={`
             flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800 transition-colors
             ${isSaving ? 'opacity-50 pointer-events-none' : ''}
           `}>
             <UploadCloud size={18} />
             <span className="text-sm font-medium">Add Photos</span>
             <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} />
           </label>
        </div>
      </div>

      {/* GALLERY GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        
        {/* 1. Existing Images */}
        {visibleExisting.map((img) => (
          <div key={img.id} className="group relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            <Image 
              src={img.url} 
              alt="Vehicle" 
              fill 
              className="object-cover"
            />
            <div className="absolute top-2 right-2">
               <button 
                  onClick={() => removeExisting(img.id)}
                  className="p-1.5 bg-white text-gray-500 hover:text-red-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
               >
                 <Trash2 size={14} />
               </button>
            </div>
          </div>
        ))}

        {/* 2. New Staged Images (Green Border) */}
        {newFiles.map((file, idx) => (
          <div key={idx} className="relative aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden border-2 border-green-500 shadow-sm">
            {/* Local Preview */}
            <img 
              src={URL.createObjectURL(file)} 
              alt="Preview" 
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                NEW
              </span>
            </div>
            <div className="absolute top-2 right-2">
               <button 
                  onClick={() => removeNew(idx)}
                  className="p-1.5 bg-white text-gray-500 hover:text-red-600 rounded-full shadow-sm transition-all transform hover:scale-110"
               >
                 <XCircle size={16} />
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {visibleExisting.length === 0 && newFiles.length === 0 && (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center bg-gray-50/50">
          <p className="text-gray-400 text-sm">Gallery is empty. Add photos to start.</p>
        </div>
      )}
    </div>
  )
}