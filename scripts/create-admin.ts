import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Read credentials from environment variables
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'Admin';

  if (!adminEmail || !adminPassword) {
    console.error('Missing required environment variables!');
    console.log('\nUsage:');
    console.log('  ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=yourpassword npm run create-admin');
    console.log('\nOr add to your .env file:');
    console.log('  ADMIN_EMAIL=you@example.com');
    console.log('  ADMIN_PASSWORD=yourpassword');
    console.log('  ADMIN_NAME=Ari (optional)');
    process.exit(1);
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingUser) {
    console.log(`User with email ${adminEmail} already exists.`);
    console.log('If you want to update the password, delete the user first.');
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  // Create the admin user
  const user = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
    },
  });

  console.log('Admin user created successfully!');
  console.log(`Email: ${user.email}`);
  console.log(`Name: ${user.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
