import Link from 'next/link';
import { RelatedProblemsBlock as RelatedProblemsBlockType } from '@/types/blocks';

interface Props {
  block: RelatedProblemsBlockType;
}

export default function RelatedProblemsBlock({ block }: Props) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-warmGray-800 mb-4">Related Problems</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {block.items.map((problem, index) => {
          const content = (
            <>
              <h3 className="font-semibold text-warmGray-800 mb-2">{problem.title}</h3>
              <p className="text-sm text-warmGray-600">{problem.description}</p>
            </>
          );

          if (problem.slug) {
            return (
              <Link
                key={index}
                href={problem.slug}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-lavender-200 hover:border-lavender-300 transition-colors block"
              >
                {content}
              </Link>
            );
          }

          return (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-lavender-200"
            >
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
