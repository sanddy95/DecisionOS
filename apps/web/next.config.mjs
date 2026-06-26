/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatar.vercel.sh' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
    ],
  },
}

export default nextConfig
