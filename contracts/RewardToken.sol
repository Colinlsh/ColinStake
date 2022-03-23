// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardToken is ERC20 {
    uint public _totalSupply;

    constructor() ERC20("RewardToken", "RTK") {
        _mint(msg.sender, 100000 * (10 ** uint256(decimals())));
        _totalSupply = 1000000 * (10 ** uint256(decimals()));
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}