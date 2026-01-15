import { Block } from '@/types/blocks';
import ProblemStatementBlock from './ProblemStatementBlock';
import ExamplesBlock from './ExamplesBlock';
import MathApproachBlock from './MathApproachBlock';
import CodeSolutionBlock from './CodeSolutionBlock';
import ComplexityAnalysisBlock from './ComplexityAnalysisBlock';
import WalkthroughBlock from './WalkthroughBlock';
import RelatedProblemsBlock from './RelatedProblemsBlock';
import TipsListBlock from './TipsListBlock';
import RichTextBlock from './RichTextBlock';

interface BlockRendererProps {
  block: Block;
}

export default function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case 'problemStatement':
      return <ProblemStatementBlock block={block} />;
    case 'examples':
      return <ExamplesBlock block={block} />;
    case 'mathApproach':
      return <MathApproachBlock block={block} />;
    case 'codeBlock':
      return <CodeSolutionBlock block={block} />;
    case 'complexityAnalysis':
      return <ComplexityAnalysisBlock block={block} />;
    case 'walkthrough':
      return <WalkthroughBlock block={block} />;
    case 'relatedProblems':
      return <RelatedProblemsBlock block={block} />;
    case 'tipsList':
      return <TipsListBlock block={block} />;
    case 'richText':
      return <RichTextBlock block={block} />;
    default:
      return null;
  }
}
