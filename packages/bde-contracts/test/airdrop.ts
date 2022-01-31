import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers, network } from 'hardhat';

import { BigDaoEnergy } from '../typechain';


describe('Big DAO Energy Token', function () {
  let BDE: BigDaoEnergy;
  let ALICE: SignerWithAddress;
  let BOB: SignerWithAddress;
  let CHARLIE: SignerWithAddress;

  before(async () => {
      const BDEFactory = await ethers.getContractFactory('BigDaoEnergy');
      const instance = await BDEFactory.deploy();
      await instance.deployed();
      BDE = instance;

      [ALICE, BOB, CHARLIE] = await ethers.getSigners();
  })

  describe('Airdrop', async function () {
	})
});
