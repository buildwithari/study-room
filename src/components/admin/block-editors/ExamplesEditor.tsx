'use client';

import { Plus, Trash2 } from 'lucide-react';
import { ExamplesBlock, Example } from '@/types/blocks';

interface Props {
  block: ExamplesBlock;
  onChange: (block: ExamplesBlock) => void;
}

export default function ExamplesEditor({ block, onChange }: Props) {
  const addExample = () => {
    onChange({
      ...block,
      items: [...block.items, { title: `Example ${block.items.length + 1}:`, input: '', output: '', explanation: '' }],
    });
  };

  const updateExample = (index: number, updates: Partial<Example>) => {
    const newItems = [...block.items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange({ ...block, items: newItems });
  };

  const removeExample = (index: number) => {
    onChange({
      ...block,
      items: block.items.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      {block.items.map((example, index) => (
        <div key={index} className="p-4 bg-lavender-50 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={example.title}
              onChange={(e) => updateExample(index, { title: e.target.value })}
              className="font-medium text-warmGray-700 bg-transparent border-b border-transparent focus:border-lavender-400 focus:outline-none"
              placeholder="Example 1:"
            />
            <button
              type="button"
              onClick={() => removeExample(index)}
              className="p-1 text-warmGray-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div>
            <label className="block text-xs font-medium text-warmGray-600 mb-1">Input</label>
            <input
              type="text"
              value={example.input}
              onChange={(e) => updateExample(index, { input: e.target.value })}
              className="w-full px-3 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 font-mono text-sm"
              placeholder="nums = [2,7,11,15], target = 9"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-warmGray-600 mb-1">Output</label>
            <input
              type="text"
              value={example.output}
              onChange={(e) => updateExample(index, { output: e.target.value })}
              className="w-full px-3 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 font-mono text-sm"
              placeholder="[0,1]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-warmGray-600 mb-1">Explanation (optional)</label>
            <p className="text-xs text-warmGray-500 mb-1">
              Use HTML: &lt;code&gt;inline code&lt;/code&gt;, &lt;strong&gt;bold&lt;/strong&gt;, &lt;em&gt;italic&lt;/em&gt;
            </p>
            <textarea
              value={example.explanation || ''}
              onChange={(e) => updateExample(index, { explanation: e.target.value })}
              className="w-full h-20 px-3 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 text-sm"
              placeholder="Because <code>nums[0]</code> + <code>nums[1]</code> == 9..."
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addExample}
        className="w-full flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-lavender-300 rounded-xl text-lavender-600 hover:border-lavender-400 hover:bg-lavender-50"
      >
        <Plus className="w-4 h-4" />
        <span>Add Example</span>
      </button>
    </div>
  );
}
