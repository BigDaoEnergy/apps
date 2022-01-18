import { Center, Container, Link, HStack } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

function Layout({ children }: Props) {
  return (
    <Container>
      <Center height={'100vh'}>
        <HStack>
          <Link as={RouterLink} to='/about'>
            About
          </Link>
        </HStack>
        {children}
      </Center>
    </Container>
  );
}

export default React.memo(Layout);
