import React from 'react';
import Page from '~/components/shared/page';

type PublicLayoutProps = React.PropsWithChildren<unknown>;

function PublicLayout({ children }: PublicLayoutProps) {
  return <Page>{children}</Page>;
}

export default PublicLayout;
