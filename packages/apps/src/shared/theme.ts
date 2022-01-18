import { extendTheme } from '@chakra-ui/react';
import { createBreakpoints, mode } from '@chakra-ui/theme-tools';

const breakpoints = createBreakpoints({
  sm: '320px',
  md: '768px',
  lg: '960px',
  xl: '1200px',
  '2xl': '1536px',
});

const theme = extendTheme({
  breakpoints,
  config: {
    cssVarPrefix: 'ck',
  },
  styles: {
    global: (props: any) => ({
      body: {
        fontFamily: 'body',
        color: mode('gray.800', 'whiteAslpha.900')(props),
        bgGradient:
          'linear(to-tr, rgba(9,0,158,1) 0%, rgba(121,0,255,1) 35%, rgba(0,212,255,1) 100%)',
        lineHeight: 'base',
      },
      button: {
        bg: mode('#548CFF', 'gray.800')(props),
      },
      '*::placeholder': {
        color: mode('gray.400', 'whiteAlpha.400')(props),
      },
      '*, *::before, &::after': {
        borderColor: mode('gray.200', 'whiteAlpha.300')(props),
        wordWrap: 'break-word',
      },
    }),
  },
});

export { breakpoints, theme };
