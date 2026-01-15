// Block type definitions for the article editor

export type BlockType =
  | 'problemStatement'
  | 'examples'
  | 'mathApproach'
  | 'codeBlock'
  | 'complexityAnalysis'
  | 'walkthrough'
  | 'relatedProblems'
  | 'tipsList'
  | 'richText';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface ProblemStatementBlock extends BaseBlock {
  type: 'problemStatement';
  content: string; // HTML content with inline code
}

export interface Example {
  title: string;
  input: string;
  output: string;
  explanation?: string;
}

export interface ExamplesBlock extends BaseBlock {
  type: 'examples';
  items: Example[];
}

export interface MathApproachBlock extends BaseBlock {
  type: 'mathApproach';
  content: string; // Text content with LaTeX markers: $inline$ or $$block$$
}

export interface CodeBlockData extends BaseBlock {
  type: 'codeBlock';
  language: string;
  title: string;
  filename?: string;
  code: string;
  isOptimal?: boolean; // Shows green checkmark if true
}

export interface ComplexityItem {
  approach: string;
  time: string;
  space: string;
}

export interface ComplexityAnalysisBlock extends BaseBlock {
  type: 'complexityAnalysis';
  items: ComplexityItem[];
}

export interface WalkthroughStep {
  step: number;
  content: string;
}

export interface WalkthroughBlock extends BaseBlock {
  type: 'walkthrough';
  title?: string;
  description?: string;
  steps: WalkthroughStep[];
}

export interface RelatedProblem {
  title: string;
  description: string;
  slug?: string;
}

export interface RelatedProblemsBlock extends BaseBlock {
  type: 'relatedProblems';
  items: RelatedProblem[];
}

export interface TipsListBlock extends BaseBlock {
  type: 'tipsList';
  title: string;
  variant: 'tips' | 'warnings' | 'notes'; // Different styling
  items: string[];
}

export interface RichTextBlock extends BaseBlock {
  type: 'richText';
  title?: string;
  content: string; // HTML content
}

export type Block =
  | ProblemStatementBlock
  | ExamplesBlock
  | MathApproachBlock
  | CodeBlockData
  | ComplexityAnalysisBlock
  | WalkthroughBlock
  | RelatedProblemsBlock
  | TipsListBlock
  | RichTextBlock;
