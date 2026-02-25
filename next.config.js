/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? "/legacytoai" : "",
  assetPrefix: isGitHubPages ? "/legacytoai/" : "",
};

module.exports = nextConfig;
