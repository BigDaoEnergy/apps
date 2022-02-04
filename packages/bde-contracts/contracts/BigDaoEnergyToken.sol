//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

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

contract BigDaoEnergy is ERC20 {
  using SafeMath for uint256;
  using Strings for string;

  bytes32 public immutable root;

  /// @notice Allowance amounts on behalf of others
  mapping(address => mapping(address => uint256)) internal allowances;

  /// @notice Official record of token balances for each account
  mapping(address => uint256) internal balances;

  /// @notice A record of each accounts delegate
  mapping(address => address) public delegates;

  /// @notice A checkpoint for marking number of votes from a given block
  struct Checkpoint {
    uint32 fromBlock;
    uint256 votes;
  }

  /// @notice A record of votes checkpoints for each account, by index
  mapping(address => mapping(uint32 => Checkpoint)) public checkpoints;

  /// @notice The number of checkpoints for each account
  mapping(address => uint32) public numCheckpoints;

  /// @notice The EIP-712 typehash for the contract's domain
  bytes32 public constant DOMAIN_TYPEHASH =
    keccak256(
      'EIP712Domain(string name,uint256 chainId,address verifyingContract)'
    );

  /// @notice The EIP-712 typehash for the delegation struct used by the contract
  bytes32 public constant DELEGATION_TYPEHASH =
    keccak256('Delegation(address delegatee,uint256 nonce,uint256 expiry)');

  /// @notice A record of states for signing / validating signatures
  mapping(address => uint256) public nonces;

  /// @notice An event thats emitted when an account changes its delegate
  event DelegateChanged(
    address indexed delegator,
    address indexed fromDelegate,
    address indexed toDelegate
  );

  /// @notice An event thats emitted when a delegate account's vote balance changes
  event DelegateVotesChanged(
    address indexed delegate,
    uint256 previousBalance,
    uint256 newBalance
  );

  address BAYC_ADDRESS = 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D;
  address MAYC_ADDRESS = 0x60E4d786628Fea6478F785A6d7e704777c86a7c6;
  address GCG_ADDRESS = 0xEdB61f74B0d09B2558F1eeb79B247c1F363Ae452;
  address ENS_ADDRESS = 0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72;
  address deployer;

  mapping(address => bool) isWhitelisted;
  address[] whitelist;

  bool private _mintingFinished = false;
  bool private _transferEnabled = false;
  bool private _airdropFinished = false;

  uint256 whitelistCount = 0;

  event Airdrop();
  event MintFinished();
  event JoinedWhitelist(address who);

  modifier onlyDeployer() {
    require(msg.sender == deployer, 'Only deployer can call this function.');
    _;
  }

  constructor(bytes32 merkleroot, uint256 supply) ERC20('BigDaoEnergy', 'BDE') {
    deployer = msg.sender;
    root = merkleroot;

    _mint(msg.sender, supply);

    emit Transfer(address(0), address(this), supply);
  }

  function _leaf(address account, uint256 tokenId)
    internal
    pure
    returns (bytes32)
  {
    return keccak256(abi.encodePacked(tokenId, account));
  }

  function _verify(bytes32 leaf, bytes32[] memory proof)
    internal
    view
    returns (bool)
  {
    return MerkleProof.verify(proof, root, leaf);
  }

  function redeem(
    address account,
    uint256 amount,
    uint256 tokenId,
    bytes32[] calldata proof
  ) external {
    require(_verify(_leaf(account, tokenId), proof), 'Invalid merkle proof');

    console.log('amount => ', amount);

    _mint(account, amount);
  }

  function joinWhitelist() external returns (bool) {
    // check not already whitelisted
    require(
      isWhitelisted[msg.sender] == false,
      'you are already on the whitelist'
    );
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

    isWhitelisted[msg.sender] = true;
    whitelist.push(msg.sender);

    emit JoinedWhitelist(msg.sender);

    return true;
  }

  function burn(uint256 amount) public virtual {
    _burn(msg.sender, amount);
  }

  function amIWhitelisted() external view returns (bool) {
    return isWhitelisted[msg.sender];
  }

  /**
   * @notice Delegate votes from `msg.sender` to `delegatee`
   * @param delegatee The address to delegate votes to
   */
  function delegate(address delegatee) public {
    return _delegate(msg.sender, delegatee);
  }

  /**
   * @notice Delegates votes from signatory to `delegatee`
   * @param delegatee The address to delegate votes to
   * @param nonce The contract state required to match the signature
   * @param expiry The time at which to expire the signature
   * @param v The recovery byte of the signature
   * @param r Half of the ECDSA signature pair
   * @param s Half of the ECDSA signature pair
   */
  function delegateBySig(
    address delegatee,
    uint256 nonce,
    uint256 expiry,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) public {
    bytes32 domainSeparator = keccak256(
      abi.encode(
        DOMAIN_TYPEHASH,
        keccak256(bytes(name())),
        getChainId(),
        address(this)
      )
    );
    bytes32 structHash = keccak256(
      abi.encode(DELEGATION_TYPEHASH, delegatee, nonce, expiry)
    );
    bytes32 digest = keccak256(
      abi.encodePacked('\x19\x01', domainSeparator, structHash)
    );
    address signatory = ecrecover(digest, v, r, s);
    require(signatory != address(0), 'Bde::delegateBySig: invalid signature');
    require(nonce == nonces[signatory]++, 'Bde::delegateBySig: invalid nonce');
    require(block.timestamp <= expiry, 'Bde::delegateBySig: signature expired');
    return _delegate(signatory, delegatee);
  }

  /**
   * @notice Gets the current votes balance for `account`
   * @param account The address to get votes balance
   * @return The number of current votes for `account`
   */
  function getCurrentVotes(address account) external view returns (uint256) {
    uint32 nCheckpoints = numCheckpoints[account];
    return nCheckpoints > 0 ? checkpoints[account][nCheckpoints - 1].votes : 0;
  }

  /**
   * @notice Determine the prior number of votes for an account as of a block number
   * @dev Block number must be a finalized block or else this function will revert to prevent misinformation.
   * @param account The address of the account to check
   * @param blockNumber The block number to get the vote balance at
   * @return The number of votes the account had as of the given block
   */
  function getPriorVotes(address account, uint256 blockNumber)
    public
    view
    returns (uint256)
  {
    require(
      blockNumber < block.number,
      'Bde::getPriorVotes: not yet determined'
    );

    uint32 nCheckpoints = numCheckpoints[account];
    if (nCheckpoints == 0) {
      return 0;
    }

    // First check most recent balance
    if (checkpoints[account][nCheckpoints - 1].fromBlock <= blockNumber) {
      return checkpoints[account][nCheckpoints - 1].votes;
    }

    // Next check implicit zero balance
    if (checkpoints[account][0].fromBlock > blockNumber) {
      return 0;
    }

    uint32 lower = 0;
    uint32 upper = nCheckpoints - 1;
    while (upper > lower) {
      uint32 center = upper - (upper - lower) / 2; // ceil, avoiding overflow
      Checkpoint memory cp = checkpoints[account][center];
      if (cp.fromBlock == blockNumber) {
        return cp.votes;
      } else if (cp.fromBlock < blockNumber) {
        lower = center;
      } else {
        upper = center - 1;
      }
    }
    return checkpoints[account][lower].votes;
  }

  function _delegate(address delegator, address delegatee) internal {
    address currentDelegate = delegates[delegator];
    uint256 delegatorBalance = balances[delegator];
    delegates[delegator] = delegatee;

    emit DelegateChanged(delegator, currentDelegate, delegatee);

    _moveDelegates(currentDelegate, delegatee, delegatorBalance);
  }

  function _transferTokens(
    address src,
    address dst,
    uint256 amount
  ) internal {
    require(
      src != address(0),
      'Bde::_transferTokens: cannot transfer from the zero address'
    );
    require(
      dst != address(0),
      'Bde::_transferTokens: cannot transfer to the zero address'
    );

    balances[src] = balances[src].sub(amount);
    balances[dst] = balances[dst].add(amount);
    emit Transfer(src, dst, amount);
  }

  function _moveDelegates(
    address srcRep,
    address dstRep,
    uint256 amount
  ) internal {
    if (srcRep != dstRep && amount > 0) {
      if (srcRep != address(0)) {
        uint32 srcRepNum = numCheckpoints[srcRep];
        uint256 srcRepOld = srcRepNum > 0
          ? checkpoints[srcRep][srcRepNum - 1].votes
          : 0;
        uint256 srcRepNew = srcRepOld.sub(amount);
        _writeCheckpoint(srcRep, srcRepNum, srcRepOld, srcRepNew);
      }

      if (dstRep != address(0)) {
        uint32 dstRepNum = numCheckpoints[dstRep];
        uint256 dstRepOld = dstRepNum > 0
          ? checkpoints[dstRep][dstRepNum - 1].votes
          : 0;
        uint256 dstRepNew = dstRepOld.add(amount);
        _writeCheckpoint(dstRep, dstRepNum, dstRepOld, dstRepNew);
      }
    }
  }

  function _writeCheckpoint(
    address delegatee,
    uint32 nCheckpoints,
    uint256 oldVotes,
    uint256 newVotes
  ) internal {
    uint32 blockNumber = safe32(
      block.number,
      'Bde::_writeCheckpoint: block number exceeds 32 bits'
    );

    if (
      nCheckpoints > 0 &&
      checkpoints[delegatee][nCheckpoints - 1].fromBlock == blockNumber
    ) {
      checkpoints[delegatee][nCheckpoints - 1].votes = newVotes;
    } else {
      checkpoints[delegatee][nCheckpoints] = Checkpoint(blockNumber, newVotes);
      numCheckpoints[delegatee] = nCheckpoints + 1;
    }

    emit DelegateVotesChanged(delegatee, oldVotes, newVotes);
  }

  function getChainId() internal view returns (uint256) {
    uint256 chainId;
    assembly {
      chainId := chainid()
    }
    return chainId;
  }

  function safe32(uint256 n, string memory errorMessage)
    internal
    pure
    returns (uint32)
  {
    require(n < 2**32, errorMessage);
    return uint32(n);
  }

  function safe96(uint256 n, string memory errorMessage)
    internal
    pure
    returns (uint256)
  {
    require(n < 2**96, errorMessage);
    return uint256(n);
  }
}
