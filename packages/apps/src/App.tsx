import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { theme } from './shared/theme';
import { About, Landing, Layout, RTFM, Team } from './pages';

// Do this at the root of your application
function App() {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Layout>
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/about' element={<About />} />
            <Route path='/team' element={<Team />} />
            <Route path='/rtfm' element={<RTFM />} />
          </Routes>
        </Layout>
      </ChakraProvider>
    </BrowserRouter>
  );
}
export default App;
