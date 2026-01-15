'use client';

import { Plus, Trash2 } from 'lucide-react';
import { ComplexityAnalysisBlock, ComplexityItem } from '@/types/blocks';

interface Props {
  block: ComplexityAnalysisBlock;
  onChange: (block: ComplexityAnalysisBlock) => void;
}

export default function ComplexityAnalysisEditor({ block, onChange }: Props) {
  const addItem = () => {
    onChange({
      ...block,
      items: [...block.items, { approach: '', time: '', space: '' }],
    });
  };

  const updateItem = (index: number, updates: Partial<ComplexityItem>) => {
    const newItems = [...block.items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange({ ...block, items: newItems });
  };

  const removeItem = (index: number) => {
    onChange({
      ...block,
      items: block.items.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-warmGray-600">
        Add complexity analysis for different approaches (e.g., Hash Map vs Brute Force)
      </p>

      {block.items.map((item, index) => (
        <div key={index} className="p-4 bg-lavender-50 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-warmGray-700">Approach {index + 1}</span>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="p-1 text-warmGray-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div>
            <label className="block text-xs font-medium text-warmGray-600 mb-1">Approach Name</label>
            <input
              type="text"
              value={item.approach}
              onChange={(e) => updateItem(index, { approach: e.target.value })}
              className="w-full px-3 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400"
              placeholder="Hash Map"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-warmGray-600 mb-1">Time Complexity</label>
              <input
                type="text"
                value={item.time}
                onChange={(e) => updateItem(index, { time: e.target.value })}
                className="w-full px-3 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 font-mono"
                placeholder="O(n)"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-warmGray-600 mb-1">Space Complexity</label>
              <input
                type="text"
                value={item.space}
                onChange={(e) => updateItem(index, { space: e.target.value })}
                className="w-full px-3 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 font-mono"
                placeholder="O(n)"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="w-full flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-lavender-300 rounded-xl text-lavender-600 hover:border-lavender-400 hover:bg-lavender-50"
      >
        <Plus className="w-4 h-4" />
        <span>Add Approach</span>
      </button>
    </div>
  );
}
