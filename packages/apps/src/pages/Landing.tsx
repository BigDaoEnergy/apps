import React, { useContext } from 'react';
import {
  Button,
  Center,
  HStack,
  Heading,
  Icon,
  VStack,
  Text,
} from '@chakra-ui/react';
import { FaDiscord, FaEthereum, FaTwitter } from 'react-icons/fa';
import { SiReadthedocs } from 'react-icons/si';
import { Web3Context } from '../contexts';

interface Props {}

function Landing(props: Props) {
  const { connectWallet, provider } = useContext(Web3Context);

  return (
    <VStack direction={'column'} alignItems={'center'}>
      <Heading color='whiteAlpha.900'>BigDAOEnergy</Heading>
      {!!provider ? (
        <Text color='whiteAlpha.900'>Connected as: {}</Text>
      ) : (
        <Button onClick={() => connectWallet}>Connect Wallet</Button>
      )}

      <Center>
        <HStack spacing='24px'>
          <Icon as={FaDiscord} />
          <Icon as={FaTwitter} />
          <Icon as={FaEthereum} />
          <Icon as={SiReadthedocs} />
        </HStack>
      </Center>
    </VStack>
  );
}

export default React.memo(Landing);
