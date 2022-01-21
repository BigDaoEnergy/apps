import { Link, HStack, Heading, Image } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { ConnectWeb3Button } from '.';
import { useWeb3Modal } from '../hooks';

const NavBar = () => {
  const { provider, loadWeb3Modal, logoutOfWeb3Modal } = useWeb3Modal();

  return (
    <HStack justifyContent={'space-between'}>
      <Link as={RouterLink} to='/' color='white' padding='30px'>
        <Image src={'white-logo.png'} width='250px' />
      </Link>
      <HStack spacing='14' justifyContent='flex-end' padding='30px'>
        <Link as={RouterLink} to='/about' color='white'>
          About
        </Link>
        <Link as={RouterLink} to='/team' color='white'>
          Team
        </Link>
        <Link
          as={RouterLink}
          to={{
            pathname: 'https://bigdaoenergy.gitbook.io/',
          }}
          target='_blank'
          color='white'
        >
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
