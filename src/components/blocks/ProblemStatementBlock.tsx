import { ProblemStatementBlock as ProblemStatementBlockType } from '@/types/blocks';

interface Props {
  block: ProblemStatementBlockType;
}

export default function ProblemStatementBlock({ block }: Props) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-warmGray-800 mb-4">Problem Statement</h2>
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-lavender-200">
        <div
          className="text-warmGray-700 leading-relaxed prose prose-code:bg-lavender-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none"
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      </div>
    </section>
  );
}
