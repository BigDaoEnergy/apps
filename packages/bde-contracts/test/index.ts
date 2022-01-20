import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { BigDaoEnergy } from '../typechain';

const CAP = 100000000; // 100 million
const INITIAL_SUPPLY = 69000000; // 69 million

describe('Big DAO Energy Token', function () {
  let BDE: BigDaoEnergy;
  let ALICE: SignerWithAddress;
  let BOB: SignerWithAddress;
  let CHARLIE: SignerWithAddress;

  before(async () => {
      const BDEFactory = await ethers.getContractFactory('BigDaoEnergy');
      const instance = await BDEFactory.deploy("BigDAOenergy", "BDE", CAP);
      await instance.deployed();
      BDE = instance;

      [ALICE, BOB, CHARLIE] = await ethers.getSigners();
  })

  describe('Whitelist', async function () {
    it("should have correct initial state", async function () {
      expect(await BDE.cap()).to.equal(CAP);
      expect(await BDE.totalSupply()).to.equal(0);
    });

    it('should mint', async function() {
      expect(await BDE.connect(ALICE).initialMint(INITIAL_SUPPLY)).to.emit(BDE, "Transfer");
      
      expect(await BDE.totalSupply()).to.equal(INITIAL_SUPPLY);

      expect(await BDE.balanceOf(ALICE.address)).to.equal(INITIAL_SUPPLY);
    })
  })
});
