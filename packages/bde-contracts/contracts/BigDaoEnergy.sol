//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

interface IBAYC {
  function balanceOf(address owner) external view returns (uint256 balance);
}

interface IMAYC {
  function balanceOf(address owner) external view returns (uint256 balance);
}

interface IGCG {
  function balanceOf(address owner) external view returns (uint256 balance);
}

interface IENS {
  function balanceOf(address owner) external view returns (uint256 balance);
}

contract BigDaoEnergy is ERC1155, Ownable {
  address BAYC_ADDRESS = 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D;
  address MAYC_ADDRESS = 0x60E4d786628Fea6478F785A6d7e704777c86a7c6;
  address GCG_ADDRESS = 0xEdB61f74B0d09B2558F1eeb79B247c1F363Ae452;
  address ENS_ADDRESS = 0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72;

  // indicates if minting is finished
  bool private _mintingFinished = false;

  // indicates if transfer is enabled
  bool private _transferEnabled = false;

  mapping(address => bool) whitelist;
  uint256 whitelistCount = 0;

  uint256 COUNCIL_SEATS = 10;
  uint256 VOTE_TOKEN_SUPPLY = 10_000_000;
  uint256 SHARES_SUPPLY = 69_000_000;

  uint256 public constant COUNCIL_SEAT_ID = 0;
  uint256 public constant VOTE_TOKEN_ID = 1;
  uint256 public constant SHARES_ID = 2;

  event MintFinished();
  event TransferEnabled();
  event JoinedWhitelist(address who);

  /**
   * @dev Tokens can be minted only before minting finished.
   */
  modifier canMint() {
    require(!_mintingFinished, 'BaseToken: minting is finished');
    _;
  }

  /**
   * @dev Tokens can be moved only after if transfer enabled or if you are an approved operator.
   */
  modifier canTransfer(address from) {
    require(
      _transferEnabled,
      'BaseToken: transfer is not enabled or from does not have the OPERATOR role'
    );
    _;
  }

  constructor() ERC1155('https://bigdaoenergy.com/api/v1/{item}.json') {
    _mint(msg.sender, COUNCIL_SEAT_ID, COUNCIL_SEATS, '');
    _mint(msg.sender, VOTE_TOKEN_ID, VOTE_TOKEN_SUPPLY, '');
    _mint(msg.sender, SHARES_ID, SHARES_SUPPLY, '');
  }

  function getCouncilSeatsCount() external view returns (uint256) {
    return COUNCIL_SEATS;
  }

  function getVoteTokensCount() external view returns (uint256) {
    return VOTE_TOKEN_SUPPLY;
  }

  function getShareTokensCount() external view returns (uint256) {
    return SHARES_SUPPLY;
  }

  function joinWhitelist() external returns (bool) {
    // check not already whitelisted
    require(whitelist[msg.sender] == false, 'you are already on the whitelist');
    // check whitelist size under 10000
    require(whitelistCount < 10000, 'whitelist cap reached.');

    console.log(IBAYC(BAYC_ADDRESS).balanceOf(msg.sender));

    require(
      IBAYC(BAYC_ADDRESS).balanceOf(msg.sender) > 0 ||
        IMAYC(MAYC_ADDRESS).balanceOf(msg.sender) > 0 ||
        IGCG(GCG_ADDRESS).balanceOf(msg.sender) > 0 ||
        IENS(ENS_ADDRESS).balanceOf(msg.sender) > 0,
      'must own a valid NFT or ENS to join'
    );

    whitelist[msg.sender] = true;

    emit JoinedWhitelist(msg.sender);

    return true;
  }

  function amIWhitelisted() external view returns (bool) {
    return whitelist[msg.sender];
  }

  /**
   * @return if minting is finished or not.
   */
  function mintingFinished() public view returns (bool) {
    return _mintingFinished;
  }

  /**
   * @return if transfer is enabled or not.
   */
  function transferEnabled() public view returns (bool) {
    return _transferEnabled;
  }

  /**
   * @dev Function to stop minting new tokens.
   */
  function finishMinting() public canMint onlyOwner {
    _mintingFinished = true;

    emit MintFinished();
  }

  /**
   * @dev Function to enable transfers.
   */
  function enableTransfer() public onlyOwner {
    _transferEnabled = true;

    emit TransferEnabled();
  }
}
