import React from 'react';

interface TitleProps {
  text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => <p className="font-title text-3xl uppercase tracking-h1 text-brown">${text}</p>

export default Title;