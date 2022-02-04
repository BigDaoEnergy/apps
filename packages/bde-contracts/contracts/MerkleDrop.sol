/* Please read and review the Terms and Conditions governing this
   Merkle Drop by visiting the Trustlines Foundation homepage. Any
   interaction with this smart contract, including but not limited to
   claiming Trustlines Network Tokens, is subject to these Terms and
   Conditions.
 */

pragma solidity ^0.8.0;

import './BigDaoEnergyToken.sol';

contract MerkleDrop {
  bytes32 public root;
  BigDaoEnergy public droppedToken;
  uint256 public decayStartTime;
  uint256 public decayDurationInSeconds;

  uint256 public initialBalance;
  uint256 public remainingValue; // The total of not withdrawn entitlements, not considering decay
  uint256 public spentTokens; // The total tokens spent by the contract, burnt or withdrawn

  mapping(address => bool) public withdrawn;

  event Withdraw(address recipient, uint256 value, uint256 originalValue);
  event Burn(uint256 value);

  constructor(
    BigDaoEnergy _droppedToken,
    uint256 _initialBalance,
    bytes32 _root,
    uint256 _decayStartTime,
    uint256 _decayDurationInSeconds
  ) public {
    // The _initialBalance should be equal to the sum of airdropped tokens
    droppedToken = _droppedToken;
    initialBalance = _initialBalance;
    remainingValue = _initialBalance;
    root = _root;
    decayStartTime = _decayStartTime;
    decayDurationInSeconds = _decayDurationInSeconds;
  }

  function withdraw(
    address treasury,
    uint256 amount,
    uint256 value,
    bytes32[] memory proof
  ) public {
    require(
      verifyEntitled(msg.sender, value, proof),
      'The proof could not be verified.'
    );
    require(
      !withdrawn[msg.sender],
      'You have already withdrawn your entitled token.'
    );

    burnUnusableTokens();

    uint256 valueToSend = decayedEntitlementAtTime(
      value,
      block.timestamp,
      false
    );
    assert(valueToSend <= value);
    require(
      droppedToken.balanceOf(address(this)) >= valueToSend,
      'The MerkleDrop does not have tokens to drop yet / anymore.'
    );
    require(valueToSend != 0, 'The decayed entitled value is now zero.');

    withdrawn[msg.sender] = true;
    remainingValue -= value;
    spentTokens += valueToSend;

    droppedToken.transferFrom(treasury, msg.sender, amount);
    emit Withdraw(msg.sender, valueToSend, value);
  }

  function verifyEntitled(
    address recipient,
    uint256 value,
    bytes32[] memory proof
  ) public view returns (bool) {
    // We need to pack the 20 bytes address to the 32 bytes value
    // to match with the proof made with the python merkle-drop package
    bytes32 leaf = keccak256(abi.encodePacked(recipient, value));
    return verifyProof(leaf, proof);
  }

  function decayedEntitlementAtTime(
    uint256 value,
    uint256 time,
    bool roundUp
  ) public view returns (uint256) {
    if (time <= decayStartTime) {
      return value;
    } else if (time >= decayStartTime + decayDurationInSeconds) {
      return 0;
    } else {
      uint256 timeDecayed = time - decayStartTime;
      uint256 valueDecay = decay(
        value,
        timeDecayed,
        decayDurationInSeconds,
        !roundUp
      );
      assert(valueDecay <= value);
      return value - valueDecay;
    }
  }

  function burnUnusableTokens() public {
    if (block.timestamp <= decayStartTime) {
      return;
    }

    // The amount of tokens that should be held within the contract after burning
    uint256 targetBalance = decayedEntitlementAtTime(
      remainingValue,
      block.timestamp,
      true
    );

    // toBurn = (initial balance - target balance) - what we already removed from initial balance
    uint256 currentBalance = initialBalance - spentTokens;
    assert(targetBalance <= currentBalance);
    uint256 toBurn = currentBalance - targetBalance;

    spentTokens += toBurn;
    burn(toBurn);
  }

  function deleteContract() public {
    require(
      block.timestamp >= decayStartTime + decayDurationInSeconds,
      'The storage cannot be deleted before the end of the merkle drop.'
    );
    burnUnusableTokens();

    selfdestruct(payable(address(0)));
  }

  function verifyProof(bytes32 leaf, bytes32[] memory proof)
    internal
    view
    returns (bool)
  {
    bytes32 currentHash = leaf;

    for (uint256 i = 0; i < proof.length; i += 1) {
      currentHash = parentHash(currentHash, proof[i]);
    }

    return currentHash == root;
  }

  function parentHash(bytes32 a, bytes32 b) internal pure returns (bytes32) {
    if (a < b) {
      return keccak256(abi.encode(a, b));
    } else {
      return keccak256(abi.encode(b, a));
    }
  }

  function burn(uint256 value) internal {
    if (value == 0) {
      return;
    }
    emit Burn(value);
    droppedToken.burn(value);
  }

  function decay(
    uint256 value,
    uint256 timeToDecay,
    uint256 totalDecayTime,
    bool roundUp
  ) internal pure returns (uint256) {
    uint256 decay;

    if (roundUp) {
      decay = (value * timeToDecay + totalDecayTime - 1) / totalDecayTime;
    } else {
      decay = (value * timeToDecay) / totalDecayTime;
    }
    return decay >= value ? value : decay;
  }
}
