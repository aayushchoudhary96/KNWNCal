import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash the default password
  const passwordHash = await argon2.hash('Passw0rd!');

  // Create clients first
  console.log('🏢 Creating clients...');
  const clients = [
    { name: 'Acme Corporation' },
    { name: 'Globex Industries' },
    { name: 'Initech Solutions' },
  ];

  const createdClients = [];
  for (const clientData of clients) {
    const client = await prisma.client.upsert({
      where: { name: clientData.name },
      update: {},
      create: clientData,
    });
    createdClients.push(client);
    console.log(`✅ Created client: ${client.name}`);
  }

  // Create projects
  console.log('📋 Creating projects...');
  const projects = [
    { clientId: createdClients[0].id, name: 'Website Redesign' },
    { clientId: createdClients[0].id, name: 'Brand Identity' },
    { clientId: createdClients[1].id, name: 'Mobile App Development' },
    { clientId: createdClients[2].id, name: 'Cloud Migration' },
  ];

  for (const projectData of projects) {
    const project = await prisma.project.upsert({
      where: { 
        clientId_name: {
          clientId: projectData.clientId,
          name: projectData.name
        }
      },
      update: {},
      create: projectData,
    });
    console.log(`✅ Created project: ${project.name} for client ${createdClients.find(c => c.id === project.clientId)?.name}`);
  }

  // Create users with different roles
  console.log('👥 Creating users...');
  const users = [
    {
      name: 'CEO User',
      email: 'ceo@demo.local',
      passwordHash,
      role: 'CEO',
      clientId: null, // CEO has access to all clients
    },
    {
      name: 'Manager User',
      email: 'manager@demo.local',
      passwordHash,
      role: 'MANAGER',
      clientId: null, // Manager has access to all clients
    },
    {
      name: 'Member User',
      email: 'member@demo.local',
      passwordHash,
      role: 'MEMBER',
      clientId: null, // Member has access to all clients
    },
    {
      name: 'Client User',
      email: 'client@demo.local',
      passwordHash,
      role: 'CLIENT',
      clientId: createdClients[0].id, // Client user is linked to Acme Corporation
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        // Update all fields including clientId
        name: userData.name,
        passwordHash: userData.passwordHash,
        role: userData.role,
        clientId: userData.clientId,
      },
      create: userData,
    });
    console.log(`✅ Created user: ${user.email} (${user.role})${user.clientId ? ` - linked to client` : ''}`);
  }

  console.log('🎉 Database seeding completed!');
  console.log('\n📋 Test Users:');
  console.log('CEO: ceo@demo.local / Passw0rd!');
  console.log('Manager: manager@demo.local / Passw0rd!');
  console.log('Member: member@demo.local / Passw0rd!');
  console.log('Client: client@demo.local / Passw0rd! (linked to Acme Corporation)');
  console.log('\n🏢 Clients created:', createdClients.length);
  console.log('📋 Projects created:', projects.length);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });