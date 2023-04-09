const config = {
  api: {
    url: process.env.NEXT_PUBLIC_API_URL,
  },
  accessTokenKey: process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || '__token__',
  seo: {
    name: 'Surge',
    title: 'Surge',
    titleTemplate: '%s | Surge',
    description: '',
    url: '',
    image: '',
    socials: {
      twitter: '@xxx',
    },
  },
};

export default config;
