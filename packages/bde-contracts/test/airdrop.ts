import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { BigDaoEnergy } from '../typechain';
import { getSnapshotVotersOfTop20DAOsByAUM } from './utils';

describe('Airdrop', function () {
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


	it('should distribute BDE token to everyone in approved snapshot', async function () {
		const addresses = await getSnapshotVotersOfTop20DAOsByAUM();

		expect(await BDE.connect(ALICE).airdrop(addresses)).to.be.true;
	})
});
