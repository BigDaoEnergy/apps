import React, { useCallback, useContext, useState } from 'react';
import {
  Center,
  HStack,
  Heading,
  Icon,
  VStack,
  Text,
  Input,
  Button,
} from '@chakra-ui/react';
import { FaDiscord, FaEthereum, FaTwitter } from 'react-icons/fa';
import { SiReadthedocs } from 'react-icons/si';

import { ConnectWeb3Button } from '../components';
import { useWeb3Modal } from '../hooks';

enum BluelistInputErrors {
  ADDRESS_NOT_VALID,
  ADDESS_LENGTH,
  NONE,
}

function BluelistInput() {
  // const { provider } = useContext(Web3Context);

  const [input, setInput] = useState<string>();
  const [error, setError] = useState<BluelistInputErrors>(
    BluelistInputErrors.NONE
  );

  const handleBluelist = useCallback(() => {}, []);

  return (
    <VStack justifyContent='center'>
      <Input isInvalid={error !== BluelistInputErrors.NONE} value={input} />
      <Button onClick={() => handleBluelist()}>Bluelist Me!</Button>
    </VStack>
  );
}

interface Props {}

function Landing(props: Props) {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  return (
    <VStack direction={'column'} alignItems={'center'}>
      <Heading size='4xl' color='whiteAlpha.900'>
        BigDAOEnergy
      </Heading>
      <Text color='white'>We build DAO coordination games and frameworks.</Text>
      <ConnectWeb3Button
        provider={provider}
        loadWeb3Modal={loadWeb3Modal}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
      />
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
