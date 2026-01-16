import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Plus, FileText, Clock, CheckCircle, Edit, FolderTree } from 'lucide-react';
import DeleteArticleButton from '@/components/admin/DeleteArticleButton';
import LogoutButton from '@/components/admin/LogoutButton';

async function getArticles() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      category: {
        include: { parent: true },
      },
    },
  });
  return articles;
}

async function getStats() {
  const total = await prisma.article.count();
  const published = await prisma.article.count({ where: { status: 'published' } });
  const drafts = await prisma.article.count({ where: { status: 'draft' } });
  const categories = await prisma.category.count();
  return { total, published, drafts, categories };
}

export default async function AdminDashboard() {
  const [articles, stats] = await Promise.all([getArticles(), getStats()]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 to-pink-50 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-warmGray-800">Admin Dashboard</h1>
            <p className="text-warmGray-600 mt-1">Manage your articles and content</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/categories"
              className="flex items-center space-x-2 bg-white border border-lavender-200 hover:border-lavender-400 text-warmGray-700 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 shadow-soft"
            >
              <FolderTree className="w-5 h-5 text-lavender-500" />
              <span>Categories</span>
            </Link>
            <Link
              href="/admin/articles/new"
              className="flex items-center space-x-2 bg-gradient-to-r from-lavender-500 to-pink-500 hover:from-lavender-600 hover:to-pink-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>New Article</span>
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-lavender-200 shadow-soft">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-lavender-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-lavender-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warmGray-800">{stats.total}</p>
                <p className="text-sm text-warmGray-600">Total Articles</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-200 shadow-soft">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warmGray-800">{stats.published}</p>
                <p className="text-sm text-warmGray-600">Published</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-yellow-200 shadow-soft">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warmGray-800">{stats.drafts}</p>
                <p className="text-sm text-warmGray-600">Drafts</p>
              </div>
            </div>
          </div>
          <Link href="/admin/categories" className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-pink-200 shadow-soft hover:border-pink-300 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <FolderTree className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warmGray-800">{stats.categories}</p>
                <p className="text-sm text-warmGray-600">Categories</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Articles List */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-lavender-200 shadow-soft overflow-hidden">
          <div className="p-4 border-b border-lavender-100">
            <h2 className="font-semibold text-warmGray-800">All Articles</h2>
          </div>

          {articles.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-warmGray-300 mx-auto mb-4" />
              <p className="text-warmGray-600 mb-4">No articles yet</p>
              <Link
                href="/admin/articles/new"
                className="inline-flex items-center space-x-2 text-lavender-600 hover:text-lavender-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Create your first article</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-lavender-100">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="p-4 hover:bg-lavender-50/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-warmGray-800 truncate">
                          {article.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            article.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {article.status}
                        </span>
                        {article.difficulty && (
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              article.difficulty === 'Easy'
                                ? 'bg-green-50 text-green-600'
                                : article.difficulty === 'Medium'
                                ? 'bg-yellow-50 text-yellow-600'
                                : 'bg-red-50 text-red-600'
                            }`}
                          >
                            {article.difficulty}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-warmGray-500">
                          {article.category.parent
                            ? `${article.category.parent.name} / ${article.category.name}`
                            : article.category.name}
                        </span>
                        <span className="text-warmGray-300">•</span>
                        <span className="text-sm text-warmGray-500">
                          {new Date(article.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="p-2 text-warmGray-500 hover:text-lavender-600 hover:bg-lavender-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteArticleButton articleId={article.id} articleTitle={article.title} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
