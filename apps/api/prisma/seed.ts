import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash the default password
  const passwordHash = await argon2.hash('Passw0rd!');

  // Create users with different roles
  const users = [
    {
      name: 'CEO User',
      email: 'ceo@demo.local',
      passwordHash,
      role: 'CEO',
    },
    {
      name: 'Manager User',
      email: 'manager@demo.local',
      passwordHash,
      role: 'MANAGER',
    },
    {
      name: 'Member User',
      email: 'member@demo.local',
      passwordHash,
      role: 'MEMBER',
    },
    {
      name: 'Client User',
      email: 'client@demo.local',
      passwordHash,
      role: 'CLIENT',
    },
  ];

  console.log('👥 Creating users...');
  
  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
    console.log(`✅ Created user: ${user.email} (${user.role})`);
  }

  console.log('🎉 Database seeding completed!');
  console.log('\n📋 Test Users:');
  console.log('CEO: ceo@demo.local / Passw0rd!');
  console.log('Manager: manager@demo.local / Passw0rd!');
  console.log('Member: member@demo.local / Passw0rd!');
  console.log('Client: client@demo.local / Passw0rd!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });