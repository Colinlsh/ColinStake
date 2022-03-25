import Web3 from "web3";
import { Contract } from "web3-eth-contract";

export interface web3State {
  currentAccount: string;
  web3: Web3 | undefined;
  RewardToken: web3Contract | undefined;
  StakingToken: web3Contract | undefined;
  TokenFarm: web3Contract | undefined;
}

export interface web3Contract {
  name: string;
  address: string;
  contract: Contract | undefined;
  totalSupply: number;
  isLoading: boolean;
}

export interface transactionModel {
  contract: Contract;
  from: string;
  to: string;
  tokenId: string;
  value: any;
}

export interface getContractModel {
  web3: Web3;
  contractName: string;
}

export interface KeyValuePair {
  name: string;
  value: any[];
}

export const RewardTokenName = "RewardToken";
export const StakingTokenName = "StakingToken";
export const TokenFarmName = "TokenFarm";
