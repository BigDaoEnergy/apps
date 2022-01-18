import React from 'react';
import { Center, HStack, Heading, Icon, VStack, Text } from '@chakra-ui/react';
import { FaDiscord, FaEthereum, FaTwitter } from 'react-icons/fa';
import { SiReadthedocs } from 'react-icons/si';

interface Props {}

function Landing(props: Props) {
  return (
    <VStack direction={'column'} alignItems={'center'}>
      <Heading size='4xl' color='whiteAlpha.900'>
        BigDAOEnergy
      </Heading>
      <Text color='white'>We build DAO coordination games and frameworks.</Text>
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
