import { EmotionCache } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import NextDocument, {
  DocumentContext,
  DocumentProps as NextDocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import theme from '~/theme';
import createEmotionCache from '~/utils/create-emotion-cache';

type DocumentProps = NextDocumentProps & {
  emotionStyleTags: JSX.Element[];
};

class Document extends NextDocument<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const cache = createEmotionCache();
    const originalRenderPageFn = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPageFn({
        enhanceApp: (App: any) =>
          function EnhancedApp(props) {
            return <App emotionCache={cache} {...props} />;
          },
      });

    const initialProps = await NextDocument.getInitialProps(ctx);

    return {
      ...initialProps,
      emotionStyleTags: getEmotionStyleTagsFromHTML(initialProps.html, cache),
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link rel="icon" type="image/png" href="/favicon.ico" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          <meta name="emotion-insertion-point" content="" />
          {this.props.emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

function getEmotionStyleTagsFromHTML(html: string, cache: EmotionCache) {
  const emotionServer = createEmotionServer(cache);
  const extractedData = emotionServer.extractCriticalToChunks(html);

  return extractedData.styles.map((style) => (
    <style
      key={style.key}
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));
}

export default Document;
