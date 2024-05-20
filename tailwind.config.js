const REM_FACTOR = 0.25;

const spacing = Array.from(Array(1001).keys()).reduce(
  (acc, n) => ({ ...acc, [n]: `${n * REM_FACTOR}rem` }),
  {}
);

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.tsx", "./src/**/*.ts"],
  important: true,
  theme: {
    extend: {
      maxWidth: ({ theme }) => ({ ...theme("spacing"), "8xl": "90rem" }),
      spacing,
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
