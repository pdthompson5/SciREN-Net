// /** @type {import('next').NextConfig} */
// // const nextConfig = {
// //   reactStrictMode: true,
// //   images: {
// //     domains: ["github.com"],
// //   },
// // }

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        // port: '443',
        // pathname: '/*'
      },
    ],
  },
}