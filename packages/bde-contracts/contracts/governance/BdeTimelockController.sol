import '@openzeppelin/contracts/governance/TimelockController.sol';

contract BdeTimelockController is TimelockController {
  constructor(
    uint256 minDelay,
    address[] memory proposers,
    address[] memory executors
  ) TimelockController(minDelay, proposers, executors) {}
}
