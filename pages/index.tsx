import { Client as NotionClient } from "@notionhq/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import Masthead from "../components/masthead";
import NavBar from "../components/navbar";
import { Header1, Header2, Paragraph } from "../components/headers";

import {
  NotionParserService,
  RenderableBlock,
} from "../services/notion-parser-service";

import greenBg from "../public/plant-bg.png";
import { NotionService } from "../services/notion-service";
import React, { AnchorHTMLAttributes } from "react";
import { Cards } from "../components/cards";

const HOME_PAGE_NAME = "Home";

interface HomePageProps {
  allPages: { title: string; id: string }[];
  content: RenderableBlock[][];
}

// identify what the block group is
// render each part
const renderContent = (content: HomePageProps["content"]): JSX.Element[] => {
  const elementsToRender: JSX.Element[] = [];

  const renderMap: { [key in RenderableBlock["type"]]?: React.FC<any> } = {
    heading_1: Header1,
    heading_2: Header2,
    heading_3: Header2,
    paragraph: Paragraph,
  };

  if (!content?.length) return elementsToRender;

  let i = 0;
  while (i < content.length) {
    const blockGroup = content[i++];

    if (!blockGroup?.length) {
      continue;
    }

    const [{ type, text }] = blockGroup;

    // @todo make this recursive i.e. not shit
    if (text.startsWith("#")) {
      const renderDirective = text.replace(/^#/, "");
      if (renderDirective === "cards") {
        let nextRenderDirective = "";

        const cardBlocks: RenderableBlock[][] = [];

        while (nextRenderDirective !== "end_cards") {
          const nextBlock = content[i++];

          if (!nextBlock?.length) { continue; }

          const [{ text: nextBlockText }] = nextBlock;

          if (nextBlockText.startsWith("#")) {
            nextRenderDirective = nextBlockText.replace(/^#/, "");
          } else {
            cardBlocks.push(nextBlock);
          }
        }

        elementsToRender.push(<Cards key={i} cards={cardBlocks} />);
      }
    } else {
      const Component = renderMap[type];
      if (Component) {
        elementsToRender.push(<Component key={i}>{text}</Component>);
      }
    }
  }

  return elementsToRender;
};

// `onClick`, `href`, and `ref` need to be passed to the DOM element
// for proper handling
const MyButton = React.forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<{}>>(({ onClick, href }, ref) => {
  return (
    <a href={href} onClick={onClick} ref={ref}>
      Click Me
    </a>
  )
})

function Button() {
  return (
    <Link href="/" passHref>
      <MyButton />
    </Link>
  )
}

const Home: NextPage<HomePageProps> = (props) => {
  const { allPages, content } = props;

  const renderedContent = renderContent(content);

  return (
    <>
      <Head>
        <title>The Recovering Place</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Assistant&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="bg-cream">
        <Masthead />
        <NavBar navItems={allPages.map(({ title }) => title)} />
        <div className="relative h-auto">
          <Image
            src={greenBg}
            layout="fill"
            objectFit="cover"
            placeholder="blur"
          />
          <div className="relative h-full w-4/5 pt-16 m-auto">
            <div className="flex-col bg-cream-dark bg-opacity-80 h-full text-center pb-16 px-36 max-w-6xl m-auto">
              {renderedContent}
              <Button/>
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-60 bg-olive shadow-inner">

      </div>
    </>
  );
};

export async function getStaticProps(): Promise<{ props: HomePageProps }> {
  const notionClient = new NotionClient({
    auth: process.env.NOTION_TOKEN,
  });

  const notionService = new NotionService(notionClient);
  const notionParser = new NotionParserService(notionService);

  const allChildPages = await notionService.getChildPages(
    process.env.NOTION_SITEMAP_ID!
  );

  const allPages = allChildPages.map(({ id, child_page: { title } }) => ({
    title,
    id,
  }));

  const homepageId = allPages.find(({ title }) => title === HOME_PAGE_NAME)?.id;
  if (!homepageId) throw new Error("Home content not found");

  const homepageBlocks = await notionService.getPageBlocks(homepageId);

  const content = await Promise.all(
    homepageBlocks.map(async (block) => notionParser.blockTransformer(block))
  );

  return { props: { allPages, content } };
}

export default Home;
