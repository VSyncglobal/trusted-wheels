import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Kenyan Market Data...')

  // 1. POPULAR BRANDS IN KENYA
  // Includes Isuzu (D-Max), Subaru (Forester/Outback), and common imports.
  await prisma.featureTemplate.create({
    data: {
      label: "BRAND",
      type: "DROPDOWN",
      options: [
        "Toyota", "Nissan", "Subaru", "Mazda", "Honda", "Mitsubishi", 
        "Volkswagen", "Mercedes-Benz", "BMW", "Audi", "Land Rover", 
        "Isuzu", "Suzuki", "Ford", "Lexus", "Jeep", "Porsche", "Volvo"
      ]
    }
  })

  // 2. BODY TYPES
  // Includes "Station Wagon" (Fielder/Probox) and "Double Cab" which are distinct here.
  await prisma.featureTemplate.create({
    data: {
      label: "Body Type",
      type: "DROPDOWN",
      options: [
        "SUV", "Sedan (Saloon)", "Station Wagon", "Hatchback", 
        "Crossover", "Pickup / Double Cab", "Van / Minivan", 
        "Coupe", "Convertible"
      ]
    }
  })

  // 3. VEHICLE CONDITION
  // Critical for the Kenyan market context.
  await prisma.featureTemplate.create({
    data: {
      label: "Local Condition",
      type: "DROPDOWN",
      options: [
        "Foreign Used (Ex-Japan)", 
        "Foreign Used (Ex-UK)", 
        "Locally Used", 
        "Brand New (Showroom)"
      ]
    }
  })

  // 4. TRANSMISSION
  await prisma.featureTemplate.create({
    data: {
      label: "Transmission",
      type: "DROPDOWN",
      options: ["Automatic", "Manual", "CVT", "Tiptronic"]
    }
  })

  // 5. FUEL TYPE
  await prisma.featureTemplate.create({
    data: {
      label: "Fuel Type",
      type: "DROPDOWN",
      options: ["Petrol", "Diesel", "Hybrid", "Electric"]
    }
  })

  // 6. COMMON PREMIUM FEATURES
  // These are often key selling points in Nairobi.
  const features = [
    { label: "Interior", options: ["Leather Seats", "Fabric Seats", "Power Seats", "Heated Seats", "Third Row Seating"] },
    { label: "Tech & Audio", options: ["Reverse Camera", "Android Auto/CarPlay", "Bluetooth", "Touch Screen", "Steering Controls"] },
    { label: "Exterior", options: ["Sunroof", "Panoramic Roof", "Alloy Rims", "Fog Lights", "Roof Rails", "Side Steps", "Spoiler"] },
    { label: "Security & Safety", options: ["Push to Start", "Keyless Entry", "Anti-Theft Alarm", "Spare Key", "Dashcam"] },
    { label: "Drive Train", options: ["4WD / AWD", "2WD", "Turbo Charged", "Diff Lock"] }
  ]

  for (const f of features) {
    await prisma.featureTemplate.create({
      data: {
        label: f.label,
        type: "DROPDOWN",
        options: f.options
      }
    })
  }

  console.log('✅ Seeding Complete: Kenyan market attributes added.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })