import { Center, Container } from '@chakra-ui/react';
import React from 'react';
import Navbar from '../components/Navbar';

interface Props {
  children: React.ReactNode;
}

function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      <Container>
        <Center height={'91.4vh'}>{children}</Center>
      </Container>
    </>
  );
}

export default React.memo(Layout);
