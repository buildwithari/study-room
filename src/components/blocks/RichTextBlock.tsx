import { RichTextBlock as RichTextBlockType } from '@/types/blocks';

interface Props {
  block: RichTextBlockType;
}

export default function RichTextBlock({ block }: Props) {
  return (
    <section className="mb-8">
      {block.title && (
        <h2 className="text-2xl font-semibold text-warmGray-800 mb-4">{block.title}</h2>
      )}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-lavender-200">
        <div
          className="text-warmGray-700 leading-relaxed prose prose-code:bg-lavender-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm"
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      </div>
    </section>
  );
}
