'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
}

export default function DeleteCategoryButton({ categoryId, categoryName }: DeleteCategoryButtonProps) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setDeleting(true);
    setError('');

    try {
      const res = await fetch(`/api/categories/id/${categoryId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete category');
      }

      // Force a hard refresh to clear cache
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setDeleting(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center space-x-2">
        {error && (
          <span className="text-red-600 text-sm">{error}</span>
        )}
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1 text-sm text-warmGray-600 hover:text-warmGray-800"
          disabled={deleting}
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
        >
          {deleting && <Loader2 className="w-3 h-3 animate-spin" />}
          <span>Delete</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2 text-warmGray-400 hover:text-red-600 transition-colors"
      title={`Delete ${categoryName}`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
