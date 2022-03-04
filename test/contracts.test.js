const assert = require("assert");

const Token1 = artifacts.require("Token1");
const Token2 = artifacts.require("Token2");
const TokenFarm = artifacts.require("TokenFarm");

contract("Token1", () => {
  it("should deploy token contract", async () => {
    const instance = await Token1.deployed();
    const totalSupply = await instance.totalSupply.call();
    console.log(`Total Supply: ${totalSupply.toNumber()}`);
    assert(BigInt(totalSupply) > 0, "10000 wasn't in the first account");
  });
});

contract("Token2", () => {
  it("should deploy token contract", async () => {
    const instance = await Token2.deployed();
    const totalSupply = await instance.totalSupply.call();
    console.log(`Total Supply: ${totalSupply.toNumber()}`);
    assert(BigInt(totalSupply) > 0, "10000 wasn't in the first account");
  });
});

contract("TokenFarm", () => {
  beforeEach(async () => {
    const _token1 = await Token1.deployed();
    const _token2 = await Token2.deployed();
    this.test = await TokenFarm.new(_token1.address, _token2.address);
  });

  it("should deploy token contract", async () => {
    const instance = await TokenFarm.deployed();
    const name = await instance.name.call();
    console.log(`Name: ${name}`);
    assert(name !== "", "empty");
  });
});
