//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol';

contract Dikasteria is ERC20PresetMinterPauser {
  uint256 WHITELIST_MAX = 69000;
  uint32 numberOfWhitelisted = 0;

  mapping(address => bool) whitelist;

  constructor() ERC20PresetMinterPauser('Dikasteria', 'DIKA') {
    mint(address(this), 69420000); //69,420,000
  }

  function joinWhitelist() public {
    require(msg.sender != address(0), 'cannot whitelist zero address.');
    require(!whitelist[msg.sender], 'can only whitelist once.');
    require(
      numberOfWhitelisted < WHITELIST_MAX,
      'we have already reached the maximum whitelist participants.'
    );

    whitelist[msg.sender] = true;
    numberOfWhitelisted += 1;
  }
}
