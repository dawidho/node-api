import { prisma } from '../../lib/prisma'
import { execSync } from 'child_process'

export default async function setup() {
  console.log('🗄️  Setting up test database...')

  try {
    await prisma.charge.deleteMany({})
    await prisma.habit.deleteMany({})
    await prisma.user.deleteMany({})

    console.log('🚀 Resetting and migrating schema using Prisma...')
    execSync('npx prisma migrate reset --force --skip-seed --schema=prisma/schema.prisma', {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
    })

    try {
      console.log('🌱 Seeding test database...')
      execSync('tsx src/lib/seed.ts', {
        stdio: 'inherit',
        cwd: process.cwd(),
        env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
      })
      console.log('✅ Seeding complete')
    } catch (seedError) {
      console.error('❌ Seeding failed:', seedError)
      throw seedError
    }

    console.log('✅ Test database setup complete')
  } catch (error) {
    console.error('❌ Failed to setup test database:', error)
    throw error
  }

  return async () => {
    console.log('🧹 Tearing down test database...')

    try {
      // Final cleanup - delete all test data
      await prisma.charge.deleteMany({})
      await prisma.habit.deleteMany({})
      await prisma.user.deleteMany({})

      console.log('✅ Test database teardown complete')
      process.exit(0)
    } catch (error) {
      console.error('❌ Failed to teardown test database:', error)
    }
  }
}
