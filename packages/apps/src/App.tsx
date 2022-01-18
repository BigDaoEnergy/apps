import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Web3Context, Web3ContextProvider } from './contexts';
import { theme } from './shared/theme';
import { About, Landing, Layout, RTFM, Team } from './pages';

// Do this at the root of your application
function App() {
  return (
    <BrowserRouter>
      <Web3ContextProvider>
        <ChakraProvider theme={theme}>
          <Web3Context.Consumer>
            {() => (
              <Layout>
                <Routes>
                  <Route path='/' element={<Landing />} />
                  <Route path='/about' element={<About />} />
                  <Route path='/team' element={<Team />} />
                  <Route path='/rtfm' element={<RTFM />} />
                </Routes>
              </Layout>
            )}
          </Web3Context.Consumer>
        </ChakraProvider>
      </Web3ContextProvider>
    </BrowserRouter>
  );
}
export default App;
