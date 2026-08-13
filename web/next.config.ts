import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita o Turbopack inferir a raiz errada: este repo também tem um
  // package-lock.json na raiz (do app mobile React Native), fora de /web.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
