import React from 'react';

type DefaultGuardProps = React.PropsWithChildren<unknown>;

function DefaultGuard({ children }: DefaultGuardProps) {
  return <React.Fragment>{children}</React.Fragment>;
}

export default DefaultGuard;
