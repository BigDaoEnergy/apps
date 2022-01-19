import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Big DAO Energy Token', function () {
  describe('Whitelist', async function () {
    it("should accept new whitelist address", async function () {
      const BDE = await ethers.getContractFactory('BigDaoEnergy');
      const instance = await BDE.deploy("BigDAOenergy", "BDE", 10000000);
      await instance.deployed();

      expect(await instance.cap()).to.equal(10000000);
      expect(await instance.totalSupply()).to.equal(0);
    });
  })
});
