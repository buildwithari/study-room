'use client';

import { RichTextBlock } from '@/types/blocks';

interface Props {
  block: RichTextBlock;
  onChange: (block: RichTextBlock) => void;
}

export default function RichTextEditor({ block, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-warmGray-700 mb-1">
          Section Title (optional)
        </label>
        <input
          type="text"
          value={block.title || ''}
          onChange={(e) => onChange({ ...block, title: e.target.value })}
          className="w-full px-3 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400"
          placeholder="e.g., How It Works"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-warmGray-700 mb-1">
          Content
        </label>
        <p className="text-xs text-warmGray-500 mb-2">
          Use HTML for formatting: &lt;p&gt;paragraphs&lt;/p&gt;, &lt;code&gt;inline code&lt;/code&gt;, &lt;strong&gt;bold&lt;/strong&gt;, &lt;em&gt;italic&lt;/em&gt;, &lt;ul&gt;&lt;li&gt;lists&lt;/li&gt;&lt;/ul&gt;
        </p>
        <textarea
          value={block.content}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          className="w-full h-48 px-4 py-3 border border-lavender-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400 font-mono text-sm"
          placeholder="<p>Enter your content here...</p>"
        />
      </div>
    </div>
  );
}
