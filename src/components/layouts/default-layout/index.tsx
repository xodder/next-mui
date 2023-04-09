import React from 'react';
import Page from '~/components/shared/page';

type DefaultLayoutProps = React.PropsWithChildren<unknown>;

function DefaultLayout({ children }: DefaultLayoutProps) {
  return <Page>{children}</Page>;
}

export default DefaultLayout;
