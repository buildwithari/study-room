'use client';

import { MathApproachBlock as MathApproachBlockType } from '@/types/blocks';
import MathBlock from '@/components/MathBlock';

interface Props {
  block: MathApproachBlockType;
}

export default function MathApproachBlock({ block }: Props) {
  // Parse content to extract text and math expressions
  // Format: Regular text with $inline$ or $$block$$ math
  const renderContent = (content: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let partIndex = 0;

    // Match both $$block$$ and $inline$ patterns
    const regex = /\$\$([^$]+)\$\$|\$([^$]+)\$/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(
          <span key={partIndex++}>{content.slice(lastIndex, match.index)}</span>
        );
      }

      // Add the math expression
      if (match[1]) {
        // Block math ($$...$$)
        parts.push(
          <MathBlock key={partIndex++} display={true}>
            {match[1]}
          </MathBlock>
        );
      } else if (match[2]) {
        // Inline math ($...$)
        parts.push(
          <MathBlock key={partIndex++} display={false}>
            {match[2]}
          </MathBlock>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(<span key={partIndex++}>{content.slice(lastIndex)}</span>);
    }

    return parts;
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-warmGray-800 mb-4">Mathematical Approach</h2>
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-lavender-200">
        <div className="text-warmGray-700 leading-relaxed">
          {renderContent(block.content)}
        </div>
      </div>
    </section>
  );
}
