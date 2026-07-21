import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "Product Animation/**",
      "public/product-animation/**",
    ],
  },
];

export default eslintConfig;
