'use client';

import { ProblemStatementBlock } from '@/types/blocks';

interface Props {
  block: ProblemStatementBlock;
  onChange: (block: ProblemStatementBlock) => void;
}

export default function ProblemStatementEditor({ block, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-warmGray-700 mb-1">
          Problem Statement Content
        </label>
        <p className="text-xs text-warmGray-500 mb-2">
          Use HTML for formatting: &lt;code&gt;for inline code&lt;/code&gt;, &lt;strong&gt;bold&lt;/strong&gt;, &lt;em&gt;italic&lt;/em&gt;
        </p>
        <textarea
          value={block.content}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          className="w-full h-48 px-4 py-3 border border-lavender-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400 font-mono text-sm"
          placeholder="<p>Given an array of integers <code>nums</code> and an integer <code>target</code>...</p>"
        />
      </div>
    </div>
  );
}
