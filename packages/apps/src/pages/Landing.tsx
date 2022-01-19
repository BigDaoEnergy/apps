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

interface Props {
  provider?: Web3Provider | (() => Promise<void>);
}

function BluelistInput({ provider }: Props) {
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
  const [provider] = useWeb3Modal();

  return (
    <VStack direction={'column'} alignItems={'center'} width='3xl'>
      <Heading size='3xl' color='whiteAlpha.900' marginBottom='15px'>
        We build composable governance legos.
      </Heading>
      <BluelistInput provider={provider} />
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
