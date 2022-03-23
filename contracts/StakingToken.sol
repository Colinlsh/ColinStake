// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StakingToken is ERC20 {
    uint public _totalSupply;

    constructor() ERC20("StakingToken", "STK") {
        _mint(msg.sender, 100000 * (10 ** uint256(decimals())));
        _totalSupply = 1000000 * (10 ** uint256(decimals()));
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    // function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
    //     if (_balances[msg.sender] < amount) return false;
    //     _balances[msg.sender] -= amount;
    //     _balances[receiver] += amount;
    //     emit Transfer(msg.sender, receiver, amount);
    //     return true;
    // }
}