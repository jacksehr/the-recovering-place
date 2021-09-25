import React from 'react';

interface NavBarProps {
  navItems: string[];
}

const NavBar: React.FC<NavBarProps> = ({ navItems }) => (
  <div className="flex justify-around pt-16 max-w-nav min-w-nav m-auto mb-6">
    {navItems?.map((item, index) => (
      <span key={index} className="font-title text-2xl uppercase text-pink-dark">
        {item}
      </span>
    ))}
  </div>
);

export default NavBar;