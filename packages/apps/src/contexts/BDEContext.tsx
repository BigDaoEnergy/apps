import { Contract, ethers } from 'ethers';
import React, { createContext, useEffect, useState } from 'react';
import { useWeb3Modal } from '../hooks';
import { BDE_ABI, BDE_ADDRESS } from '../shared/contracts';

interface BDEContextInterface {
  bdeContract?: Contract;
}

export const BDEContext = createContext({} as BDEContextInterface);

interface Props {
  children: React.ReactNode;
}

export const BDEContextProvider = ({ children }: Props) => {
  const { provider } = useWeb3Modal();
  const [bdeContract, setBDEContract] = useState<Contract>();

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

  return (
    <BDEContext.Provider value={{ bdeContract }}>
      {children}
    </BDEContext.Provider>
  );
};
