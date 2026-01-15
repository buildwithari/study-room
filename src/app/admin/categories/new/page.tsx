import { prisma } from '@/lib/prisma';
import CategoryForm from '@/components/admin/CategoryForm';

async function getParentCategories() {
  // Fetch all and filter in JS (workaround for MongoDB/Prisma null query issue)
  const allCategories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
  });
  return allCategories.filter(c => !c.parentId);
}

export default async function NewCategoryPage() {
  const parentCategories = await getParentCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 to-pink-50 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-warmGray-800 mb-6">Create New Category</h1>
        <CategoryForm parentCategories={parentCategories} />
      </div>
    </div>
  );
}
