const config = {
  api: {
    url: process.env.NEXT_PUBLIC_API_URL,
  },
  accessTokenKey: process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || '__token__',
  seo: {
    name: 'NextJs',
    title: 'NextJs',
    titleTemplate: '%s | NextJs',
    description: '',
    url: '',
    image: '',
    socials: {
      twitter: '@xxx',
    },
  },
};

export default config;
