module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    minWidth: {
      nav: "750px",
    },
    maxWidth: {
      nav: "850px",
    },
    colors: {
      cream: {
        DEFAULT: "#FFFBF5",
        dark: "#F9F2EA",
      },
      pink: {
        light: "#E5C1C3",
        dark: "#B4555A",
      },
      brown: {
        DEFAULT: "#544332",
      },
    },
    extend: {
      letterSpacing: {
        h1: "0.075em",
      },
      fontFamily: {
        title: ["Glacial Indifference"],
        text: ["Assistant"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
