import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ArticleForm from '@/components/admin/ArticleForm';
import { Block } from '@/types/blocks';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getArticle(id: string) {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      category: {
        include: { parent: true },
      },
    },
  });
  return article;
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: { parent: true },
  });
  return categories;
}

export default async function EditArticlePage({ params }: PageProps) {
  const { id } = await params;
  const [article, categories] = await Promise.all([
    getArticle(id),
    getCategories(),
  ]);

  if (!article) {
    notFound();
  }

  // Transform article for the form
  const formArticle = {
    id: article.id,
    title: article.title,
    subtitle: article.subtitle,
    slug: article.slug,
    categoryId: article.categoryId,
    difficulty: article.difficulty,
    timeComplexity: article.timeComplexity,
    spaceComplexity: article.spaceComplexity,
    approach: article.approach,
    blocks: Array.isArray(article.blocks) ? (article.blocks as unknown as Block[]) : [],
    status: article.status,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 to-pink-50 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-warmGray-800 mb-6">Edit Article</h1>
        <ArticleForm article={formArticle} categories={categories} />
      </div>
    </div>
  );
}
