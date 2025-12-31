'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@repo/database'

interface VehicleState {
  message: string | null
  errors?: {
    stockNumber?: string[]
    vin?: string[]
    _form?: string[]
  }
}

export async function createVehicle(prevState: VehicleState, formData: FormData) {
  // 1. Extract Basic Data
  const rawData = {
    stockNumber: formData.get('stockNumber') as string,
    vin: formData.get('vin') as string,
    make: formData.get('make') as string,
    model: formData.get('model') as string,
    year: parseInt(formData.get('year') as string),
    trim: formData.get('trim') as string,
    bodyType: formData.get('bodyType') as string,
    listingPrice: parseFloat(formData.get('listingPrice') as string),
  }

  // 2. Extract & Parse Specs
  const specsJSON = formData.get('specsJSON') as string
  let features = []
  try {
    if (specsJSON) {
      const parsed = JSON.parse(specsJSON)
      // Filter out empty rows to keep data clean
      features = parsed.filter((s: any) => s.key && s.key.trim() !== '' && s.value && s.value.trim() !== '')
    }
  } catch (e) {
    console.error("Failed to parse specs", e)
  }

  // 3. Validation
  if (!rawData.stockNumber || !rawData.make || !rawData.model) {
    return { message: 'Missing required fields', errors: { _form: ['Please fill in all required fields'] } }
  }

  try {
    // 4. Database Mutation (Transactional)
    await prisma.vehicle.create({
      data: {
        ...rawData,
        status: 'DRAFT',
        // Create the relations in the same transaction
        features: {
          create: features.map((f: any) => ({
            key: f.key,
            value: f.value
          }))
        }
      },
    })

    revalidatePath('/vehicles')
    return { message: 'Success! Vehicle created with specs.' }
    
  } catch (e: any) {
    if (e.code === 'P2002') {
      const field = e.meta?.target[0]
      return {
        message: 'Database Error',
        errors: {
          [field]: [`This ${field} already exists.`]
        }
      }
    }
    return { message: 'Failed to create vehicle', errors: { _form: [e.message] } }
  }
}