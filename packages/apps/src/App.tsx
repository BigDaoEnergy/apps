import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { theme } from './shared/theme';
import { About, Landing, Layout, Team } from './pages';
import { BDEContextProvider } from './contexts/BDEContext';

// Do this at the root of your application
function App() {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <BDEContextProvider>
          <Layout>
            <Routes>
              <Route path='/' element={<Landing />} />
              <Route path='/about' element={<About />} />
              <Route path='/team' element={<Team />} />
            </Routes>
          </Layout>
        </BDEContextProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
}
export default App;
