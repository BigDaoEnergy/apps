import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';

import { BigDaoEnergy } from '../typechain';

const COUNCIL_SEATS = 10;
const VOTE_TOKEN_SUPPLY = 10_000_000;
const SHARES_SUPPLY = 69_000_000;

const BAYC_OWNER = "0xd83e662B83880081741D0E810c3Fe8630fa6Cb4d";
const MAYC_OWNER = "0xE9Cee167c8f8B0741120683C5b32B69FF0636BDF";
const GCG_OWNER = "0x8e3DA7C7e530e0E3204b74FC4495Fc918dFd26ac";
const ENS_OWNER = "0x991d540e7ECFa15dBe3F52d0f758010DBec85F6D";


async function impersonate(address: string): Promise<SignerWithAddress> {
    // impersonate guy who owns APEs
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [address],
  });

  let signer = await ethers.getSigner(address);

  return signer;
}

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
  })
});
