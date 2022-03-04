// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token2 is ERC20 {
    uint public _totalSupply;

    constructor() ERC20("Token2", "STT") {
        _mint(msg.sender, 100000);
        _totalSupply = 1000000;
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}