import {
  Button,
  Center,
  Container,
  Link,
  HStack,
  Text,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Web3Context } from '../contexts';

const NavBar = () => {
  const { connectWallet, provider } = useContext(Web3Context);

  return (
    <HStack spacing='14' justifyContent='flex-end' padding='30px'>
      <Link as={RouterLink} to='/about' color='white'>
        About
      </Link>
      <Link as={RouterLink} to='/team' color='white'>
        Team
      </Link>
      <Link as={RouterLink} to='/rtfm' color='white'>
        RTFM
      </Link>

      {!!provider ? (
        <Text color='whiteAlpha.900'>Connected as: {}</Text>
      ) : (
        <Button onClick={() => connectWallet}>Connect Wallet</Button>
      )}
    </HStack>
  );
};

interface Props {
  children: React.ReactNode;
}

function Layout({ children }: Props) {
  return (
    <>
      <NavBar />
      <Container>
        <Center height={'91.4vh'}>{children}</Center>
      </Container>
    </>
  );
}

export default React.memo(Layout);