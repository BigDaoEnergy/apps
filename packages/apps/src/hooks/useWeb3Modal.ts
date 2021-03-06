// credit to https://github.com/paulrberg/create-eth-app/blob/83299e4226bf33bc087d6b7b388d6375c566fddb/handlebars/react/packages/react-app/src/hooks/useWeb3Modal.js

import { Web3Provider } from '@ethersproject/providers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Web3Modal from 'web3modal';

// Enter a valid infura key here to avoid being rate limited
// You can get a key for free at https://infura.io/register
// const INFURA_ID = 'INVALID_INFURA_KEY';

const NETWORK = 'localhost';

interface ReturnType {
  provider?: Web3Provider;
  loadWeb3Modal: () => Promise<void>;
  logoutOfWeb3Modal: () => Promise<void>;
}

function useWeb3Modal(config: any = {}): ReturnType {
  const [provider, setProvider] = useState<Web3Provider>();
  const [autoLoaded, setAutoLoaded] = useState(false);
  const { autoLoad = true, network = NETWORK } = config;

  // Web3Modal also supports many other wallets.
  // You can see other options at https://github.com/Web3Modal/web3modal
  const web3Modal = useMemo(() => {
    return new Web3Modal({
      cacheProvider: true,
      providerOptions: {},
      network,
    });
  }, [network]);

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect();
    setProvider(new Web3Provider(newProvider));
  }, [web3Modal]);

  const logoutOfWeb3Modal = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      window.location.reload();
    },
    [web3Modal]
  );

  // If autoLoad is enabled and the the wallet had been loaded before, load it automatically now.
  useEffect(() => {
    if (autoLoad && !autoLoaded && web3Modal.cachedProvider) {
      loadWeb3Modal();
      setAutoLoaded(true);
    }
  }, [
    autoLoad,
    autoLoaded,
    loadWeb3Modal,
    setAutoLoaded,
    web3Modal.cachedProvider,
  ]);

  return { provider, loadWeb3Modal, logoutOfWeb3Modal };
}

export default useWeb3Modal;
