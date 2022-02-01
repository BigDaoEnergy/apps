import '@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol';

contract Treasury is ERC1155PresetMinterPauser {
  constructor(string memory uri) ERC1155PresetMinterPauser(uri) {}
}
