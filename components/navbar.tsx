import React from "react";

interface NavBarProps {
  navItems: string[];
}

const NavBar: React.FC<NavBarProps> = ({ navItems }) => (
  <div className="w-full bg-cream mt-6 pb-6 sticky top-0 z-10 shadow-sm">
    <div className="flex justify-around pt-8 max-w-nav min-w-nav m-auto">
      {navItems?.map((item, index) => (
        <span
          key={index}
          className="font-title text-2xl uppercase text-pink-dark"
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);

export default NavBar;
