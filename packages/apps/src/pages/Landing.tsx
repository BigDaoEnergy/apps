import { Web3Provider } from '@ethersproject/providers';
import React, { useCallback } from 'react';
import {
  Center,
  HStack,
  Heading,
  Icon,
  VStack,
  Text,
  Button,
} from '@chakra-ui/react';
import { FaDiscord, FaEthereum, FaTwitter } from 'react-icons/fa';
import { SiReadthedocs } from 'react-icons/si';

import { useWeb3Modal } from '../hooks';

function BluelistInput() {
  const [provider] = useWeb3Modal();
  const handleBluelist = useCallback(() => {}, []);

  return (
    <VStack justifyContent='center'>
      <Button
        className='button-secondary'
        disabled={!provider}
        onClick={() => handleBluelist()}
      >
        Bluelist Me!
      </Button>
    </VStack>
  );
}

function Landing() {
  return (
    <VStack direction={'column'} alignItems={'center'} width='240'>
      <Heading size='3xl' color='whiteAlpha.900' marginBottom='15px'>
        We build composable governance legos.
      </Heading>
      <BluelistInput />
      <Center>
        <HStack spacing='24px' marginTop='30'>
          <Icon as={FaDiscord} color='whiteAlpha.900' />
          <Icon as={FaTwitter} color='whiteAlpha.900' />
          <Icon as={FaEthereum} color='whiteAlpha.900' />
          <Icon as={SiReadthedocs} color='whiteAlpha.900' />
        </HStack>
      </Center>
    </VStack>
  );
}

export default React.memo(Landing);
