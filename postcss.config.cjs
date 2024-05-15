module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    require("postcss-prefix-selector")({
      prefix: ".dev-error-boundary",
      transform: function (prefix, selector, prefixedSelector) {
        if (selector === "html") {
          return prefix;
        }

        if (selector === "body") {
          return prefix + " " + selector;
        }

        return prefixedSelector;
      },
    }),
  ],
};
