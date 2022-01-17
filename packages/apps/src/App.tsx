
import { Box } from '@chakra-ui/react';
import React from 'react';

import { ChakraProvider } from "@chakra-ui/react"

// Do this at the root of your application
function App() {
  return <ChakraProvider><Box>
    hi
    </Box></ChakraProvider>
}
export default App;
