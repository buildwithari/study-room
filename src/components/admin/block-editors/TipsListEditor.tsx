'use client';

import { Plus, Trash2 } from 'lucide-react';
import { TipsListBlock } from '@/types/blocks';

interface Props {
  block: TipsListBlock;
  onChange: (block: TipsListBlock) => void;
}

export default function TipsListEditor({ block, onChange }: Props) {
  const addItem = () => {
    onChange({
      ...block,
      items: [...block.items, ''],
    });
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...block.items];
    newItems[index] = value;
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
      <div>
        <label className="block text-sm font-medium text-warmGray-700 mb-1">
          Section Title
        </label>
        <input
          type="text"
          value={block.title}
          onChange={(e) => onChange({ ...block, title: e.target.value })}
          className="w-full px-3 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400"
          placeholder="Practice Tips"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-warmGray-700 mb-1">
          Style Variant
        </label>
        <select
          value={block.variant}
          onChange={(e) => onChange({ ...block, variant: e.target.value as 'tips' | 'warnings' | 'notes' })}
          className="w-full px-3 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400"
        >
          <option value="tips">Tips (lavender/pink gradient)</option>
          <option value="warnings">Warnings (red background)</option>
          <option value="notes">Notes (blue background)</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-warmGray-700">Items</label>
        {block.items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-warmGray-400">•</span>
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400"
              placeholder="Enter a tip or note..."
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="p-2 text-warmGray-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="w-full flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-lavender-300 rounded-xl text-lavender-600 hover:border-lavender-400 hover:bg-lavender-50"
      >
        <Plus className="w-4 h-4" />
        <span>Add Item</span>
      </button>
    </div>
  );
}
