import { WalkthroughBlock as WalkthroughBlockType } from '@/types/blocks';

interface Props {
  block: WalkthroughBlockType;
}

export default function WalkthroughBlock({ block }: Props) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-warmGray-800 mb-4">
        {block.title || 'Step-by-Step Walkthrough'}
      </h2>
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-lavender-200">
        {block.description && (
          <p className="text-warmGray-700 mb-4">{block.description}</p>
        )}

        <div className="space-y-3">
          {block.steps.map((step) => (
            <div key={step.step} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm flex-shrink-0">
                {step.step}
              </div>
              <div className="text-warmGray-700 pt-1">{step.content}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
