import React from 'react';
import {
  Center,
  ChakraProvider,
  Container,
  extendTheme,
  Flex,
  HStack,
  Heading,
  Icon,
  VStack,
} from '@chakra-ui/react';
import { FaDiscord, FaEthereum, FaTwitter } from 'react-icons/fa';
import { SiReadthedocs } from 'react-icons/si';

import { Web3ContextProvider } from './contexts';

const theme = extendTheme({
  config: {
    cssVarPrefix: 'ck',
  },
});

// Do this at the root of your application
function App() {
  return (
    <Web3ContextProvider>
      <ChakraProvider theme={theme}>
        <Container>
          <Center height={'100vh'}>
            <VStack direction={'column'} alignItems={'center'}>
              <Heading>BigDAOEnergy</Heading>
              <Center>
                <HStack spacing='24px'>
                  <Icon as={FaDiscord} />
                  <Icon as={FaTwitter} />
                  <Icon as={FaEthereum} />
                  <Icon as={SiReadthedocs} />
                </HStack>
              </Center>
            </VStack>
          </Center>
        </Container>
      </ChakraProvider>
    </Web3ContextProvider>
  );
}
export default App;
