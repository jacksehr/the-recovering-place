module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
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
      olive: {
        DEFAULT: "#41473C"
      }
    },
    extend: {
      boxShadow: {
        card: '1px 1px 4px #B9B9B9',
      },
      height: {
        card: '320px',
      },
      width: {
        card: '420px'
      },
      minWidth: {
        nav: "750px",
      },
      maxWidth: {
        nav: "1000px",
      },
      letterSpacing: {
        header: "0.075em",
      },
      fontFamily: {
        title: ["Glacial Indifference"],
        text: ["Assistant"],
      },
      fontSize: {
        '5xl': '2.5rem'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
