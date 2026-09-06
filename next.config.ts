import type { NextConfig } from "next";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === "true";
const isUserOrOrganizationSite = repositoryName.endsWith(".github.io");
const basePath = isGitHubPagesBuild && repositoryName && !isUserOrOrganizationSite
  ? `/${repositoryName}`
  : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1"],
  experimental: {
    // The compiler API avoids ANSI-wrapped `tsc --showConfig` output in CI shells.
    useTypeScriptCli: false,
  },
};

export default nextConfig;
