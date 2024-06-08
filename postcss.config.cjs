module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    // Prefixing all
    require("postcss-prefix-selector")({
      prefix: ".dev-error-boundary",
      transform(prefix, selector, prefixedSelector) {
        if (selector.includes("dev-error-boundary")) return selector;

        // Handle special cases for global selectors like body, html, etc.
        if (/^(body|html|:root)/.test(selector)) {
          return selector.replace(/^(body|html|:root)/, `$1 ${prefix}`);
        }

        // if (!selector.startsWith(".dark")) {
        //   console.log({ prefix, selector, prefixedSelector });
        //   return `${prefix} .light ${selector}`;
        // }

        return prefixedSelector;
      },
    }),
  ],
};
