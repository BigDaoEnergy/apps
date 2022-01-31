
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import axios from 'axios';
import { ethers, network } from 'hardhat';

export const COUNCIL_SEATS = 10;
export const VOTE_TOKEN_SUPPLY = 10_000_000;
export const SHARES_SUPPLY = 69_000_000;

export const BAYC_OWNER = "0xd83e662B83880081741D0E810c3Fe8630fa6Cb4d";
export const MAYC_OWNER = "0xE9Cee167c8f8B0741120683C5b32B69FF0636BDF";
export const GCG_OWNER = "0x8e3DA7C7e530e0E3204b74FC4495Fc918dFd26ac";
export const ENS_OWNER = "0x991d540e7ECFa15dBe3F52d0f758010DBec85F6D";

const BOARDROOM_API = "https://api.boardroom.info/v1"

export async function impersonate(address: string): Promise<SignerWithAddress> {
    // impersonate guy who owns APEs
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [address],
  });

  let signer = await ethers.getSigner(address);

  return signer;
}

export const TOP_DAOS_BY_AUM = [
  {
    "protocol": "gnosis",
    "balance": 2190855400,
    "currency": "usd",
    "timestamp": "1643665187306"
  },
  {
    "protocol": "uniswap",
    "balance": 2009780000,
    "currency": "usd",
    "timestamp": "1643654566242"
  },
  {
    "protocol": "ens",
    "balance": 1334335000,
    "currency": "usd",
    "timestamp": "1643634993260"
  },
  {
    "protocol": "dydx",
    "balance": 436026180,
    "currency": "usd",
    "timestamp": "1643666710977"
  },
  {
    "protocol": "lido",
    "balance": 426437730,
    "currency": "usd",
    "timestamp": "1643638673078"
  },
  {
    "protocol": "gitcoin",
    "balance": 390343520,
    "currency": "usd",
    "timestamp": "1643629989140"
  },
  {
    "protocol": "compound",
    "balance": 341379360,
    "currency": "usd",
    "timestamp": "1643649285187"
  },
  {
    "protocol": "aave",
    "balance": 325356640,
    "currency": "usd",
    "timestamp": "1643662731342"
  },
  {
    "protocol": "radicle",
    "balance": 318681660,
    "currency": "usd",
    "timestamp": "1643664538028"
  },
  {
    "protocol": "synthetix",
    "balance": 236952160,
    "currency": "usd",
    "timestamp": "1643639670277"
  },
  {
    "protocol": "tornadocash",
    "balance": 123853416,
    "currency": "usd",
    "timestamp": "1643664573094"
  },
  {
    "protocol": "fei",
    "balance": 119467256,
    "currency": "usd",
    "timestamp": "1643635153657"
  },
  {
    "protocol": "aragon",
    "balance": 99302330,
    "currency": "usd",
    "timestamp": "1643627930379"
  },
  {
    "protocol": "rarible",
    "balance": 98389410,
    "currency": "usd",
    "timestamp": "1643660982009"
  },
  {
    "protocol": "klimadao",
    "balance": 92263664,
    "currency": "usd",
    "timestamp": "1643639582868"
  },
  {
    "protocol": "shapeshift",
    "balance": 89112016,
    "currency": "usd",
    "timestamp": "1643661571456"
  },
  {
    "protocol": "badgerdao",
    "balance": 82080310,
    "currency": "usd",
    "timestamp": "1643651012360"
  },
  {
    "protocol": "olympusdao",
    "balance": 80716130,
    "currency": "usd",
    "timestamp": "1643639896592"
  },
  {
    "protocol": "perpetualprotocol",
    "balance": 78041016,
    "currency": "usd",
    "timestamp": "1643663673666"
  },
  {
    "protocol": "powerpool",
    "balance": 68539410,
    "currency": "usd",
    "timestamp": "1643661882250"
  }
]



export async function getSnapshotVotersOfTop20DAOsByAUM() {
  const addresses = new Set();

  for await (let dao of TOP_DAOS_BY_AUM) {
    // const protocol = await axios.get(`${BOARDROOM_API}/protocols/${dao.protocol}`);
    const voters = await axios.get(`${BOARDROOM_API}/protocols/${dao.protocol}/voters`);

    voters.data.data.map((voter: any) => addresses.add(voter.address));
  
    // const protocolContractAddress = protocol.data.data.tokens[0].contractAddress;
  }
  console.log(addresses.values());
}