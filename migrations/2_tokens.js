/* eslint-disable no-undef */
const StakingToken = artifacts.require("StakingToken");
const RewardToken = artifacts.require("RewardToken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async (deployer) => {
  await deployer.deploy(StakingToken);
  await deployer.deploy(RewardToken);

  const _token1 = await StakingToken.deployed();
  const _token2 = await RewardToken.deployed();

  await deployer.deploy(TokenFarm, _token1.address, _token2.address);
};
