import { Box, BoxProps } from '@mui/material';
import React from 'react';

type PageProps = BoxProps;

function Page(props: PageProps, ref: React.Ref<unknown>) {
  return (
    <Box
      {...props}
      ref={ref}
      position="absolute"
      width={1}
      height={1}
      overflow="hidden auto"
    />
  );
}

export default React.forwardRef(Page);
