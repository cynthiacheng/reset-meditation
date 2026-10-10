import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/brain-dump", destination: "/inner-dialogue", permanent: true },
      { source: "/brain-dump/todos", destination: "/inner-dialogue/todos", permanent: true },
    ];
  },
};

export default withSerwist(nextConfig);
