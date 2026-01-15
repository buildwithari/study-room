'use client';

import { MathApproachBlock } from '@/types/blocks';

interface Props {
  block: MathApproachBlock;
  onChange: (block: MathApproachBlock) => void;
}

export default function MathApproachEditor({ block, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-warmGray-700 mb-1">
          Mathematical Approach Content
        </label>
        <p className="text-xs text-warmGray-500 mb-2">
          Use LaTeX for math: $x + y = T$ for inline, $$y = T - x$$ for block equations
        </p>
        <textarea
          value={block.content}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          className="w-full h-48 px-4 py-3 border border-lavender-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400 font-mono text-sm"
          placeholder="For each element $x$ in the array, we need to find if there exists another element $y$ such that:&#10;&#10;$$x + y = T$$&#10;&#10;This can be rewritten as:&#10;&#10;$$y = T - x$$"
        />
      </div>
    </div>
  );
}
