import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1"],
  experimental: {
    // The compiler API avoids ANSI-wrapped `tsc --showConfig` output in CI shells.
    useTypeScriptCli: false,
  },
};

export default nextConfig;
