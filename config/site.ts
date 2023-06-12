export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Access Protocol - Next.js",
  description:
    "Access Protocol Next.js starter repo with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Protected",
      href: "/protected",
    },
    {
      title: "Locked",
      href: "/locked",
    },
  ],
  links: {
    twitter: "https://twitter.com/AccessProtocol",
    github: "https://github.com/Access-Labs-Inc/next-js-starter",
    docs: "https://docs.accessprotocol.co",
  },
}
