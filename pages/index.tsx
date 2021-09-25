import { Client as NotionClient } from "@notionhq/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import Masthead from "../components/masthead";
import NavBar from "../components/navbar";

import {
  NotionParserService,
  RenderableBlock,
} from "../services/notion-parser-service";

import greenBg from "../public/plant-bg.png";
import { NotionService } from "../services/notion-service";

const HOME_PAGE_NAME = "Home";

interface HomePageProps {
  allPages: { title: string; id: string }[];
  content: RenderableBlock[][];
}

const Home: NextPage<HomePageProps> = (props) => {
  const { allPages, content } = props;

  return (
    <>
      <Head>
        <title>The Recovering Place</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Assistant&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="bg-cream relative h-screen v-screen">
        <Masthead />
        <NavBar navItems={allPages.map(({ title }) => title)} />
        <div className="relative h-5/6">
          <Image
            src={greenBg}
            layout="fill"
            objectFit="cover"
            placeholder="blur"
          />
          <div className="relative h-full w-4/5 m-auto pt-16">
            <div className="flex-col bg-cream-dark bg-opacity-80 h-full text-center py-16 px-24">
              <p className="font-title text-3xl uppercase tracking-h1 text-brown">
                Start your recovery with us
              </p>
              <p
                className="font-text text-base text-brown text-left pt-6 mb-12
              "
              >
                The Recovering Place is a Dietitian Service built to support
                healthy relationships with food and body. We offer nutrition
                assessment and support at our clinics located across Greater
                Sydney, as well as consults online in the comfort of your own
                home.
              </p>

              <p className="font-title text-2xl uppercase tracking-h1 text-brown">
                Our Services
              </p>
              <p
                className="font-text text-base text-brown text-left pt-6
              "
              >
                The Recovering Place is a Dietitian Service built to support
                healthy relationships with food and body. We offer nutrition
                assessment and support at our clinics located across Greater
                Sydney, as well as consults online in the comfort of your own
                home.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getStaticProps(): Promise<{ props: HomePageProps }> {
  const notionClient = new NotionClient({
    auth: process.env.NOTION_TOKEN,
  });

  const notionService = new NotionService(notionClient);
  const parser = new NotionParserService(notionClient);

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
    homepageBlocks.flatMap(async (block) => parser.blockTransformer(block))
  );

  return { props: { allPages, content } };
}

export default Home;
