import React from "react";

interface TextProps {
  children: React.ReactText;
}

type Rem = number;

interface HeaderParams {
  size: `${number | ''}xl`;
  spaceBefore: Rem;
  spaceAfter: Rem;
  tracking?: string;
}

const headerFactory =
  ({ size, spaceBefore, spaceAfter, tracking = 'header' }: HeaderParams): React.FC<TextProps> =>
  ({ children }) =>
    (
      <p
        className={`font-title text-${size} uppercase tracking-${tracking} text-brown pt-${spaceBefore} pb-${spaceAfter}`}
      >
        {children}
      </p>
    );

const Header1 = headerFactory({ size: '5xl', spaceBefore: 14, spaceAfter: 8 });
const Header2 = headerFactory({ size: '3xl', spaceBefore: 14, spaceAfter: 8, tracking: 'wide' });
const Header3 = headerFactory({ size: 'xl', spaceBefore: 6, spaceAfter: 4, tracking: 'normal' });

const Paragraph: React.FC<TextProps> = ({ children }) => (
  <p className="font-text text-2xl text-brown text-left">{children}</p>
);

export { Header1, Header2, Header3, Paragraph };
