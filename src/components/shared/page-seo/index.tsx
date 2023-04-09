import config from '~/config';
import Head from 'next/head';
import React from 'react';

type PageSEOProps = Partial<{
  type: string;
  title: string;
  description: string;
  image: string;
  url: string;
  children: React.ReactNode;
}>;

const defaults = config.seo;

function PageSEO({
  type,
  title = defaults.title,
  description = defaults.description,
  image = defaults.image,
  url = defaults.url,
  children,
}: PageSEOProps) {
  const __title = config.seo.titleTemplate.replace('%s', title);

  return (
    <Head>
      <title>{__title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={url} />

      <meta property="twitter:card" content="summary" />
      <meta property="twitter:site" content={defaults.socials.twitter} />
      <meta property="twitter:title" content={__title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      <meta property="og:site_name" content={defaults.name} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={__title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {children}
    </Head>
  );
}

export default PageSEO;
