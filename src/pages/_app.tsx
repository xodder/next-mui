import { CacheProvider, EmotionCache } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import {
  Hydrate,
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from '@tanstack/react-query';
import { PopupIsh } from '@xod/mui-popupish';
import { AppProps as NextAppProps } from 'next/app';
import ErrorPresenter from '~/components/generics/error-presenter';
import DefaultLayout from '~/components/layouts/default-layout';
import DefaultGuard from '~/guards/default-guard';
import defineComponent from '~/helpers/define-component';
import theme from '~/theme';
import { RecordLike } from '~/types';
import AppStateProvider from '~/utils/app-state';
import createEmotionCache from '~/utils/create-emotion-cache';
import useConstant from '~/utils/use-constant';

type AppProps = Omit<NextAppProps, 'Component' | 'pageProps'> & {
  emotionCache: EmotionCache;
  Component: Component;
  pageProps: RecordLike<{
    __state__?: unknown;
  }>;
};

type Component = NextAppProps['Component'] & {
  Layout?: never;
  Guard?: never;
};

const __emotionCache = createEmotionCache(); // used on the client

const __queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
};

function App({ emotionCache = __emotionCache, ...props }: AppProps) {
  const queryClient = useConstant(() => new QueryClient(__queryClientConfig));
  const __state__ = props.pageProps.__state__;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <QueryClientProvider client={queryClient}>
          <Hydrate state={__state__}>
            <AppStateProvider>
              <ErrorPresenter>
                <ActivePage {...props} />
              </ErrorPresenter>
            </AppStateProvider>
          </Hydrate>
        </QueryClientProvider>
        <PopupIsh />
      </ThemeProvider>
    </CacheProvider>
  );
}

type ActivePageProps = Omit<AppProps, 'emotionCache'>;

function ActivePage({ Component, pageProps }: ActivePageProps) {
  const Layout = defineComponent(Component.Layout || DefaultLayout, {});
  const Guard = defineComponent(Component.Guard || DefaultGuard, {});

  return (
    <Guard.Component {...Guard.props}>
      <Layout.Component {...Layout.props}>
        <Component {...pageProps} />
      </Layout.Component>
    </Guard.Component>
  );
}

export default App;
