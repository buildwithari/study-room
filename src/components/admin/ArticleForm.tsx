'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Eye, ArrowLeft, ChevronDown } from 'lucide-react';
import BlockEditor from './BlockEditor';
import { Block } from '@/types/blocks';

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  parent?: { id: string; name: string } | null;
}

interface ArticleFormProps {
  article?: {
    id: string;
    title: string;
    subtitle: string | null;
    slug: string;
    categoryId: string;
    difficulty: string | null;
    timeComplexity: string | null;
    spaceComplexity: string | null;
    approach: string | null;
    blocks: Block[];
    status: string;
  };
  categories: Category[];
}

export default function ArticleForm({ article, categories }: ArticleFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state
  const [title, setTitle] = useState(article?.title || '');
  const [subtitle, setSubtitle] = useState(article?.subtitle || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [categoryId, setCategoryId] = useState(article?.categoryId || '');
  const [difficulty, setDifficulty] = useState(article?.difficulty || '');
  const [timeComplexity, setTimeComplexity] = useState(article?.timeComplexity || '');
  const [spaceComplexity, setSpaceComplexity] = useState(article?.spaceComplexity || '');
  const [approach, setApproach] = useState(article?.approach || '');
  const [blocks, setBlocks] = useState<Block[]>(article?.blocks || []);
  const [status, setStatus] = useState(article?.status || 'draft');

  // Auto-generate slug from title
  useEffect(() => {
    if (!article && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(generatedSlug);
    }
  }, [title, article]);

  // Group categories by parent
  const parentCategories = categories.filter((c) => !c.parentId);
  const childCategories = categories.filter((c) => c.parentId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      const url = article
        ? `/api/articles/id/${article.id}`
        : '/api/articles';
      const method = article ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle: subtitle || null,
          slug,
          categoryId,
          difficulty: difficulty || null,
          timeComplexity: timeComplexity || null,
          spaceComplexity: spaceComplexity || null,
          approach: approach || null,
          blocks,
          status,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save article');
      }

      const data = await response.json();

      if (article) {
        // Editing existing article - stay on page and show success
        setSaveSuccess(true);
        // Auto-hide success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        // Creating new article - redirect to edit page
        router.push(`/admin/articles/${data.id}/edit`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    // Find the category to build the preview URL
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      const parentSlug = category.parent?.name
        ? categories.find((c) => c.id === category.parentId)?.slug
        : category.slug;
      const categorySlug = category.parentId ? category.slug : '';
      const previewUrl = categorySlug
        ? `/${parentSlug}/${categorySlug}/${slug}`
        : `/${parentSlug}/${slug}`;
      window.open(previewUrl, '_blank');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="flex items-center space-x-2 text-warmGray-600 hover:text-warmGray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex items-center space-x-3">
          {article && (
            <button
              type="button"
              onClick={handlePreview}
              className="flex items-center space-x-2 px-4 py-2 border border-lavender-300 text-lavender-700 rounded-xl hover:bg-lavender-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 bg-gradient-to-r from-lavender-500 to-pink-500 hover:from-lavender-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Article'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center justify-between">
          <span>Article saved successfully!</span>
          <button
            type="button"
            onClick={() => setSaveSuccess(false)}
            className="text-green-600 hover:text-green-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Subtitle */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-lavender-200">
            <h2 className="text-lg font-semibold text-warmGray-800 mb-4">Basic Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-lavender-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400"
                  placeholder="e.g., Two Sum Problem"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-4 py-2 border border-lavender-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400"
                  placeholder="e.g., Find two numbers that add up to target"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2 border border-lavender-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400 font-mono text-sm"
                  placeholder="e.g., two-sum"
                  required
                />
                <p className="text-xs text-warmGray-500 mt-1">
                  URL-friendly identifier (auto-generated from title)
                </p>
              </div>
            </div>
          </div>

          {/* Block Editor */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-lavender-200">
            <h2 className="text-lg font-semibold text-warmGray-800 mb-4">Content Blocks</h2>
            <BlockEditor blocks={blocks} onChange={setBlocks} />
          </div>
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-lavender-200">
            <h2 className="text-lg font-semibold text-warmGray-800 mb-4">Status</h2>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={(e) => setStatus(e.target.value)}
                  className="text-lavender-500 focus:ring-lavender-400"
                />
                <span className="text-warmGray-700">Draft</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="published"
                  checked={status === 'published'}
                  onChange={(e) => setStatus(e.target.value)}
                  className="text-lavender-500 focus:ring-lavender-400"
                />
                <span className="text-warmGray-700">Published</span>
              </label>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-lavender-200">
            <h2 className="text-lg font-semibold text-warmGray-800 mb-4">Category *</h2>
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2 border border-lavender-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400 appearance-none bg-white"
                required
              >
                <option value="">Select a category</option>
                {parentCategories.map((parent) => (
                  <optgroup key={parent.id} label={parent.name}>
                    {childCategories
                      .filter((c) => c.parentId === parent.id)
                      .map((child) => (
                        <option key={child.id} value={child.id}>
                          {child.name}
                        </option>
                      ))}
                    {childCategories.filter((c) => c.parentId === parent.id).length === 0 && (
                      <option value={parent.id}>{parent.name} (root)</option>
                    )}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warmGray-400 pointer-events-none" />
            </div>
          </div>

          {/* Problem Metadata */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-lavender-200">
            <h2 className="text-lg font-semibold text-warmGray-800 mb-4">Problem Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-2 border border-lavender-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400"
                >
                  <option value="">Select difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  Time Complexity
                </label>
                <input
                  type="text"
                  value={timeComplexity}
                  onChange={(e) => setTimeComplexity(e.target.value)}
                  className="w-full px-4 py-2 border border-lavender-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400"
                  placeholder="e.g., O(n)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  Space Complexity
                </label>
                <input
                  type="text"
                  value={spaceComplexity}
                  onChange={(e) => setSpaceComplexity(e.target.value)}
                  className="w-full px-4 py-2 border border-lavender-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400"
                  placeholder="e.g., O(n)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  Approach
                </label>
                <input
                  type="text"
                  value={approach}
                  onChange={(e) => setApproach(e.target.value)}
                  className="w-full px-4 py-2 border border-lavender-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400"
                  placeholder="e.g., Hash Map"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
