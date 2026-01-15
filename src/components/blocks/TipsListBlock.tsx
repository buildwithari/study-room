import { TipsListBlock as TipsListBlockType } from '@/types/blocks';

interface Props {
  block: TipsListBlockType;
}

export default function TipsListBlock({ block }: Props) {
  const variantStyles = {
    tips: 'bg-gradient-to-r from-lavender-50 to-pink-50 border-lavender-200',
    warnings: 'bg-red-50 border-red-200',
    notes: 'bg-blue-50 border-blue-200',
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-warmGray-800 mb-4">{block.title}</h2>
      <div className={`rounded-xl p-6 border ${variantStyles[block.variant]}`}>
        <ul className="space-y-2 text-warmGray-700">
          {block.items.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
