'use client';

import { CodeBlockData } from '@/types/blocks';

interface Props {
  block: CodeBlockData;
  onChange: (block: CodeBlockData) => void;
}

const languages = [
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
];

export default function CodeBlockEditor({ block, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-warmGray-700 mb-1">
            Language
          </label>
          <select
            value={block.language}
            onChange={(e) => onChange({ ...block, language: e.target.value })}
            className="w-full px-3 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-warmGray-700 mb-1">
            Filename (optional)
          </label>
          <input
            type="text"
            value={block.filename || ''}
            onChange={(e) => onChange({ ...block, filename: e.target.value })}
            className="w-full px-3 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400"
            placeholder="TwoSum.java"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-warmGray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={block.title}
          onChange={(e) => onChange({ ...block, title: e.target.value })}
          className="w-full px-3 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400"
          placeholder="Two Sum - Hash Map Solution"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isOptimal"
          checked={block.isOptimal || false}
          onChange={(e) => onChange({ ...block, isOptimal: e.target.checked })}
          className="rounded border-lavender-300 text-lavender-500 focus:ring-lavender-400"
        />
        <label htmlFor="isOptimal" className="text-sm text-warmGray-700">
          Mark as optimal solution (shows green checkmark)
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-warmGray-700 mb-1">
          Code
        </label>
        <textarea
          value={block.code}
          onChange={(e) => onChange({ ...block, code: e.target.value })}
          className="w-full h-64 px-4 py-3 border border-lavender-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400 font-mono text-sm"
          placeholder="public class TwoSum {&#10;    public int[] twoSum(int[] nums, int target) {&#10;        // Your code here&#10;    }&#10;}"
        />
      </div>
    </div>
  );
}
