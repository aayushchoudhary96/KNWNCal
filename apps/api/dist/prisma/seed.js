"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2 = require("argon2");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seed...');
    const passwordHash = await argon2.hash('Passw0rd!');
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
//# sourceMappingURL=seed.js.map