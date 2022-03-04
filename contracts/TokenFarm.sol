// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "./Token1.sol";
import "./Token2.sol";

contract TokenFarm {		
	string public name = "Colin Token Farm";
	address public owner;
	Token1 public token1;
	Token2 public token2;	

	address[] public stakers;

    // staker address to balance mapping
	mapping(address => uint) public stakingBalance;

    // staker staking state
	mapping(address => bool) public hasStaked;

	mapping(address => bool) public isStaking;

	constructor(Token1 _token1, Token2 _token2) public {
		token1 = _token1;
		token2 = _token2;
		owner = msg.sender;
	}

    // stake/deposit token
	function stakeTokens(uint _amount) public {			
		// approve transfer
        token2.approve(msg.sender, _amount);	
		// transfer token2 to this contract for staking
		token2.transferFrom(msg.sender, address(this), _amount);

		// update staking balance
		stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;		

		// right now contract only allow 1 stake per user.
		if(!hasStaked[msg.sender]) {
			stakers.push(msg.sender);
		}

		// update stakng status
		isStaking[msg.sender] = true;
		hasStaked[msg.sender] = true;
	}

	// unstake/withdraw
	function unstakeTokens() public {
		// fetch staking balance
		uint balance = stakingBalance[msg.sender];

		// require amount greter than 0
		require(balance > 0, "no stake token found");

		// transfer Mock Dai tokens to this contract for staking
		token2.transfer(msg.sender, balance);

		// reset staking balance
		stakingBalance[msg.sender] = 0;

		// update staking status
		isStaking[msg.sender] = false;
	}


	function rewardTokens() public {
		// only owner can call this function
		require(msg.sender == owner, "caller must be the owner");

		// issue tokens to all stakers
		for (uint i=0; i<stakers.length; i++) {
			address recipient = stakers[i];
			uint balance = stakingBalance[recipient];
			if(balance > 0) {
				token1.transfer(recipient, balance);
			}			
		}
	}

}