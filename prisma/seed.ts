import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    name: 'Data Structures',
    slug: 'data-structures',
    description: 'Fundamental data structures and their implementations',
    icon: 'Database',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    iconColor: 'text-blue-600',
    order: 1,
  },
  {
    name: 'Algorithms',
    slug: 'algorithms',
    description: 'Algorithmic concepts and problem-solving techniques',
    icon: 'Code',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    iconColor: 'text-green-600',
    order: 2,
  },
  {
    name: 'Problems',
    slug: 'problems',
    description: 'Practice problems and coding challenges',
    icon: 'Target',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    iconColor: 'text-purple-600',
    order: 3,
  },
  {
    name: 'System Design',
    slug: 'system-design',
    description: 'Scalable architecture and design patterns',
    icon: 'Network',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    iconColor: 'text-teal-600',
    order: 4,
  },
  {
    name: 'Databases',
    slug: 'databases',
    description: 'SQL, NoSQL and optimization techniques',
    icon: 'Database',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    iconColor: 'text-indigo-600',
    order: 5,
  },
  {
    name: 'Computer Science',
    slug: 'computer-science',
    description: 'Operating systems and distributed systems',
    icon: 'Brain',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700',
    iconColor: 'text-pink-600',
    order: 6,
  },
  {
    name: 'Behavioral Preparation',
    slug: 'behavioral-preparation',
    description: 'Behavioral questions and interview preparation',
    icon: 'Users',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    iconColor: 'text-orange-600',
    order: 7,
  },
  {
    name: 'Quick Notes',
    slug: 'quick-notes',
    description: 'Java tips, Git commands and references',
    icon: 'FileText',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    iconColor: 'text-yellow-600',
    order: 8,
  },
];

// Subcategories - will be linked to parent after creation
const subcategories = [
  {
    name: 'Arrays & Strings',
    slug: 'arrays',
    description: 'Array manipulation and string algorithms',
    parentSlug: 'algorithms',
    order: 1,
  },
  {
    name: 'Linked Lists',
    slug: 'linked-lists',
    description: 'Singly and doubly linked list problems',
    parentSlug: 'data-structures',
    order: 1,
  },
  {
    name: 'Trees & Graphs',
    slug: 'trees-graphs',
    description: 'Tree traversals and graph algorithms',
    parentSlug: 'data-structures',
    order: 2,
  },
  {
    name: 'Sorting & Searching',
    slug: 'sorting-searching',
    description: 'Sorting algorithms and binary search patterns',
    parentSlug: 'algorithms',
    order: 2,
  },
  {
    name: 'Dynamic Programming',
    slug: 'dynamic-programming',
    description: 'Memoization and tabulation techniques',
    parentSlug: 'algorithms',
    order: 3,
  },
];

async function main() {
  console.log('Seeding database...');

  // Clear existing data (delete children first due to self-referential relation)
  await prisma.article.deleteMany();
  // Delete child categories first (those with parentId)
  await prisma.category.deleteMany({ where: { parentId: { not: null } } });
  // Then delete parent categories
  await prisma.category.deleteMany({ where: { parentId: null } });
  console.log('Cleared existing categories and articles');

  // Create parent categories (use upsert to handle existing data)
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    console.log(`Created/updated category: ${category.name}`);
  }

  // Create subcategories with parent references (use upsert)
  for (const sub of subcategories) {
    const parent = await prisma.category.findUnique({
      where: { slug: sub.parentSlug },
    });

    if (parent) {
      const subData = {
        name: sub.name,
        slug: sub.slug,
        description: sub.description,
        icon: parent.icon,
        bgColor: parent.bgColor,
        textColor: parent.textColor,
        iconColor: parent.iconColor,
        order: sub.order,
        parentId: parent.id,
      };

      await prisma.category.upsert({
        where: { slug: sub.slug },
        update: subData,
        create: subData,
      });
      console.log(`Created/updated subcategory: ${sub.name} (under ${parent.name})`);
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
