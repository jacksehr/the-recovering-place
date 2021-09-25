import type { Client } from "@notionhq/client";

import type {
  Block,
  RichText,
  TitlePropertyValue,
} from "@notionhq/client/build/src/api-types";

export interface RenderableBlock {
  type: "heading_1" | "heading_2" | "heading_3" | "paragraph" | "card_title";
  text: string;
}

const NOTION_BASE_URL = "https://www.notion.so/";

export class NotionParserService {
  private blockCache: Map<string, RenderableBlock[]> = new Map();

  constructor(private readonly client: Client) {}

  async blockTransformer(block: Block): Promise<RenderableBlock[]> {
    const { id, type } = block;

    const cachedBlocks = this.blockCache.get(id);
    if (cachedBlocks?.length) {
      return cachedBlocks;
    }

    switch (type) {
      case "heading_1":
      case "heading_2":
      case "paragraph":
        const renderableBlocks: RenderableBlock[] = [];

        // @ts-ignore; TypeScript can't work out that block[type] will always be present
        for (const richText of block[type].text) {
          const blocks = await this.richTextTransformer(richText, type);
          this.blockCache.set(id, blocks);
          renderableBlocks.push(...blocks);
        }

        return renderableBlocks;
    }

    return [];
  }

  async richTextTransformer(
    richText: RichText,
    parentType?: RenderableBlock["type"]
  ): Promise<RenderableBlock[]> {
    const { type, plain_text: plainText } = richText;

    switch (type) {
      case "text":
      case "equation":
        return [{ type: parentType ?? "paragraph", text: plainText }];
      case "mention":
        if (!richText?.href) {
          return [{ type: parentType ?? "paragraph", text: plainText }];
        }

        const mentionedPageId = richText.href.replace(NOTION_BASE_URL, "");

        const [mentionedPage, mentionedBlocks] = await Promise.all([
          this.client.pages.retrieve({ page_id: mentionedPageId }),
          this.client.blocks.children.list({
            block_id: mentionedPageId,
          }),
        ]);

        const renderableBlocks: RenderableBlock[] = [];

        const titleRichText = (
          mentionedPage.properties.title as TitlePropertyValue
        ).title[0];

        renderableBlocks.push(
          ...await this.richTextTransformer(titleRichText, "card_title")
        );

        for (const mentionedBlock of mentionedBlocks.results) {
          renderableBlocks.push(...await this.blockTransformer(mentionedBlock));
        }

        return renderableBlocks;
    }
  }
}
