import React from 'react';
import {
  Box,
  Center,
  ChakraProvider,
  Container,
  extendTheme,
  Flex,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FaDiscord, FaEthereum, FaTwitter } from 'react-icons/fa';
import { SiReadthedocs } from 'react-icons/si';

const theme = extendTheme({
  config: {
    cssVarPrefix: 'ck',
  },
});

// Do this at the root of your application
function App() {
  function a() {}
  return (
    <ChakraProvider theme={theme}>
      <Container>
        <Center>
          <Flex direction={'column'} alignItems={'center'}>
            <Box>BigDAOEnergy</Box>
            <Center>
              <HStack spacing='24px'>
                <Icon as={FaDiscord} />
                <Icon as={FaTwitter} />
                <Icon as={FaEthereum} />
                <Icon as={SiReadthedocs} />
              </HStack>
            </Center>
          </Flex>
        </Center>
      </Container>
    </ChakraProvider>
  );
}
export default App;
