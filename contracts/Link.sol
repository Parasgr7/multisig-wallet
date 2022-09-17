// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Link is ERC20 {

  constructor() ERC20("Chainlink", "LINK"){
        _mint(msg.sender, 1000000 * 10**18);
    }
}
