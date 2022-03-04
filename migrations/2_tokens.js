/* eslint-disable no-undef */
const Token1 = artifacts.require("Token1");
const Token2 = artifacts.require("Token2");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async (deployer) => {
  await deployer.deploy(Token1);
  await deployer.deploy(Token2);

  const _token1 = await Token1.deployed();
  const _token2 = await Token2.deployed();

  await deployer.deploy(TokenFarm, _token1.address, _token2.address);
};
