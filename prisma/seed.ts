import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ensure categories are created first
  await prisma.category.createMany({
    data: [
      { id: 'tech', name: 'Tech' },
      { id: 'health', name: 'Health' },
      { id: 'business', name: 'Business' },
    ],
    skipDuplicates: true, // Prevent duplicate entries
  });

  // Fetch categories to ensure IDs exist
  const categories = await prisma.category.findMany();

  // Create a map of category names to IDs
  const categoryMap = categories.reduce(
    (map, category) => {
      map[category.name.toLowerCase()] = category.id;
      return map;
    },
    {} as Record<string, string>,
  );

  // Now insert content, ensuring `categoryId` exists
  await prisma.content.createMany({
    data: [
      {
        title: 'Latest in AI',
        url: 'https://example.com/ai',
        categoryId: categoryMap['tech'],
      },
      {
        title: '5 Ways to Stay Healthy',
        url: 'https://example.com/health',
        categoryId: categoryMap['health'],
      },
      {
        title: 'Stock Market Updates',
        url: 'https://example.com/business',
        categoryId: categoryMap['business'],
      },
    ],
  });

  console.log('✅ Seeding completed successfully!');
}

// Run the seeding function
main()
  .catch((error) => {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
