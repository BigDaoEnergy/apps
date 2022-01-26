import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { BigDaoEnergy } from '../typechain';

const COUNCIL_SEATS = 10;
const VOTE_TOKEN_SUPPLY = 10_000_000;
const SHARES_SUPPLY = 69_000_000;

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

  describe('Whitelist', async function () {
    it("should have correct initial state", async function () {
      expect(await BDE.getCouncilSeatsCount()).to.equal(COUNCIL_SEATS);
      expect(await BDE.getVoteTokensCount()).to.equal(VOTE_TOKEN_SUPPLY);
      expect(await BDE.getShareTokensCount()).to.equal(SHARES_SUPPLY);
    });

    it('should join whitelist', async function() {
      expect(await BDE.connect(ALICE).joinWhitelist()).to.emit(BDE, "JoinedWhitelist");

      expect(await BDE.connect(ALICE).amIWhitelisted()).to.equal(true);
    })
  })
});
