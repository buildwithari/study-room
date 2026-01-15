import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Plus, Edit, FolderTree, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import DeleteCategoryButton from '@/components/admin/DeleteCategoryButton';

function getIconComponent(iconName: string): LucideIcon {
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  return icons[iconName] || LucideIcons.FileText;
}

async function getCategories() {
  const allCategories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: {
      parent: true,
      _count: {
        select: { articles: true },
      },
    },
  });

  // Organize into parent-child structure
  const parentCategories = allCategories.filter(c => !c.parentId);
  const result = parentCategories.map(parent => {
    const children = allCategories.filter(c => c.parentId === parent.id);
    const childrenWithCounts = children.map(child => ({
      ...child,
      articleCount: child._count.articles,
    }));

    // Calculate total articles including subcategories
    const directCount = parent._count.articles;
    const totalCount = directCount + childrenWithCounts.reduce((sum, c) => sum + c.articleCount, 0);

    return {
      ...parent,
      articleCount: directCount,
      totalArticleCount: totalCount,
      children: childrenWithCounts,
    };
  });

  return result;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 to-pink-50 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-lavender-100 rounded-xl flex items-center justify-center">
              <FolderTree className="w-6 h-6 text-lavender-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-warmGray-800">Categories</h1>
              <p className="text-warmGray-500 text-sm">Manage your content categories</p>
            </div>
          </div>
          <Link
            href="/admin/categories/new"
            className="flex items-center space-x-2 px-4 py-2 bg-lavender-500 text-white rounded-xl hover:bg-lavender-600 transition-colors shadow-soft"
          >
            <Plus className="w-4 h-4" />
            <span>New Category</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          {categories.length === 0 ? (
            <div className="text-center py-16">
              <FolderTree className="w-16 h-16 text-lavender-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-warmGray-700 mb-2">No categories yet</h2>
              <p className="text-warmGray-500 mb-6">Create your first category to get started</p>
              <Link
                href="/admin/categories/new"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-lavender-500 text-white rounded-xl hover:bg-lavender-600"
              >
                <Plus className="w-4 h-4" />
                <span>Create Category</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {categories.map((category) => {
                const IconComponent = getIconComponent(category.icon);
                return (
                  <div key={category.id}>
                    {/* Parent Category */}
                    <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 ${category.bgColor} rounded-xl flex items-center justify-center`}>
                          <IconComponent className={`w-5 h-5 ${category.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-warmGray-800">{category.name}</h3>
                          <div className="flex items-center space-x-3 text-sm text-warmGray-500">
                            <span>/{category.slug}</span>
                            <span>•</span>
                            <span>
                              {category.totalArticleCount} {category.totalArticleCount === 1 ? 'article' : 'articles'}
                              {category.children.length > 0 && category.articleCount !== category.totalArticleCount && (
                                <span className="text-warmGray-400"> ({category.articleCount} direct)</span>
                              )}
                            </span>
                            {category.children.length > 0 && (
                              <>
                                <span>•</span>
                                <span>{category.children.length} subcategories</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
                          className="p-2 text-warmGray-400 hover:text-lavender-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteCategoryButton
                          categoryId={category.id}
                          categoryName={category.name}
                        />
                      </div>
                    </div>

                    {/* Subcategories */}
                    {category.children.map((child) => {
                      const ChildIcon = getIconComponent(child.icon);
                      return (
                        <div
                          key={child.id}
                          className="flex items-center justify-between p-4 pl-12 bg-gray-50/50 hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-4">
                            <ChevronRight className="w-4 h-4 text-warmGray-300" />
                            <div className={`w-8 h-8 ${child.bgColor} rounded-lg flex items-center justify-center`}>
                              <ChildIcon className={`w-4 h-4 ${child.iconColor}`} />
                            </div>
                            <div>
                              <h4 className="font-medium text-warmGray-700">{child.name}</h4>
                              <div className="flex items-center space-x-3 text-sm text-warmGray-500">
                                <span>/{category.slug}/{child.slug}</span>
                                <span>•</span>
                                <span>{child.articleCount} articles</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/admin/categories/${child.id}/edit`}
                              className="p-2 text-warmGray-400 hover:text-lavender-600 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <DeleteCategoryButton
                              categoryId={child.id}
                              categoryName={child.name}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/admin"
            className="text-lavender-600 hover:text-lavender-700"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
