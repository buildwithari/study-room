export const dynamic = 'force-dynamic';

import Link from 'next/link';
import {
  Code,
  Database,
  Network,
  Brain,
  Users,
  FileText,
  ChevronRight,
  Target,
  BookOpen,
  ChevronDown,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';

// Map icon names to components
const iconMap: Record<string, React.ReactNode> = {
  Code: <Code className="w-6 h-6" />,
  Database: <Database className="w-6 h-6" />,
  Network: <Network className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
  Target: <Target className="w-6 h-6" />,
};

async function getCategories() {
  // Fetch all categories and filter in JS (workaround for MongoDB/Prisma null query issue)
  const allCategories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
  });

  // Filter parent categories (those without parentId)
  const parentCategories = allCategories.filter((c) => !c.parentId);

  // Fetch article counts separately
  const articleCounts = await prisma.article.groupBy({
    by: ['categoryId'],
    _count: { id: true },
    where: { status: 'published' },
  });

  const countMap = new Map(
    articleCounts.map((c) => [c.categoryId, c._count.id])
  );

  return parentCategories.map((category) => {
    // Get direct article count
    let articleCount = countMap.get(category.id) || 0;

    // Add article counts from all subcategories
    const subcategories = allCategories.filter((c) => c.parentId === category.id);
    for (const sub of subcategories) {
      articleCount += countMap.get(sub.id) || 0;
    }

    return {
      ...category,
      totalArticles: articleCount,
      articlesText: articleCount === 1 ? '1 article' : `${articleCount} articles`,
    };
  });
}

export default async function Home() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-white">
      {/* Landing Banner */}
      <div className="min-h-[85vh] bg-gradient-to-br from-lavender-50 via-white to-pink-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Large soft circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-lavender-100 rounded-full opacity-50"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-100 rounded-full opacity-40"></div>
          <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-lavender-100 rounded-full opacity-30"></div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20 lg:py-28 relative z-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">

            {/* Left: Main content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-lavender-200 rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-warmGray-600 font-medium">Open for learning</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold text-warmGray-900 mb-4 leading-tight">
                Welcome to<br />
                <span className="text-lavender-600">Ari&apos;s Study Room</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-warmGray-600 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                A collection of computer science notes, algorithm explanations, and interview preparation materials.
                Grab a cup of coffee and explore at your own pace.
              </p>

              {/* Topic pills */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-8">
                <span className="px-3 py-1.5 bg-lavender-100 text-lavender-700 rounded-lg text-sm font-medium">Algorithms</span>
                <span className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-sm font-medium">Data Structures</span>
                <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium">System Design</span>
                <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">Interview Tips</span>
              </div>

              {/* Scroll indicator */}
              <div className="flex items-center space-x-2 text-warmGray-500 justify-center lg:justify-start">
                <ChevronDown className="w-4 h-4" />
                <span className="text-sm font-medium">Scroll to explore topics</span>
              </div>
            </div>

            {/* Right: Visual element */}
            <div className="flex-shrink-0">
              <div className="relative">
                {/* Main card */}
                <div className="w-64 sm:w-72 bg-white rounded-2xl shadow-xl border border-lavender-100 p-6">
                  {/* Icon header */}
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-lavender-500 to-pink-500 rounded-xl mb-4 mx-auto">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>

                  {/* Card content */}
                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-warmGray-800 mb-1">CS Notes & Prep</h3>
                    <p className="text-sm text-warmGray-500">Interview preparation</p>
                  </div>

                  {/* Mini stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-lavender-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-lavender-600">📚</div>
                      <div className="text-xs text-warmGray-600 mt-1">Notes</div>
                    </div>
                    <div className="bg-pink-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-pink-600">💡</div>
                      <div className="text-xs text-warmGray-600 mt-1">Tips</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-orange-600">🎯</div>
                      <div className="text-xs text-warmGray-600 mt-1">Practice</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-green-600">☕</div>
                      <div className="text-xs text-warmGray-600 mt-1">Cozy</div>
                    </div>
                  </div>
                </div>

                {/* Floating accent cards */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-xl opacity-80 -z-10 rotate-12"></div>
                <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-gradient-to-br from-lavender-200 to-purple-200 rounded-xl opacity-80 -z-10 -rotate-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Categories Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Explore Categories
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Choose from our comprehensive collection of study materials organized by topic
          </p>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className={`group block ${category.bgColor} p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100`}
            >
              <div className="flex items-start justify-between h-full">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                    <div className={category.iconColor}>
                      {iconMap[category.icon] || <FileText className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className={`font-semibold text-base sm:text-lg ${category.textColor}`}>
                        {category.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {category.articlesText}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {category.description}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 ${category.iconColor} opacity-60 group-hover:opacity-100 transition-opacity`} />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}