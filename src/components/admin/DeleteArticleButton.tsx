'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface DeleteArticleButtonProps {
  articleId: string;
  articleTitle: string;
}

export default function DeleteArticleButton({ articleId, articleTitle }: DeleteArticleButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/articles/id/${articleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete article');
      }
    } catch {
      alert('Failed to delete article');
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center space-x-1">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {isDeleting ? '...' : 'Yes'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-2 py-1 text-xs bg-warmGray-200 text-warmGray-700 rounded hover:bg-warmGray-300"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2 text-warmGray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      title={`Delete "${articleTitle}"`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
