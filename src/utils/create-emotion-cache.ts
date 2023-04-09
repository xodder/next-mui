import createCache from '@emotion/cache';

const isBrowser = typeof document !== 'undefined';

function createEmotionCache() {
  const insertionPoint =
    (isBrowser &&
      document.querySelector<HTMLMetaElement>(
        'meta[name="emotion-insertion-point"]'
      )) ||
    undefined;

  return createCache({ key: 'mui-style', insertionPoint });
}

export default createEmotionCache;
