import Image from "next/image";
import React from "react";

import dieteticsCardThumbnail from "../public/dietetics-service.jpg";
import eatingDisorderCardThumbnail from "../public/eating-disorder-card.jpg";
import { RenderableBlock } from "../services/notion-parser-service";
import { Header3 } from "./headers";

interface CardProps {
  title: string;
  description: string;
  imageData: StaticImageData;
}

interface CardsProps {
  cards: RenderableBlock[][];
}

const CARD_IMAGE_MAP: Record<string, StaticImageData> = {
  "Specialist Eating Disorder Treatment": eatingDisorderCardThumbnail,
  "Dietetic Services": dieteticsCardThumbnail,
};

const Card: React.FC<CardProps> = ({ title, description, imageData }) => {
  return (
    <div className="w-card bg-white rounded shadow-md p-6 text-left">
      <div className="h-48 relative overflow-hidden">
        <Image className="rounded" src={imageData} placeholder="blur" />
      </div>
      <Header3>{title}</Header3>
      <div className="font-text text-brown">{description}</div>
    </div>
  );
};

const Cards: React.FC<CardsProps> = ({ cards }) => {
  const parsedCards: CardProps[] = cards.map(
    ([{ text: title }, { text: description }]) => ({
      title,
      description,
      imageData: CARD_IMAGE_MAP[title],
    })
  );

  return (
    <div className="flex justify-between m-auto">
      {parsedCards.map(({ title, ...cardProps }) => (
        <Card key={title} title={title} {...cardProps} />
      ))}
    </div>
  );
};

export { Cards };