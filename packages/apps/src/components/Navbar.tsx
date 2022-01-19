import { Link, HStack, Heading } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { ConnectWeb3Button } from '.';
import { useWeb3Modal } from '../hooks';

const NavBar = () => {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  return (
    <HStack justifyContent={'space-between'}>
      <Link as={RouterLink} to='/' color='white' padding='30px'>
        <Heading>bigDAOenergy</Heading>
      </Link>
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
        <ConnectWeb3Button
          provider={provider}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
        />
      </HStack>
    </HStack>
  );
};

export default React.memo(NavBar);
