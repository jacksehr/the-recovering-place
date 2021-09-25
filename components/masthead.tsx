import type { FC } from "react";

import Image from "next/image";
import mastheadSVG from "../public/masthead.svg";

const Masthead: FC = () => (
  <div className="flex-col text-center pt-14">
    <Image src={mastheadSVG} width="575" height="175" />
  </div>
);

export default Masthead;