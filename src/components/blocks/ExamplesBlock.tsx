import { ExamplesBlock as ExamplesBlockType } from '@/types/blocks';

interface Props {
  block: ExamplesBlockType;
}

export default function ExamplesBlock({ block }: Props) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-warmGray-800 mb-4">Examples</h2>
      <div className="space-y-4">
        {block.items.map((example, index) => (
          <div
            key={index}
            className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-lavender-200"
          >
            <h3 className="font-semibold text-warmGray-800 mb-2">{example.title || `Example ${index + 1}:`}</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Input:</strong>{' '}
                <code className="bg-lavender-100 px-2 py-1 rounded">{example.input}</code>
              </p>
              <p>
                <strong>Output:</strong>{' '}
                <code className="bg-lavender-100 px-2 py-1 rounded">{example.output}</code>
              </p>
              {example.explanation && (
                <p>
                  <strong>Explanation:</strong> {example.explanation}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
