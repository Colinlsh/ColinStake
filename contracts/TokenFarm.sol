// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./StakingToken.sol";
import "./RewardToken.sol";

contract TokenFarm {		
	string public name = "Colin Token Farm";
	address public owner;
	StakingToken public stakingToken;
	RewardToken public rewardToken;	

	address[] public stakers;

    // staker address to balance mapping
	mapping(address => uint) public stakingBalance;

	mapping(address => bool) public isStaking;

	// userAddress => timeStamp
    mapping(address => uint256) public startTime;

	// userAddress => rewardTokenBalance
    mapping(address => uint256) public rewardTokenBalance;

	// event to emit when stake/unstake/yieldwithdraw
    event Stake(address indexed from, uint256 amount);
    event Unstake(address indexed from, uint256 amount);
    event YieldWithdraw(address indexed to, uint256 amount);
    event ConsoleLog(address indexed from, string message);

	constructor(StakingToken _stakingToken, RewardToken _rewardToken) public {
		stakingToken = _stakingToken;
		rewardToken = _rewardToken;
		owner = msg.sender;
	}

    // stake/deposit token
	function stakeTokens(uint _amount) public {

		require(
            _amount > 0 &&
            stakingToken.balanceOf(msg.sender) >= _amount, 
            "You cannot stake zero tokens");

		if(isStaking[msg.sender] == true){
            emit ConsoleLog(msg.sender, "sender is staking!");
            uint256 toTransfer = calculateYieldTotal(msg.sender);
            rewardTokenBalance[msg.sender] += toTransfer;
        }

		// transfer staking token from sender to this contract
		stakingToken.transferFrom(msg.sender, address(this), _amount);

		// update staking balance
		stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

		startTime[msg.sender] = block.timestamp;		

		// update stakng status
		isStaking[msg.sender] = true;
		emit Stake(msg.sender, _amount);
	}

	// unstake/withdraw
	function unstakeTokens(uint256 _amount) public {

		require(
            isStaking[msg.sender] = true &&
            stakingBalance[msg.sender] >= _amount, 
            "Nothing to unstake"
        );

		uint256 yieldTransfer = calculateYieldTotal(msg.sender);
        startTime[msg.sender] = block.timestamp;
        uint256 balTransfer = _amount;
        _amount = 0;
        stakingBalance[msg.sender] -= balTransfer;
        stakingToken.transfer(msg.sender, balTransfer);
        rewardTokenBalance[msg.sender] += yieldTransfer;
        if(stakingBalance[msg.sender] == 0){
            isStaking[msg.sender] = false;
        }
        emit Unstake(msg.sender, balTransfer);
	}


    function withdrawYield() public {
        uint256 toTransfer = calculateYieldTotal(msg.sender);

        require(
            toTransfer > 0 ||
            rewardTokenBalance[msg.sender] > 0,
            "Nothing to withdraw"
            );
            
        if(rewardTokenBalance[msg.sender] != 0){
            uint256 oldBalance = rewardTokenBalance[msg.sender];
            rewardTokenBalance[msg.sender] = 0;
            toTransfer += oldBalance;
        }

        startTime[msg.sender] = block.timestamp;
		// mint new token for user
        rewardToken.mint(msg.sender, toTransfer);
        emit YieldWithdraw(msg.sender, toTransfer);
    } 

	function calculateYieldTime(address user) public view returns(uint256) {
        uint256 end = block.timestamp;
        uint256 totalTime = end - startTime[user];
        return totalTime;
    }

    // 86400 represents the number of seconds in a day. Having it to be 86400 it will equate to 100% return rate in 24 hours.
	function calculateYieldTotal(address user) public view returns(uint256) {
        uint256 time = calculateYieldTime(user) * 10**18;
        uint256 rate = 86400;
        uint256 timeRate = time / rate;
        uint256 rawYield = (stakingBalance[user] * timeRate) / 10**18;
        return rawYield;
    } 
}