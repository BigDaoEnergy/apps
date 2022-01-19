import React, { createContext, useCallback, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import Web3Modal from 'web3modal';

interface Web3ContextType {
  connectWallet: () => Promise<void>;
  provider?: any;
}

interface Web3ContextProviderInterface {
  children: React.ReactNode;
}

export const Web3Context = createContext({} as Web3ContextType);

const providerOptions = {
  /* See Provider Options Section */
};

const web3Modal = new Web3Modal({
  network: 'mainnet', // optional
  cacheProvider: true, // optional
  providerOptions, // required
});

export function Web3ContextProvider({
  children,
}: Web3ContextProviderInterface) {
  const [provider, setProvider] = useState<Web3Provider>(
    window.ethereum
  );

  const connectWallet = useCallback(async () => {
    console.log('here');
    const instance = await web3Modal.connect();

    
  }, []);

  return (
    <Web3Context.Provider value={{ connectWallet, provider }}>
      {children}
    </Web3Context.Provider>
  );
}
