//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract BigDaoEnergy is ERC20, ERC20Capped, Ownable {
  // indicates if minting is finished
  bool private _mintingFinished = false;

  // indicates if transfer is enabled
  bool private _transferEnabled = false;

  /**
   * @dev Emitted during finish minting
   */
  event MintFinished();

  /**
   * @dev Emitted during transfer enabling
   */
  event TransferEnabled();

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

  /**
   * @param name Name of the token
   * @param symbol A symbol to be used as ticker
   * @param cap Maximum number of tokens mintable
   * @param initialSupply Initial token supply
   */
  constructor(
    string memory name,
    string memory symbol,
    uint256 cap,
    uint256 initialSupply
  ) public ERC20Capped(cap) ERC20(name, symbol) {
    if (initialSupply > 0) {
      _mint(owner(), initialSupply);
    }
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
   * @dev Function to mint tokens.
   * @param to The address that will receive the minted tokens
   * @param value The amount of tokens to mint
   */
  function _mint(address to, uint256 value)
    internal
    override(ERC20, ERC20Capped)
    canMint
  {
    _mint(to, value);
  }

  function mint(address to, uint256 value) external {
    _mint(to, value);
  }

  /**
   * @dev Transfer tokens to a specified address.
   * @param to The address to transfer to
   * @param value The amount to be transferred
   * @return A boolean that indicates if the operation was successful.
   */
  function transfer(address to, uint256 value)
    public
    virtual
    override(ERC20)
    canTransfer(_msgSender())
    returns (bool)
  {
    return super.transfer(to, value);
  }

  /**
   * @dev Transfer tokens from one address to another.
   * @param from The address which you want to send tokens from
   * @param to The address which you want to transfer to
   * @param value the amount of tokens to be transferred
   * @return A boolean that indicates if the operation was successful.
   */
  function transferFrom(
    address from,
    address to,
    uint256 value
  ) public virtual override(ERC20) canTransfer(from) returns (bool) {
    return super.transferFrom(from, to, value);
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
