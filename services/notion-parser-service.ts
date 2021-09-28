import type { Client } from "@notionhq/client";

import type {
  Block,
  RichText,
  TitlePropertyValue,
} from "@notionhq/client/build/src/api-types";

import { NotionService } from "./notion-service";

export interface RenderableBlock {
  type:
    | "heading_1"
    | "heading_2"
    | "heading_3"
    | "paragraph"
    | "mention"
    | "title";
  text: string;
}

const NOTION_BASE_URL = "https://www.notion.so/";

export class NotionParserService {
  constructor(private readonly notionService: NotionService) {}

  async blockTransformer(block: Block): Promise<RenderableBlock[]> {
    const { type } = block;

    const renderableBlocks: RenderableBlock[] = [];

    switch (type) {
      case "heading_1":
      case "heading_2":
      case "heading_3":
      case "paragraph":
        // @ts-ignore; TypeScript can't work out that block[type] will always be present
        for (const richText of block[type].text) {
          const blocks = await this.richTextTransformer(richText, type);
          renderableBlocks.push(...blocks);
        }
    }

    return renderableBlocks;
  }

  private async richTextTransformer(
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
          return [{ type: parentType ?? "mention", text: plainText }];
        }

        const mentionedPageId = richText.href.replace(NOTION_BASE_URL, "");

        const [mentionedPage, mentionedBlocks] = await Promise.all([
          this.notionService.getPage(mentionedPageId),
          this.notionService.getPageBlocks(mentionedPageId),
        ]);

        const renderableBlocks: RenderableBlock[] = [];

        if (!mentionedPage?.properties?.title) return [];

        const titleRichText = (
          mentionedPage.properties.title as TitlePropertyValue
        ).title[0];

        renderableBlocks.push(
          ...(await this.richTextTransformer(titleRichText, "title"))
        );

        for (const mentionedBlock of mentionedBlocks) {
          renderableBlocks.push(
            ...(await this.blockTransformer(mentionedBlock))
          );
        }

        return renderableBlocks;
    }
  }
}
