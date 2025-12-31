'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'

interface Spec {
  id: string
  key: string
  value: string
}

export function SpecsBuilder() {
  // Default state with some examples to guide the user
  const [specs, setSpecs] = useState<Spec[]>([
    { id: '1', key: 'Color', value: 'Obsidian Black' },
    { id: '2', key: 'Interior', value: 'Nappa Leather' }
  ])

  const addSpec = () => {
    setSpecs([...specs, { id: crypto.randomUUID(), key: '', value: '' }])
  }

  const removeSpec = (id: string) => {
    setSpecs(specs.filter(s => s.id !== id))
  }

  const updateSpec = (id: string, field: 'key' | 'value', text: string) => {
    setSpecs(specs.map(s => s.id === id ? { ...s, [field]: text } : s))
  }

  return (
    <div className="space-y-4">
      {/* Hidden input to pass data to Server Action */}
      <input type="hidden" name="specsJSON" value={JSON.stringify(specs)} />

      <div className="space-y-2">
        {specs.map((spec) => (
          <div key={spec.id} className="flex gap-4 group items-center">
            <input
              type="text"
              placeholder="Feature (e.g. 0-100km/h)"
              value={spec.key}
              onChange={(e) => updateSpec(spec.id, 'key', e.target.value)}
              className="flex-1 border-b border-gray-200 bg-transparent py-2 text-sm outline-none focus:border-strong-black placeholder:text-gray-300 transition-colors"
            />
            <input
              type="text"
              placeholder="Value (e.g. 3.8s)"
              value={spec.value}
              onChange={(e) => updateSpec(spec.id, 'value', e.target.value)}
              className="flex-1 border-b border-gray-200 bg-transparent py-2 text-sm outline-none focus:border-strong-black placeholder:text-gray-300 transition-colors"
            />
            <button
              type="button"
              onClick={() => removeSpec(spec.id)}
              className="text-gray-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 p-2"
              title="Remove feature"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addSpec}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-strong-black hover:text-gray-600 transition-colors mt-4"
      >
        <Plus size={14} />
        Add Feature
      </button>
    </div>
  )
}