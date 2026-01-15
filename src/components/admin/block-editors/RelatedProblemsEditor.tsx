'use client';

import { Plus, Trash2 } from 'lucide-react';
import { RelatedProblemsBlock, RelatedProblem } from '@/types/blocks';

interface Props {
  block: RelatedProblemsBlock;
  onChange: (block: RelatedProblemsBlock) => void;
}

export default function RelatedProblemsEditor({ block, onChange }: Props) {
  const addProblem = () => {
    onChange({
      ...block,
      items: [...block.items, { title: '', description: '', slug: '' }],
    });
  };

  const updateProblem = (index: number, updates: Partial<RelatedProblem>) => {
    const newItems = [...block.items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange({ ...block, items: newItems });
  };

  const removeProblem = (index: number) => {
    onChange({
      ...block,
      items: block.items.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-warmGray-600">
        Add related problems that readers might want to explore
      </p>

      {block.items.map((problem, index) => (
        <div key={index} className="p-4 bg-lavender-50 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-warmGray-700">Problem {index + 1}</span>
            <button
              type="button"
              onClick={() => removeProblem(index)}
              className="p-1 text-warmGray-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div>
            <label className="block text-xs font-medium text-warmGray-600 mb-1">Title</label>
            <input
              type="text"
              value={problem.title}
              onChange={(e) => updateProblem(index, { title: e.target.value })}
              className="w-full px-3 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400"
              placeholder="Three Sum"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-warmGray-600 mb-1">Description</label>
            <input
              type="text"
              value={problem.description}
              onChange={(e) => updateProblem(index, { description: e.target.value })}
              className="w-full px-3 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400"
              placeholder="Find all unique triplets that sum to zero"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-warmGray-600 mb-1">Link (optional)</label>
            <input
              type="text"
              value={problem.slug || ''}
              onChange={(e) => updateProblem(index, { slug: e.target.value })}
              className="w-full px-3 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400"
              placeholder="/algorithms/arrays/three-sum"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addProblem}
        className="w-full flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-lavender-300 rounded-xl text-lavender-600 hover:border-lavender-400 hover:bg-lavender-50"
      >
        <Plus className="w-4 h-4" />
        <span>Add Related Problem</span>
      </button>
    </div>
  );
}
