/* eslint-disable no-undef */
// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: { url: "/" },
  },
  plugins: [
    [
      "@snowpack/plugin-sass",
      {
        style: "compressed",
        sourceMap: false,
      },
    ],
    ["@snowpack/plugin-typescript"],
  ],
  optimize: {
    bundle: true,
    minify: true,
    target: "es2019",
  },
};
