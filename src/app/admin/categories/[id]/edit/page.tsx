import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CategoryForm from '@/components/admin/CategoryForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  return category;
}

async function getParentCategories() {
  // Fetch all and filter in JS (workaround for MongoDB/Prisma null query issue)
  const allCategories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
  });
  return allCategories.filter(c => !c.parentId);
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const [category, parentCategories] = await Promise.all([
    getCategory(id),
    getParentCategories(),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 to-pink-50 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-warmGray-800 mb-6">Edit Category</h1>
        <CategoryForm category={category} parentCategories={parentCategories} />
      </div>
    </div>
  );
}
