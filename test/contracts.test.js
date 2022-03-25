/* eslint-disable no-undef */
const assert = require("assert");
const web3 = require("web3");

const StakeToken = artifacts.require("StakingToken");
const RewardToken = artifacts.require("RewardToken");
const TokenFarm = artifacts.require("TokenFarm");

// contract("StakingToken", () => {
//   it("should deploy token contract", async () => {
//     const instance = await StakeToken.deployed();
//     const totalSupply = await instance.totalSupply();
//     let _totalSupply = web3.utils.fromWei(totalSupply);
//     console.log(`Total Supply: ${_totalSupply}`);
//     assert.strictEqual(
//       Number(_totalSupply),
//       100000,
//       "10000 wasn't in the first account"
//     );
//   });
// });

// contract("RewardToken", () => {
//   it("should deploy token contract", async () => {
//     const instance = await RewardToken.deployed();
//     const totalSupply = await instance.totalSupply();
//     let _totalSupply = web3.utils.fromWei(totalSupply);
//     console.log(`Total Supply: ${_totalSupply}`);
//     assert(
//       Number(_totalSupply) === 100000,
//       "10000 wasn't in the first account"
//     );
//   });
// });

contract("TokenFarm", (accounts) => {
  const staker1 = accounts[1];
  const staker0 = accounts[0];
  console.log(`staker1: ${staker1}`);
  console.log(`sta
  ker0: ${staker0}`);
  let _stakeToken;
  let _rewardToken;
  let _tokenFarm;

  before(async () => {
    _stakeToken = await StakeToken.deployed();
    _rewardToken = await RewardToken.deployed();
    _tokenFarm = await TokenFarm.new(
      _stakeToken.address,
      _rewardToken.address,
      { from: staker0 }
    );
  });

  it("should deploy token contract", async () => {
    const instance = await TokenFarm.deployed();
    const name = await instance.name.call();
    console.log(`Name: ${name}`);
    assert(name === "Colin Token Farm", "empty");
  });

  it("should get 300 tokens from contract", async () => {
    let _bal0 = await _stakeToken.balanceOf(staker0);
    console.log(`staker0 balance: ${web3.utils.fromWei(_bal0)}`);
    await _stakeToken.transfer(staker1, web3.utils.toWei("300", "ether"), {
      from: staker0,
    });
    _bal0 = await _stakeToken.balanceOf(staker0);
    console.log(`staker0 balance: ${web3.utils.fromWei(_bal0)}`);
    const _bal = await _stakeToken.balanceOf(staker1);
    console.log(`staker1 balance: ${web3.utils.fromWei(_bal)}`);
    assert(Number(web3.utils.fromWei(_bal)) === 300, "staker1 should have 300");
  });

  it("should deposit 200 into token farm", async () => {
    let _bal0 = await _stakeToken.balanceOf(staker0);
    console.log(`staker0 balance: ${web3.utils.fromWei(_bal0)}`);
    await _stakeToken.approve(
      _tokenFarm.address,
      web3.utils.toWei("400", "ether"),
      { from: staker0 }
    );
    let _allowance = await _stakeToken.allowance(staker0, _tokenFarm.address, {
      from: staker0,
    });
    console.log(`Allowance: ${web3.utils.fromWei(_allowance)}`);
    await _tokenFarm.stakeTokens(web3.utils.toWei("200", "ether"), {
      from: staker0,
    });

    _bal0 = await _stakeToken.balanceOf(staker0);
    console.log(`staker0 balance: ${web3.utils.fromWei(_bal0)}`);

    var _stakeBal = await _tokenFarm.stakingBalance(staker0);
    console.log(`Staker0 Staking balance: ${web3.utils.fromWei(_stakeBal)}`);
    assert(Number(web3.utils.fromWei(_stakeBal)) === 200, "not staking 200");

    var _isStaking = await _tokenFarm.isStaking(staker0);
    console.log(`Staker0 isStaking: ${_isStaking}`);
    assert(_isStaking === true, "staker0 is not staking");
  });

  // first staking will not give any reward. calculate yield will only kick in during unstake and withYield function.
  /// Test for stake again and see reward
  it("should have reward balance", async () => {
    let _stakeBal = await _tokenFarm.stakingBalance(staker0);
    console.log(
      `Before more Staker0 Staking balance: ${web3.utils.fromWei(_stakeBal)}`
    );

    const tokensToStake = web3.utils.toWei("200", "ether");
    await _stakeToken.approve(_tokenFarm.address, tokensToStake, {
      from: staker0,
    });
    console.log(
      `Approved ${web3.utils.fromWei(tokensToStake)} from ${staker0}`
    );

    let _allowance = await _stakeToken.allowance(staker0, _tokenFarm.address, {
      from: staker0,
    });
    console.log(`Allowance: ${web3.utils.fromWei(_allowance)}`);

    await _tokenFarm.stakeTokens(tokensToStake, {
      from: staker0,
    });
    console.log(
      `Staked ${web3.utils.fromWei(
        tokensToStake
      )} from ${staker0} to tokenFarms`
    );

    const _bal = await _tokenFarm.rewardTokenBalance(staker0);
    console.log(`staker0 reward balance: ${web3.utils.fromWei(_bal)}`);
    assert(
      Number(web3.utils.fromWei(_bal)) > 0,
      "there should be more than 0 reward"
    );

    await _stakeToken.approve(_tokenFarm.address, tokensToStake, {
      from: staker1,
    });
    console.log(
      `Approved ${web3.utils.fromWei(tokensToStake)} from ${staker0}`
    );

    await _tokenFarm.stakeTokens(tokensToStake, {
      from: staker1,
    });
  });

  // test withdraw yield
  it("should withdraw yield", async () => {
    await _tokenFarm.withdrawYield({ from: staker0 });
    let _rwbal = await _tokenFarm.rewardTokenBalance(staker0);
    assert(
      Number(web3.utils.fromWei(_rwbal)) === 0,
      "there should be 0 reward"
    );

    let _stk0RwBal = await _rewardToken.balanceOf(staker0);
    console.log(
      `staker0 rewardtoken balance: ${web3.utils.fromWei(_stk0RwBal)}`
    );
    assert(
      Number(web3.utils.fromWei(_stk0RwBal)) > 0,
      "there should be more than 0 reward"
    );
  });

  // test withdraw yield
  it("should unstake tokens and increase reward", async () => {
    var _stakeBal = await _tokenFarm.stakingBalance(staker1);
    console.log(`Staker1 Staking balance: ${web3.utils.fromWei(_stakeBal)}`);
    assert(Number(web3.utils.fromWei(_stakeBal)) === 200, "not staking 200");

    await _tokenFarm.unstakeTokens(web3.utils.toWei("100", "ether"), {
      from: staker1,
    });

    _stakeBal = await _tokenFarm.stakingBalance(staker1);
    console.log(`Staker1 Staking balance: ${web3.utils.fromWei(_stakeBal)}`);

    let _stk1RwBal = await _tokenFarm.rewardTokenBalance(staker1);
    console.log(
      `staker1 rewardtoken balance: ${web3.utils.fromWei(_stk1RwBal)}`
    );
    assert(
      Number(web3.utils.fromWei(_stk1RwBal)) > 0,
      "there should be more than 0 reward"
    );
  });

  // it("should return correct yield time", async () => {
  //   // get start time
  //   let _starttime = await _tokenFarm.startTime(staker1);
  //   let datetime = new Date(_starttime * 1000);
  //   let normalDate = new Date(_starttime * 1000).toLocaleString("en-GB", {
  //     timeZone: "GMT",
  //   });
  //   console.log(`Staker1 Staking starttime: ${datetime}`);
  //   console.log(`Staker1 Staking starttime: ${normalDate}`);
  //   console.log(`Staker1 Staking starttime: ${_starttime}`);

  //   // calculate stake yield
  // });
});
