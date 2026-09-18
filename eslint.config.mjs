import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  {
    ignores: [
      ".next/**",
      ".next.stale-*/**",
      "**/*.ecanceled-backup",
      "node_modules/**",
      "Product Animation/**",
      "public/product-animation/**",
      "tmp/**",
    ],
  },
];

export default eslintConfig;
