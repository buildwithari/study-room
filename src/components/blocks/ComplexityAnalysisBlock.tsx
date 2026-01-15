import { ComplexityAnalysisBlock as ComplexityAnalysisBlockType } from '@/types/blocks';
import { Clock, BookOpen } from 'lucide-react';

interface Props {
  block: ComplexityAnalysisBlockType;
}

export default function ComplexityAnalysisBlock({ block }: Props) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-warmGray-800 mb-4">Complexity Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-lavender-200">
          <h3 className="font-semibold text-warmGray-800 mb-3 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-lavender-500" />
            <span>Time Complexity</span>
          </h3>
          <div className="space-y-2">
            {block.items.map((item, index) => (
              <p key={index} className="text-warmGray-700">
                <strong>{item.approach}:</strong>{' '}
                <code className="bg-lavender-100 px-2 py-1 rounded">{item.time}</code>
              </p>
            ))}
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-lavender-200">
          <h3 className="font-semibold text-warmGray-800 mb-3 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-pink-500" />
            <span>Space Complexity</span>
          </h3>
          <div className="space-y-2">
            {block.items.map((item, index) => (
              <p key={index} className="text-warmGray-700">
                <strong>{item.approach}:</strong>{' '}
                <code className="bg-lavender-100 px-2 py-1 rounded">{item.space}</code>
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
