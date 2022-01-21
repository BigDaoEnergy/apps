import { Contract, ethers } from 'ethers';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { BDE_ABI, BDE_ADDRESS } from '../shared/contracts';

function BluelistInput() {
  const { provider } = useWeb3Modal();
  const [bdeContract, setBDEContract] = useState<Contract>();
  const [amIWhitelisted, setAmiW] = useState<boolean>();

  useEffect(() => {
    async function getContract() {
      if (provider) {
        const contract = await new ethers.Contract(
          BDE_ADDRESS,
          BDE_ABI,
          provider.getSigner()
        );
        setBDEContract(contract);
      }
    }

    getContract();
  }, [provider]);

  useEffect(() => {
    async function amIWhitelisted() {
      if (bdeContract) {
        const amiw = await bdeContract.amIWhitelisted();

        setAmiW(amiw);
      }
    }

    amIWhitelisted();
  }, [bdeContract]);

  const handleBluelist = useCallback(async () => {
    if (bdeContract) {
      try {
        await bdeContract.joinWhitelist();
      } catch (e) {
        console.error(e);
      }
    }
  }, [bdeContract]);

  return (
    <VStack justifyContent='center'>
      {amIWhitelisted ? (
        <Button>You Are On The Whitelist!</Button>
      ) : (
        <Button
          className='button-secondary'
          disabled={!provider}
          onClick={() => handleBluelist()}
        >
          Bluelist Me!
        </Button>
      )}
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
