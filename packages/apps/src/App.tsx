import React from 'react';
import { Center, ChakraProvider, Container } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Web3Context, Web3ContextProvider } from './contexts';
import { theme } from './shared/theme';
import Landing from './pages/Landing';

// Do this at the root of your application
function App() {
  return (
    <BrowserRouter>
      <Web3ContextProvider>
        <ChakraProvider theme={theme}>
          <Web3Context.Consumer>
            {() => (
              <Container>
                <Center height={'100vh'}>
                  <Routes>
                    <Route path='/' element={<Landing />} />
                    <Route path='/about' element={<Landing />} />
                    <Route path='/team' element={<Landing />} />
                    <Route path='/rtfm' element={<Landing />} />
                  </Routes>
                </Center>
              </Container>
            )}
          </Web3Context.Consumer>
        </ChakraProvider>
      </Web3ContextProvider>
    </BrowserRouter>
  );
}
export default App;
