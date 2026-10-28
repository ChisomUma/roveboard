// Pin the project root: a stray package-lock.json in the home folder otherwise confuses Next.js.
const nextConfig = {
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
