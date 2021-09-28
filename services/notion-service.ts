import { Client } from "@notionhq/client";
import type { Block, ChildPageBlock } from "@notionhq/client/build/src/api-types";

import { isChildPage } from "./util";

const blockCache = new Map<string, Block[]>();

function UseBlockCache(cache: Map<string, Block[]>) {
  return function(
    _target: Object,
    _propertyKey: string,
    propertyDescriptor: TypedPropertyDescriptor<(id: string) => Promise<any>>
  ) {
    const originalMethod = propertyDescriptor?.value;

    propertyDescriptor.value = async function(parentId: string) {
      const cachedBlocks = cache.get(parentId);
      if (cachedBlocks?.length) {
        return cachedBlocks as ChildPageBlock[];
      }

      const blocks = await originalMethod?.call(this, parentId) ?? [];
      cache.set(parentId, blocks);

      return blocks;
    };

    return propertyDescriptor;
  }
}

export class NotionService {
  constructor(private readonly client: Client) {}

  @UseBlockCache(blockCache)
  async getChildPages(parentId: string) {
    const children = await this.client.blocks.children.list({
      block_id: parentId
    });

    const childPageBlocks = children.results.filter(isChildPage);

    return childPageBlocks;
  }

  @UseBlockCache(blockCache)
  async getPageBlocks(pageId: string) {
    // @todo handle pagination
    const pageBlocks = await this.client.blocks.children.list({
      block_id: pageId,
    });

    return pageBlocks.results;
  }

  @UseBlockCache(blockCache)
  async getPage(pageId: string) {
    return this.client.pages.retrieve({ page_id: pageId });
  }
}
