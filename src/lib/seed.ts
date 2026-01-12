import { prisma } from './prisma'

async function main() {
  await prisma.habit.deleteMany({})
  await prisma.user.deleteMany({})

  const user1 = await prisma.user.create({
    data: {
      email: 'jan.kowalski@example.com',
      name: 'Jan Kowalski',
      password: 'hashedpassword1',
    },
  })
  const user2 = await prisma.user.create({
    data: {
      email: 'anna.nowak@example.com',
      name: 'Anna Nowak',
      password: 'hashedpassword2',
    },
  })

  // Dodaj przykładowe nawyki
  await prisma.habit.create({
    data: {
      userId: user1.id,
      name: 'Poranny jogging',
      description: 'Biegać codziennie rano przez 30 minut',
      frequency: 'daily',
      targetCount: 1,
      isActive: true,
    },
  })
  await prisma.habit.create({
    data: {
      userId: user2.id,
      name: 'Czytanie książki',
      description: 'Czytać 20 stron dziennie',
      frequency: 'daily',
      targetCount: 1,
      isActive: true,
    },
  })

  console.log('Seed zakończony sukcesem!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
