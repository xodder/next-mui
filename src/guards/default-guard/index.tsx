import React from 'react';

type DefaultGuardProps = React.PropsWithChildren<unknown>;

function DefaultGuard({ children }: DefaultGuardProps) {
  return <>{children}</>;
}

export default DefaultGuard;
