'use client';

import { Plus, Trash2 } from 'lucide-react';
import { WalkthroughBlock, WalkthroughStep } from '@/types/blocks';

interface Props {
  block: WalkthroughBlock;
  onChange: (block: WalkthroughBlock) => void;
}

export default function WalkthroughEditor({ block, onChange }: Props) {
  const addStep = () => {
    onChange({
      ...block,
      steps: [...block.steps, { step: block.steps.length + 1, content: '' }],
    });
  };

  const updateStep = (index: number, content: string) => {
    const newSteps = [...block.steps];
    newSteps[index] = { ...newSteps[index], content };
    onChange({ ...block, steps: newSteps });
  };

  const removeStep = (index: number) => {
    const newSteps = block.steps
      .filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, step: i + 1 }));
    onChange({ ...block, steps: newSteps });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-warmGray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={block.title || ''}
          onChange={(e) => onChange({ ...block, title: e.target.value })}
          className="w-full px-3 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400"
          placeholder="Step-by-Step Walkthrough"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-warmGray-700 mb-1">
          Description (optional)
        </label>
        <input
          type="text"
          value={block.description || ''}
          onChange={(e) => onChange({ ...block, description: e.target.value })}
          className="w-full px-3 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400"
          placeholder="Let's trace through Example 1: nums = [2,7,11,15], target = 9"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-warmGray-700">Steps</label>
        {block.steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm flex-shrink-0 mt-1">
              {step.step}
            </div>
            <input
              type="text"
              value={step.content}
              onChange={(e) => updateStep(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400"
              placeholder={`Step ${step.step} content...`}
            />
            <button
              type="button"
              onClick={() => removeStep(index)}
              className="p-2 text-warmGray-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addStep}
        className="w-full flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-lavender-300 rounded-xl text-lavender-600 hover:border-lavender-400 hover:bg-lavender-50"
      >
        <Plus className="w-4 h-4" />
        <span>Add Step</span>
      </button>
    </div>
  );
}
