import { ethers } from 'hardhat';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';

async function deploy(name: string, ...params: any) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then(f => f.deployed());
}

function hashToken(tokenId: number, account: string) {
  return Buffer.from(ethers.utils.solidityKeccak256(['uint256', 'address'], [tokenId, account]).slice(2), 'hex')
}

describe('MerkleDrop', function () {
  let tokens = {};
  let accounts: SignerWithAddress[] = [];
  let merkleTree: MerkleTree;
  let root: string;
  let registry: Contract;
  let bdeToken: Contract;

  before(async () => {
    accounts = await ethers.getSigners();

    tokens = {
      0: accounts[0].address,
      1: accounts[1].address,
      2: accounts[2].address,
      3: accounts[3].address,
      4: accounts[4].address,
      5: accounts[5].address,
    }

    merkleTree = new MerkleTree(Object.entries(tokens).map(token => hashToken(Number(token[0]), String(token[1]))), keccak256, { sortPairs: true });

    root = merkleTree.getHexRoot();

    const instance = await deploy('BigDaoEnergy', root);
    await instance.deployed();
    bdeToken = instance;
  })

  it('sanity check', () => {
    expect(root).to.equal('0xbfd107453ad668c028ae3e24b44e2efa2e665eba0cab99005fbe9bf1694fcf5c');
  })

  describe('Mint All Elements', async () => {
    before(async function() {
      registry = await deploy('MerkleDrop', bdeToken, 12345, merkleTree.getHexRoot(), 123, 123);
    });

    for (const [tokenId, account] of Object.entries(tokens)) {
      it('element', async function () {
        /**
         * Create merkle proof (anyone with knowledge of the merkle tree)
         */
        const proof = merkleTree.getHexProof(hashToken(Number(tokenId), String(account)));
        /**
         * Redeems token using merkle proof (anyone with the proof)
         */
        await expect(registry.redeem(account, tokenId, proof))
          .to.emit(registry, 'Transfer')
          .withArgs(ethers.constants.AddressZero, account, tokenId);
      });
    }
  })

  // describe('Duplicate mint', function () {
  //   let token: Record<string, any> = {};
  //   before(async () => {
  //     const instance = await deploy('BigDaoEnergy', root);
  //     await instance.deployed();
  //     bdeToken = instance;
  //     // BigDaoEnergy _droppedToken,
  //     // uint256 _initialBalance,
  //     // bytes32 _root,
  //     // uint256 _decayStartTime,
  //     // uint256 _decayDurationInSeconds
  //     registry = await deploy('MerkleDrop', bdeToken, 12345, merkleTree.getHexRoot(), 123, 123);

  //     // @eslint-ignore
  //     token = {
  //       tokenId: 0,
  //       account: accounts[0].address,
  //       proof: ['']
  //     }
  //     // token.proof = merkleTree.getHexProof(hashToken(token.tokenId, token.account));

  //   });

  //   it('should pass', async () => {
  //     console.log(token)
  //   })

    // it('mint once - success', async function () {
    //   await expect(registry.redeem(token.account, token.tokenId, token.proof))
    //     .to.emit(registry, 'Transfer')
    //     .withArgs(ethers.constants.AddressZero, token.account, token.tokenId);
    // });

    // it('mint twice - failure', async function () {
    //   await expect(registry.redeem(token.account, token.tokenId, token.proof))
    //     .to.be.revertedWith('ERC721: token already minted');
    // });
  // });  
});