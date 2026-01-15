import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Breadcrumb from '@/components/Breadcrumb';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import { Block } from '@/types/blocks';
import * as LucideIcons from 'lucide-react';
import { LucideIcon, ChevronRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

// Get icon component by name
function getIconComponent(iconName: string): LucideIcon {
  const icons = LucideIcons as Record<string, LucideIcon>;
  return icons[iconName] || LucideIcons.FileText;
}

// Format date for display
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

// Try to find a category by slug
async function findCategory(slugParts: string[]) {
  const allCategories = await prisma.category.findMany({
    include: { parent: true },
  });

  if (slugParts.length === 1) {
    // Looking for a parent category
    return allCategories.find(c => c.slug === slugParts[0] && !c.parentId);
  } else if (slugParts.length === 2) {
    // Looking for a subcategory
    const [parentSlug, subSlug] = slugParts;
    const parent = allCategories.find(c => c.slug === parentSlug && !c.parentId);
    if (parent) {
      return allCategories.find(c => c.slug === subSlug && c.parentId === parent.id);
    }
  }
  return null;
}

// Get category data for display
async function getCategoryData(category: { id: string; slug: string; parentId: string | null }) {
  const allCategories = await prisma.category.findMany({
    include: { parent: true },
  });

  // Get subcategories
  const subcategories = allCategories.filter(c => c.parentId === category.id);

  // Get articles in this category and its subcategories
  const categoryIds = [category.id, ...subcategories.map(s => s.id)];
  const articles = await prisma.article.findMany({
    where: {
      categoryId: { in: categoryIds },
      status: 'published',
    },
    orderBy: { createdAt: 'desc' },
    include: {
      category: {
        include: { parent: true },
      },
    },
  });

  // Get article counts per subcategory
  const subcategoriesWithCounts = await Promise.all(
    subcategories.map(async (sub) => {
      const count = await prisma.article.count({
        where: { categoryId: sub.id, status: 'published' },
      });
      return { ...sub, articleCount: count };
    })
  );

  return {
    subcategories: subcategoriesWithCounts,
    articles,
  };
}

// Render category page
function CategoryPageContent({
  category,
  subcategories,
  articles,
  breadcrumbItems,
}: {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    bgColor: string;
    textColor: string;
    iconColor: string;
    parent?: { slug: string } | null;
  };
  subcategories: Array<{
    id: string;
    name: string;
    slug: string;
    bgColor: string;
    textColor: string;
    iconColor: string;
    icon: string;
    articleCount: number;
  }>;
  articles: Array<{
    id: string;
    title: string;
    subtitle: string | null;
    slug: string;
    difficulty: string | null;
    approach: string | null;
    category: {
      slug: string;
      parent?: { slug: string } | null;
    };
  }>;
  breadcrumbItems: { label: string; href?: string }[];
}) {
  const IconComponent = getIconComponent(category.icon);
  const hasContent = articles.length > 0 || subcategories.length > 0;

  return (
    <div className="min-h-screen bg-white p-6 lg:p-8">
      <div className="max-w-4xl mx-auto py-12">
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className={`w-16 h-16 ${category.bgColor.replace('50', '400')} bg-gradient-to-br rounded-2xl flex items-center justify-center shadow-cozy`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-gray-600 mt-1">{category.description}</p>
            </div>
          </div>
        </div>

        {!hasContent ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className={`w-24 h-24 ${category.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <IconComponent className={`w-12 h-12 ${category.iconColor}`} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Content for {category.name} will be added here. Check back soon for new articles and resources!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Subcategories */}
            {subcategories.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Subcategories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subcategories.map((sub) => {
                    const parentSlug = category.parent?.slug || category.slug;
                    return (
                      <Link
                        key={sub.id}
                        href={`/${parentSlug}/${sub.slug}`}
                        className={`group block ${sub.bgColor} p-4 rounded-xl shadow-soft hover:shadow-cozy transition-all duration-300 hover:-translate-y-1 border border-gray-100`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={`font-semibold ${sub.textColor}`}>{sub.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {sub.articleCount} {sub.articleCount === 1 ? 'article' : 'articles'}
                            </p>
                          </div>
                          <ChevronRight className={`w-5 h-5 ${sub.iconColor} opacity-60 group-hover:opacity-100`} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Articles */}
            {articles.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Articles</h2>
                <div className="space-y-3">
                  {articles.map((article) => {
                    // Build article URL
                    const articleCategory = article.category;
                    const parentSlug = articleCategory.parent?.slug || articleCategory.slug;
                    const subSlug = articleCategory.parent ? articleCategory.slug : '';
                    const articleUrl = subSlug
                      ? `/${parentSlug}/${subSlug}/${article.slug}`
                      : `/${parentSlug}/${article.slug}`;

                    return (
                      <Link
                        key={article.id}
                        href={articleUrl}
                        className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-lavender-300 hover:shadow-soft transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{article.title}</h3>
                            {article.subtitle && (
                              <p className="text-sm text-gray-500 mt-1">{article.subtitle}</p>
                            )}
                            <div className="flex items-center space-x-2 mt-2">
                              {article.difficulty && (
                                <span
                                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                    article.difficulty === 'Easy'
                                      ? 'bg-green-100 text-green-700'
                                      : article.difficulty === 'Medium'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-red-100 text-red-700'
                                  }`}
                                >
                                  {article.difficulty}
                                </span>
                              )}
                              {article.approach && (
                                <span className="text-xs text-gray-500">{article.approach}</span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  // First, try to find a category matching this slug
  const category = await findCategory(slug);

  if (category) {
    // It's a category page
    const { subcategories, articles } = await getCategoryData(category);

    // Build breadcrumb
    const breadcrumbItems: { label: string; href?: string }[] = [];
    if (category.parent) {
      breadcrumbItems.push({
        label: category.parent.name,
        href: `/${category.parent.slug}`,
      });
    }
    breadcrumbItems.push({ label: category.name });

    return (
      <CategoryPageContent
        category={category}
        subcategories={subcategories}
        articles={articles}
        breadcrumbItems={breadcrumbItems}
      />
    );
  }

  // Not a category, try to find an article
  const articleSlug = slug[slug.length - 1];

  const article = await prisma.article.findUnique({
    where: { slug: articleSlug },
    include: {
      category: {
        include: {
          parent: true,
        },
      },
    },
  });

  // If no article found or it's a draft, show 404
  if (!article || article.status === 'draft') {
    notFound();
  }

  // Build breadcrumb items from category hierarchy
  const breadcrumbItems: { label: string; href?: string }[] = [];

  if (article.category.parent) {
    breadcrumbItems.push({
      label: article.category.parent.name,
      href: `/${article.category.parent.slug}`,
    });
    breadcrumbItems.push({
      label: article.category.name,
      href: `/${article.category.parent.slug}/${article.category.slug}`,
    });
  } else {
    breadcrumbItems.push({
      label: article.category.name,
      href: `/${article.category.slug}`,
    });
  }

  breadcrumbItems.push({ label: article.title });

  // Get the icon component
  const IconComponent = getIconComponent(article.category.icon);
  const iconColorClass = article.category.iconColor.replace('text-', '');
  const gradientFrom = `from-${iconColorClass.replace('-600', '-400')}`;
  const gradientTo = `to-${iconColorClass.replace('-600', '-500')}`;

  // Parse blocks from JSON
  const blocks = (article.blocks as Block[]) || [];

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl flex items-center justify-center text-white shadow-cozy`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-warmGray-800">{article.title}</h1>
            {article.subtitle && (
              <p className="text-warmGray-600">{article.subtitle}</p>
            )}
          </div>
        </div>

        {/* Problem Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {article.difficulty && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-lavender-200 text-center">
              <div className={`text-2xl font-bold ${
                article.difficulty === 'Easy' ? 'text-green-600' :
                article.difficulty === 'Medium' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {article.difficulty}
              </div>
              <div className="text-sm text-warmGray-600">Difficulty</div>
            </div>
          )}
          {article.timeComplexity && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-lavender-200 text-center">
              <div className="text-2xl font-bold text-lavender-600">{article.timeComplexity}</div>
              <div className="text-sm text-warmGray-600">Time Complexity</div>
            </div>
          )}
          {article.spaceComplexity && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-lavender-200 text-center">
              <div className="text-2xl font-bold text-pink-600">{article.spaceComplexity}</div>
              <div className="text-sm text-warmGray-600">Space Complexity</div>
            </div>
          )}
          {article.approach && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-lavender-200 text-center">
              <div className="text-xl font-bold text-lavender-400">{article.approach}</div>
              <div className="text-sm text-warmGray-600">Approach</div>
            </div>
          )}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-lavender-200 text-center">
            <div className="text-lg font-bold text-blue-600">{formatDate(article.updatedAt)}</div>
            <div className="text-sm text-warmGray-600">Last Updated</div>
          </div>
        </div>
      </div>

      {/* Render content blocks */}
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}

      {/* Show message if no blocks */}
      {blocks.length === 0 && (
        <div className="bg-lavender-50 rounded-xl p-8 text-center border border-lavender-200">
          <p className="text-warmGray-600">This article is being written. Check back soon!</p>
        </div>
      )}
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  // Check if it's a category first
  const category = await findCategory(slug);
  if (category) {
    return {
      title: `${category.name} | Ari's Study Room`,
      description: category.description,
    };
  }

  // Check for article
  const articleSlug = slug[slug.length - 1];
  const article = await prisma.article.findUnique({
    where: { slug: articleSlug },
    select: { title: true, subtitle: true },
  });

  if (!article) {
    return { title: 'Not Found' };
  }

  return {
    title: `${article.title} | Ari's Study Room`,
    description: article.subtitle || article.title,
  };
}
