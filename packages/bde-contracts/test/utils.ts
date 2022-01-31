
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers, network } from 'hardhat';

export const COUNCIL_SEATS = 10;
export const VOTE_TOKEN_SUPPLY = 10_000_000;
export const SHARES_SUPPLY = 69_000_000;

export const BAYC_OWNER = "0xd83e662B83880081741D0E810c3Fe8630fa6Cb4d";
export const MAYC_OWNER = "0xE9Cee167c8f8B0741120683C5b32B69FF0636BDF";
export const GCG_OWNER = "0x8e3DA7C7e530e0E3204b74FC4495Fc918dFd26ac";
export const ENS_OWNER = "0x991d540e7ECFa15dBe3F52d0f758010DBec85F6D";


export async function impersonate(address: string): Promise<SignerWithAddress> {
    // impersonate guy who owns APEs
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [address],
  });

  let signer = await ethers.getSigner(address);

  return signer;
}
