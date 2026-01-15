'use client';

import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Block, BlockType } from '@/types/blocks';
import ProblemStatementEditor from './block-editors/ProblemStatementEditor';
import ExamplesEditor from './block-editors/ExamplesEditor';
import MathApproachEditor from './block-editors/MathApproachEditor';
import CodeBlockEditor from './block-editors/CodeBlockEditor';
import ComplexityAnalysisEditor from './block-editors/ComplexityAnalysisEditor';
import WalkthroughEditor from './block-editors/WalkthroughEditor';
import RelatedProblemsEditor from './block-editors/RelatedProblemsEditor';
import TipsListEditor from './block-editors/TipsListEditor';
import RichTextEditor from './block-editors/RichTextEditor';

interface BlockEditorModalProps {
  block: Block;
  onSave: (block: Block) => void;
  onCancel: () => void;
}

const blockTypeLabels: Record<BlockType, string> = {
  problemStatement: 'Problem Statement',
  examples: 'Examples',
  mathApproach: 'Mathematical Approach',
  codeBlock: 'Code Block',
  complexityAnalysis: 'Complexity Analysis',
  walkthrough: 'Walkthrough',
  relatedProblems: 'Related Problems',
  tipsList: 'Tips List',
  richText: 'Rich Text',
};

export default function BlockEditorModal({ block, onSave, onCancel }: BlockEditorModalProps) {
  const [editedBlock, setEditedBlock] = useState<Block>(block);

  const handleSave = () => {
    onSave(editedBlock);
  };

  const renderEditor = () => {
    switch (editedBlock.type) {
      case 'problemStatement':
        return <ProblemStatementEditor block={editedBlock} onChange={setEditedBlock} />;
      case 'examples':
        return <ExamplesEditor block={editedBlock} onChange={setEditedBlock} />;
      case 'mathApproach':
        return <MathApproachEditor block={editedBlock} onChange={setEditedBlock} />;
      case 'codeBlock':
        return <CodeBlockEditor block={editedBlock} onChange={setEditedBlock} />;
      case 'complexityAnalysis':
        return <ComplexityAnalysisEditor block={editedBlock} onChange={setEditedBlock} />;
      case 'walkthrough':
        return <WalkthroughEditor block={editedBlock} onChange={setEditedBlock} />;
      case 'relatedProblems':
        return <RelatedProblemsEditor block={editedBlock} onChange={setEditedBlock} />;
      case 'tipsList':
        return <TipsListEditor block={editedBlock} onChange={setEditedBlock} />;
      case 'richText':
        return <RichTextEditor block={editedBlock} onChange={setEditedBlock} />;
      default:
        return <div>Unknown block type</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-lavender-200">
          <h3 className="text-lg font-semibold text-warmGray-800">
            Edit {blockTypeLabels[editedBlock.type]}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 text-warmGray-400 hover:text-warmGray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderEditor()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-lavender-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-warmGray-600 hover:text-warmGray-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center space-x-2 bg-gradient-to-r from-lavender-500 to-pink-500 hover:from-lavender-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200"
          >
            <Save className="w-4 h-4" />
            <span>Save Block</span>
          </button>
        </div>
      </div>
    </div>
  );
}
