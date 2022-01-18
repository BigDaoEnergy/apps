import { expect } from 'chai';
import { BigNumberish, Contract, ContractFactory } from 'ethers';
import { ethers } from 'hardhat';

interface DiksteriaInterface extends Contract {
  name: () => Promise<string>;
  symbol: () => Promise<string>;
  totalSupply: () => Promise<BigNumberish>;
}

describe('Dikasteria Token', function () {
  it('Should deploy with correct params', async function () {
    const Dikasteria: ContractFactory = await ethers.getContractFactory(
      'Dikasteria'
    );
    const dikasteriaInstance =
      (await Dikasteria.deploy()) as DiksteriaInterface;
    await dikasteriaInstance.deployed();

    const totalSupply: BigNumberish = await dikasteriaInstance.totalSupply();

    expect(await dikasteriaInstance.name()).to.equal('Dikasteria');
    expect(await dikasteriaInstance.symbol()).to.equal('DIKA');
    expect(totalSupply.toString()).to.equal('69420000');
  });
});
