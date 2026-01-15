import { prisma } from '@/lib/prisma';
import ArticleForm from '@/components/admin/ArticleForm';

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: { parent: true },
  });
  return categories;
}

export default async function NewArticlePage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 to-pink-50 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-warmGray-800 mb-6">Create New Article</h1>
        <ArticleForm categories={categories} />
      </div>
    </div>
  );
}
