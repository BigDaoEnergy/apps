import React, { useEffect, useState } from 'react';
import {
  Button,
  Center,
  ChakraProvider,
  Container,
  HStack,
  Heading,
  Icon,
  VStack,
} from '@chakra-ui/react';

import { Web3Context, Web3ContextProvider } from './contexts';
import { theme } from './shared/theme';
import Landing from './pages/Landing';

// Do this at the root of your application
function App() {
  return (
    <Web3ContextProvider>
      <ChakraProvider theme={theme}>
        <Web3Context.Consumer>
          {() => (
            <Container>
              <Center height={'100vh'}>
                <Landing />
              </Center>
            </Container>
          )}
        </Web3Context.Consumer>
      </ChakraProvider>
    </Web3ContextProvider>
  );
}
export default App;
