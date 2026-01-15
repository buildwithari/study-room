'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, Shuffle } from 'lucide-react';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  bgColor: string;
  textColor: string;
  iconColor: string;
  order: number;
  parentId: string | null;
}

interface CategoryFormProps {
  category?: Category;
  parentCategories: Category[];
}

const ICON_OPTIONS = [
  'Code', 'Database', 'Network', 'Brain', 'Users', 'FileText', 'Target',
  'BookOpen', 'Layers', 'GitBranch', 'Terminal', 'Cpu', 'HardDrive', 'Cloud'
];

// Curated color presets that match the website's cozy aesthetic
const COLOR_PRESETS = [
  { name: 'Lavender', bg: 'bg-lavender-50', text: 'text-lavender-700', icon: 'text-lavender-600', swatch: 'bg-lavender-400' },
  { name: 'Pink', bg: 'bg-pink-50', text: 'text-pink-700', icon: 'text-pink-600', swatch: 'bg-pink-400' },
  { name: 'Purple', bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-600', swatch: 'bg-purple-400' },
  { name: 'Indigo', bg: 'bg-indigo-50', text: 'text-indigo-700', icon: 'text-indigo-600', swatch: 'bg-indigo-400' },
  { name: 'Blue', bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-600', swatch: 'bg-blue-400' },
  { name: 'Teal', bg: 'bg-teal-50', text: 'text-teal-700', icon: 'text-teal-600', swatch: 'bg-teal-400' },
  { name: 'Green', bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-600', swatch: 'bg-green-400' },
  { name: 'Yellow', bg: 'bg-yellow-50', text: 'text-yellow-700', icon: 'text-yellow-600', swatch: 'bg-yellow-400' },
  { name: 'Orange', bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-600', swatch: 'bg-orange-400' },
  { name: 'Rose', bg: 'bg-rose-50', text: 'text-rose-700', icon: 'text-rose-600', swatch: 'bg-rose-400' },
];

function getIconComponent(iconName: string): LucideIcon {
  const icons = LucideIcons as Record<string, LucideIcon>;
  return icons[iconName] || LucideIcons.FileText;
}

function getRandomPreset(excludeCurrent?: string) {
  const available = excludeCurrent
    ? COLOR_PRESETS.filter(p => p.bg !== excludeCurrent)
    : COLOR_PRESETS;
  return available[Math.floor(Math.random() * available.length)];
}

export default function CategoryForm({ category, parentCategories }: CategoryFormProps) {
  const router = useRouter();
  const isEditing = !!category;

  // For new categories, suggest a random color
  const getInitialColors = () => {
    if (category) {
      return {
        bgColor: category.bgColor,
        textColor: category.textColor,
        iconColor: category.iconColor,
      };
    }
    const randomPreset = getRandomPreset();
    return {
      bgColor: randomPreset.bg,
      textColor: randomPreset.text,
      iconColor: randomPreset.icon,
    };
  };

  const initialColors = getInitialColors();

  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    icon: category?.icon || 'Code',
    bgColor: initialColors.bgColor,
    textColor: initialColors.textColor,
    iconColor: initialColors.iconColor,
    order: category?.order || 0,
    parentId: category?.parentId || '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const randomizeColor = () => {
    const newPreset = getRandomPreset(formData.bgColor);
    setFormData({
      ...formData,
      bgColor: newPreset.bg,
      textColor: newPreset.text,
      iconColor: newPreset.icon,
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: isEditing ? formData.slug : generateSlug(name),
    });
  };

  const handleColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setFormData({
      ...formData,
      bgColor: preset.bg,
      textColor: preset.text,
      iconColor: preset.icon,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isEditing
        ? `/api/categories/id/${category.id}`
        : '/api/categories';

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save category');
      }

      router.push('/admin/categories');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-soft p-6 space-y-6">
        <h2 className="text-lg font-semibold text-warmGray-800">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-warmGray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-2 border border-lavender-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400"
              placeholder="e.g., Algorithms"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-warmGray-700 mb-1">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-lavender-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400"
              placeholder="e.g., algorithms"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-warmGray-700 mb-1">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-lavender-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400"
            placeholder="Brief description of this category"
            rows={2}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-warmGray-700 mb-1">
              Parent Category (optional)
            </label>
            <select
              value={formData.parentId}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              className="w-full px-4 py-2 border border-lavender-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400"
            >
              <option value="">None (Top-level category)</option>
              {parentCategories
                .filter(c => c.id !== category?.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-warmGray-700 mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-lavender-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft p-6 space-y-6">
        <h2 className="text-lg font-semibold text-warmGray-800">Appearance</h2>

        <div>
          <label className="block text-sm font-medium text-warmGray-700 mb-2">
            Icon
          </label>
          <div className="flex flex-wrap gap-2">
            {ICON_OPTIONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setFormData({ ...formData, icon })}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.icon === icon
                    ? 'bg-lavender-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-warmGray-700">
              Color Theme
            </label>
            <button
              type="button"
              onClick={randomizeColor}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium text-lavender-600 bg-lavender-50 hover:bg-lavender-100 rounded-lg transition-colors"
            >
              <Shuffle className="w-4 h-4" />
              <span>Shuffle</span>
            </button>
          </div>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleColorPreset(preset)}
                className={`group relative flex flex-col items-center p-2 rounded-xl transition-all ${
                  formData.bgColor === preset.bg
                    ? 'ring-2 ring-lavender-400 bg-white shadow-md scale-105'
                    : 'hover:bg-gray-50'
                }`}
                title={preset.name}
              >
                <div className={`w-8 h-8 rounded-full ${preset.swatch} shadow-sm mb-1`} />
                <span className="text-xs text-warmGray-600 truncate w-full text-center">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-warmGray-700 mb-1">
              Background Color
            </label>
            <input
              type="text"
              value={formData.bgColor}
              onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
              className="w-full px-4 py-2 border border-lavender-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400 text-sm"
              placeholder="bg-lavender-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-warmGray-700 mb-1">
              Text Color
            </label>
            <input
              type="text"
              value={formData.textColor}
              onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
              className="w-full px-4 py-2 border border-lavender-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400 text-sm"
              placeholder="text-lavender-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-warmGray-700 mb-1">
              Icon Color
            </label>
            <input
              type="text"
              value={formData.iconColor}
              onChange={(e) => setFormData({ ...formData, iconColor: e.target.value })}
              className="w-full px-4 py-2 border border-lavender-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400 text-sm"
              placeholder="text-lavender-600"
            />
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-warmGray-700 mb-2">
            Preview
          </label>
          <div className={`${formData.bgColor} p-5 rounded-2xl max-w-sm border border-gray-100 shadow-soft`}>
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 ${formData.bgColor.replace('50', '100')} rounded-xl flex items-center justify-center flex-shrink-0`}>
                {(() => {
                  const IconComponent = getIconComponent(formData.icon);
                  return <IconComponent className={`w-6 h-6 ${formData.iconColor}`} />;
                })()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold ${formData.textColor}`}>
                  {formData.name || 'Category Name'}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {formData.description || 'Category description goes here'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/admin/categories"
          className="flex items-center space-x-2 text-warmGray-600 hover:text-warmGray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Categories</span>
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-2 bg-lavender-500 text-white rounded-xl hover:bg-lavender-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isEditing ? 'Update Category' : 'Create Category'}</span>
        </button>
      </div>
    </form>
  );
}
