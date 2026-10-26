/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the dashboard runs on GitHub Pages with no server.
  // PAGES_BASE_PATH is "/defi-dashboard" for the Pages build and empty locally.
  output: "export",
  basePath: process.env.PAGES_BASE_PATH || "",
};
module.exports = nextConfig;
