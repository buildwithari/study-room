import { CodeBlockData } from '@/types/blocks';
import CodeBlock from '@/components/CodeBlock';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
  block: CodeBlockData;
}

export default function CodeSolutionBlock({ block }: Props) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-warmGray-800 mb-3 flex items-center space-x-2">
        {block.isOptimal ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <AlertCircle className="w-5 h-5 text-orange-500" />
        )}
        <span>{block.title}</span>
      </h3>
      <CodeBlock
        language={block.language}
        title={block.title}
        filename={block.filename}
      >
        {block.code}
      </CodeBlock>
    </div>
  );
}
