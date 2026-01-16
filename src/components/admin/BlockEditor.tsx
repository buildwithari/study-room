'use client';

import { useState } from 'react';
import { Plus, GripVertical, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Block, BlockType } from '@/types/blocks';
import BlockEditorModal from './BlockEditorModal';

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

const blockTypeLabels: Record<BlockType, { label: string; description: string }> = {
  problemStatement: { label: 'Problem Statement', description: 'Main problem description' },
  examples: { label: 'Examples', description: 'Input/output examples' },
  mathApproach: { label: 'Math Approach', description: 'Mathematical explanation with LaTeX' },
  codeBlock: { label: 'Code Block', description: 'Syntax-highlighted code' },
  complexityAnalysis: { label: 'Complexity Analysis', description: 'Time/space complexity' },
  walkthrough: { label: 'Walkthrough', description: 'Step-by-step explanation' },
  relatedProblems: { label: 'Related Problems', description: 'Links to similar problems' },
  tipsList: { label: 'Tips List', description: 'Tips, warnings, or notes' },
  richText: { label: 'Rich Text', description: 'General text content' },
};

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function getBlockPreview(block: Block): string {
  switch (block.type) {
    case 'problemStatement':
      return block.content.substring(0, 50) + '...';
    case 'examples':
      return `${block.items.length} example(s)`;
    case 'mathApproach':
      return block.content.substring(0, 50) + '...';
    case 'codeBlock':
      return `${block.language}: ${block.title}`;
    case 'complexityAnalysis':
      return `${block.items.length} approach(es)`;
    case 'walkthrough':
      return `${block.steps.length} step(s)`;
    case 'relatedProblems':
      return `${block.items.length} problem(s)`;
    case 'tipsList':
      return `${block.title}: ${block.items.length} item(s)`;
    case 'richText':
      return block.title || block.content.substring(0, 50) + '...';
    default:
      return 'Block';
  }
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newBlocks = [...blocks];
    const [draggedBlock] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(dropIndex, 0, draggedBlock);
    onChange(newBlocks);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const addBlock = (type: BlockType) => {
    const newBlock = createEmptyBlock(type);
    setEditingBlock(newBlock);
    setEditingIndex(blocks.length);
    setShowAddMenu(false);
  };

  const createEmptyBlock = (type: BlockType): Block => {
    const id = generateId();
    switch (type) {
      case 'problemStatement':
        return { id, type, content: '' };
      case 'examples':
        return { id, type, items: [{ title: 'Example 1:', input: '', output: '', explanation: '' }] };
      case 'mathApproach':
        return { id, type, content: '' };
      case 'codeBlock':
        return { id, type, language: 'java', title: '', filename: '', code: '', isOptimal: true };
      case 'complexityAnalysis':
        return { id, type, items: [{ approach: '', time: '', space: '' }] };
      case 'walkthrough':
        return { id, type, title: 'Step-by-Step Walkthrough', description: '', steps: [{ step: 1, content: '' }] };
      case 'relatedProblems':
        return { id, type, items: [{ title: '', description: '', slug: '' }] };
      case 'tipsList':
        return { id, type, title: 'Tips', variant: 'tips', items: [''] };
      case 'richText':
        return { id, type, title: '', content: '' };
    }
  };

  const saveBlock = (block: Block) => {
    if (editingIndex !== null) {
      const newBlocks = [...blocks];
      if (editingIndex >= blocks.length) {
        newBlocks.push(block);
      } else {
        newBlocks[editingIndex] = block;
      }
      onChange(newBlocks);
    }
    setEditingBlock(null);
    setEditingIndex(null);
  };

  const deleteBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    onChange(newBlocks);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    onChange(newBlocks);
  };

  const editBlock = (block: Block, index: number) => {
    setEditingBlock(block);
    setEditingIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Blocks List */}
      {blocks.length === 0 ? (
        <div className="text-center py-8 text-warmGray-500">
          No content blocks yet. Add your first block below.
        </div>
      ) : (
        <div className="space-y-2">
          {blocks.map((block, index) => (
            <div
              key={block.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center space-x-2 p-3 bg-lavender-50 rounded-xl border border-lavender-200 group transition-all ${
                draggedIndex === index ? 'opacity-50 scale-95' : ''
              } ${
                dragOverIndex === index && draggedIndex !== index
                  ? 'border-lavender-500 border-2 bg-lavender-100'
                  : ''
              }`}
            >
              <GripVertical className="w-4 h-4 text-warmGray-400 cursor-grab active:cursor-grabbing" />
              <div
                className="flex-1 cursor-pointer hover:text-lavender-600"
                onClick={() => editBlock(block, index)}
              >
                <span className="font-medium text-warmGray-700">
                  {blockTypeLabels[block.type].label}
                </span>
                <span className="text-warmGray-500 text-sm ml-2">
                  {getBlockPreview(block)}
                </span>
              </div>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => moveBlock(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-warmGray-400 hover:text-warmGray-600 disabled:opacity-30"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(index, 'down')}
                  disabled={index === blocks.length - 1}
                  className="p-1 text-warmGray-400 hover:text-warmGray-600 disabled:opacity-30"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteBlock(index)}
                  className="p-1 text-warmGray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Block Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-lavender-300 rounded-xl text-lavender-600 hover:border-lavender-400 hover:bg-lavender-50 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Block</span>
        </button>

        {/* Add Block Menu */}
        {showAddMenu && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-lavender-200 z-10 max-h-80 overflow-y-auto">
            {(Object.keys(blockTypeLabels) as BlockType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => addBlock(type)}
                className="w-full px-4 py-3 text-left hover:bg-lavender-50 transition-colors border-b border-lavender-100 last:border-0"
              >
                <div className="font-medium text-warmGray-700">
                  {blockTypeLabels[type].label}
                </div>
                <div className="text-sm text-warmGray-500">
                  {blockTypeLabels[type].description}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Block Editor Modal */}
      {editingBlock && (
        <BlockEditorModal
          block={editingBlock}
          onSave={saveBlock}
          onCancel={() => {
            setEditingBlock(null);
            setEditingIndex(null);
          }}
        />
      )}
    </div>
  );
}
