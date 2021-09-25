import type { Block, ChildPageBlock } from "@notionhq/client/build/src/api-types";

export const isChildPage = (block: Block): block is ChildPageBlock =>
  block.type === "child_page";