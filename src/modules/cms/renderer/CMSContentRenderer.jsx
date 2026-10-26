import { BLOCK_REGISTRY } from "./blockRegistry";
import ContentBlock from "./blocks/ContentBlock";

// primaryHeading: the first hero block becomes the page's single H1 (standalone CMS pages only).
export default function CMSContentRenderer({ cms, primaryHeading = false }) {
  if (!cms) return null;

  console.log("Renderer slug:", cms?.slug);
  console.log("Renderer content:", cms?.data?.blocks?.[0]?.data?.content);

  const blocks = cms?.data?.blocks || [];

  const firstHeroIndex = primaryHeading
    ? blocks.findIndex((block) => block?.type === "hero" && block?.data?.title)
    : -1;

  if (blocks.length) {
    return (
      <>
        {blocks.map((block, index) => {
          const Component = BLOCK_REGISTRY[block?.type] || ContentBlock;

          return (
            <Component
              key={index}
              data={block?.data}
              content={block?.data?.content}
              {...(index === firstHeroIndex ? { titleAs: "h1" } : {})}
            />
          );
        })}
      </>
    );
  }

  // legacy support
  const template = cms?.template;
  const data = cms?.data || {};

  const LegacyComponent = BLOCK_REGISTRY[template] || ContentBlock;

  return <LegacyComponent data={data} content={data?.content} />;
}
