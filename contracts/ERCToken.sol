// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERCToken is ERC20 {

  constructor(string memory _name, string memory _token) ERC20(_name, _token) {

      _mint(msg.sender, 10000000000000000000000000);
  }
}
