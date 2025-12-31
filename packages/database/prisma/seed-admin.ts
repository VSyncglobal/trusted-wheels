import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1. Create SUPER ADMIN (The Owner)
  const superEmail = 'boniface@trustrides.co.ke'
  const superPass = await bcrypt.hash('boniface25#', 10)
  
  await prisma.user.upsert({
    where: { email: superEmail },
    update: { password: superPass, role: Role.SUPER_ADMIN },
    create: { email: superEmail, password: superPass, role: Role.SUPER_ADMIN },
  })
  console.log(`✅ Super Admin: ${superEmail} / owner123`)

  // 2. Create CONTENT ADMIN (The Manager/Editor)
  const contentEmail = 'editor@trustedwheels.com'
  const contentPass = await bcrypt.hash('editor25#$', 10)

  await prisma.user.upsert({
    where: { email: contentEmail },
    update: { password: contentPass, role: Role.CONTENT_ADMIN },
    create: { email: contentEmail, password: contentPass, role: Role.CONTENT_ADMIN },
  })
  console.log(`✅ Content Admin: ${contentEmail} / editor123`)
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })