import Web3 from "web3";
import { Contract } from "web3-eth-contract";

export interface web3State {
  currentAccount: string;
  web3: Web3 | undefined;
  ERC20contract: web3Contract | undefined;
  ERC721contract: web3Contract | undefined;
  isLoading: boolean;
}

export interface web3Contract {
  contract: Contract | undefined;
  totalSupply: number;
}

export interface mintModel {
  web3: Web3;
  currentAccount: string;
  contract: Contract;
  to: string;
  amount: string;
}

export interface burnModel {
  currentAccount: string;
  tokenId: string;
  contract: Contract;
}

export interface transactionModel {
  currentAccount: string;
  contract: Contract;
  to: string;
  tokenId: string;
}
