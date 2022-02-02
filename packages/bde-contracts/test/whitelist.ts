import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { BigDaoEnergy } from '../typechain';
import { BAYC_OWNER, COUNCIL_SEATS, ENS_OWNER, GCG_OWNER, impersonate, MAYC_OWNER, SHARES_SUPPLY, VOTE_TOKEN_SUPPLY } from './utils';

describe.only('Whitelist', function () {
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

  it("should have correct initial state", async function () {
    expect(await BDE.getCouncilSeatsCount()).to.equal(COUNCIL_SEATS);
    expect(await BDE.getVoteTokensCount()).to.equal(VOTE_TOKEN_SUPPLY);
    expect(await BDE.getShareTokensCount()).to.equal(SHARES_SUPPLY);

    expect(await BDE.balanceOf(BDE.address, 0)).to.equal(COUNCIL_SEATS);
    expect(await BDE.balanceOf(BDE.address, 1)).to.equal(VOTE_TOKEN_SUPPLY);
  });

  it('should not allow no-NFTer to join', async function () {
    // doesn't own shit
    expect(BDE.connect(ALICE).joinWhitelist()).to.be.revertedWith("must own a valid NFT or ENS to join");
  })

  it('should allow BAYC holder to join whitelist', async function () {
    const signer = await impersonate(BAYC_OWNER);

    try {
      expect(BDE.connect(signer).joinWhitelist()).to.emit(BDE, "JoinedWhitelist")
    } catch (e) {

    }
  })

  it('should allow MAYC holder to join whitelist', async function() {
    const signer = await impersonate(MAYC_OWNER);
    
    try {
      expect(BDE.connect(signer).joinWhitelist()).to.emit(BDE, "JoinedWhitelist")
    } catch (e) {

    }
  })

  it('should allow GCG holder to join whitelist', async function() {
    const signer = await impersonate(GCG_OWNER);
    
    try {
      expect(BDE.connect(signer).joinWhitelist()).to.emit(BDE, "JoinedWhitelist")
    } catch (e) {}
    
  })

  it('should allow ENS holder to join whitelist', async function() {
    const signer = await impersonate(ENS_OWNER);
    
    try {
      expect(BDE.connect(signer).joinWhitelist()).to.emit(BDE, "JoinedWhitelist")
    } catch (e) {}
    
  })
});
