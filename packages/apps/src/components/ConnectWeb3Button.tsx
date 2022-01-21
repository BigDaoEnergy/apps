import { Button, HStack, Icon, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

function ConnectWeb3Button({
  provider,
  loadWeb3Modal,
  logoutOfWeb3Modal,
}: any) {
  const [account, setAccount] = useState('');
  const [rendered, setRendered] = useState('');

  useEffect(() => {
    async function fetchAccount() {
      if (!provider) {
        return;
      }

      // Load the user's accounts.
      const accounts = await provider.listAccounts();

      console.log(accounts);

      setAccount(accounts[0]);
      try {
        // Resolve the ENS name for the first account.
        // const name = await provider.lookupAddress(accounts[0]);

        // Render either the ENS name or the shortened account address.
        // if (name) {
        //   setRendered(name);
        // } else {
        //   setRendered(account.substring(0, 6) + '...' + account.substring(36));
        // }
        setRendered(account.substring(0, 6) + '...' + account.substring(36));
      } catch (err) {
        setAccount('');
        setRendered('');
        console.error(err);
      }
    }
    fetchAccount();
  }, [account, provider]);

  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {rendered === '' && 'Connect Wallet'}
      {rendered !== '' && (
        <HStack>
          <Text>Connected As: {rendered}</Text>
          <Icon viewBox='0 0 200 200' color='green.500'>
            <path
              fill='currentColor'
              d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
            />
          </Icon>
        </HStack>
      )}
    </Button>
  );
}

export default React.memo(ConnectWeb3Button);
