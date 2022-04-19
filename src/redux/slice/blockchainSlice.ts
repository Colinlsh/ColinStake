import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Slice,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import Web3 from "web3";
import {
  web3State,
  transactionModel,
  getContractModel,
  stakeTokenModel,
  RewardTokenName,
  StakingTokenName,
  TokenFarmName,
  KeyValuePair,
} from "../../model/blockchain/blockchainModel";

import RewardToken from "../../blockchain/build/RewardToken.json";
import StakingToken from "../../blockchain/build/StakingToken.json";
import TokenFarm from "../../blockchain/build/TokenFarm.json";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";

const contractObject = [
  {
    name: RewardTokenName,
    value: RewardToken,
  },
  {
    name: StakingTokenName,
    value: StakingToken,
  },
  {
    name: TokenFarmName,
    value: TokenFarm,
  },
];

// #region Async thunk
export const getWeb3 = createAsyncThunk("blockchain/getWeb3", async () => {
  const _web3 = new Web3(
    Web3.givenProvider ||
      new Web3.providers.WebsocketProvider(process.env.REACT_APP_LOCAL_GANACHE!)
  );

  return _web3;
});

export const getContract = createAsyncThunk(
  "blockchain/getContract",
  async (params: getContractModel) => {
    let { web3, contractName } = params;
    let _conJson = contractObject.filter(
      (x) => x.name === contractName
    )[0] as any;
    let id = await web3.eth.net.getId();
    let deployedNetwork = _conJson.value.networks[id];
    let _contract = new web3.eth.Contract(
      _conJson.value.abi as AbiItem[],
      deployedNetwork && deployedNetwork.address
    );

    let address = deployedNetwork.address;

    return { name: contractName, value: [_contract, address] } as KeyValuePair;
  }
);

export const getContractTotalSupply = createAsyncThunk(
  "blockchain/getContractTotalSupply",
  async (contract: Contract) => {
    let num = await contract.methods.totalSupply().call();
    let name = await contract.methods.name().call();
    return { name: name, value: [num] } as KeyValuePair;
  }
);

export const getAddressTokenCount = createAsyncThunk(
  "blockchain/getAddressTokenCount",
  async (transactionModel: transactionModel) => {
    let { contract, from, to, tokenId, value } = transactionModel;
    let name = await contract.methods.name().call();
    let num;
    if (name !== TokenFarmName) {
      num = await contract.methods.balanceOf(from).call();
    } else {
      num = await contract.methods.stakingBalance(from).call();
    }

    return { name: name, value: [num] } as KeyValuePair;
  }
);

export const transferToken = createAsyncThunk(
  "blockchain/transferToken",
  async (transferModel: transactionModel) => {
    let name = await transferModel.contract.methods.name().call();
    // transfer from token
    await transferModel.contract.methods
      .transfer(
        transferModel.to,
        Web3.utils.toWei(transferModel.value, "ether")
      )
      .send({ from: transferModel.from });

    let _totalSupply = await transferModel.contract.methods
      .totalSupply()
      .call();

    let _currentCount = await transferModel.contract.methods
      .balanceOf(transferModel.from)
      .call();

    return { name: name, value: [_totalSupply, _currentCount] } as KeyValuePair;
  }
);

export const stakeToken = createAsyncThunk(
  "blockchain/stakeToken",
  async (stakeTokenModel: stakeTokenModel) => {
    let _stakeContract = stakeTokenModel.stakecontract!.contract!;
    let _tokenFarmContract = stakeTokenModel.tokenFarmcontract!.contract!;
    try {
      // approve token farm to withdraw from staketoken contract for that particular address
      await _stakeContract.methods
        .approve(
          stakeTokenModel.tokenFarmcontract.address,
          Web3.utils.toWei(stakeTokenModel.value, "ether")
        )
        .send({ from: stakeTokenModel.owner });

      // token farm contract will take from stake contract
      await _tokenFarmContract.methods
        .stakeTokens(Web3.utils.toWei(stakeTokenModel.value, "ether"))
        .send({
          from: stakeTokenModel.owner,
        });
    } catch (error) {
      console.log(error);
    }
    let stakeTokenAmt = await _stakeContract.methods
      .balanceOf(stakeTokenModel.owner)
      .call();

    let tokenFarmTokenAmt = await _tokenFarmContract.methods
      .stakingBalance(stakeTokenModel.owner)
      .call();

    return {
      name: "staketoken",
      value: [stakeTokenAmt, tokenFarmTokenAmt],
    } as KeyValuePair;
  }
);

const blockchainSlice: Slice<
  web3State,
  SliceCaseReducers<web3State>,
  "blockchain"
> = createSlice({
  name: "blockchain",
  initialState: {
    currentAccount: "",
    web3: undefined,
    RewardToken: {
      name: RewardTokenName,
      contract: undefined,
      totalSupply: 0,
      isLoading: false,
      currentCount: 0,
    },
    StakingToken: {
      name: StakingTokenName,
      contract: undefined,
      totalSupply: 0,
      isLoading: false,
      currentCount: 0,
    },
    TokenFarm: {
      name: TokenFarmName,
      contract: undefined,
      totalSupply: 0,
      isLoading: false,
      currentCount: 0,
    },
  } as web3State,
  reducers: {
    setAccount: (state, action) => {
      state.currentAccount = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<KeyValuePair>) => {
      let { name, value } = action.payload;
      if (name === RewardTokenName) {
        state.RewardToken!.isLoading = value[0];
      } else if (name === StakingTokenName) {
        state.StakingToken!.isLoading = value[0];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getWeb3.fulfilled, (state, action: PayloadAction<Web3>) => {
      state.web3 = action.payload;
    });

    builder.addCase(
      getContract.fulfilled,
      (state, action: PayloadAction<KeyValuePair>) => {
        let { name, value } = action.payload;
        if (name === RewardTokenName) {
          state.RewardToken!.contract = value[0];
          state.RewardToken!.address = value[1];
        } else if (name === StakingTokenName) {
          state.StakingToken!.contract = value[0];
          state.StakingToken!.address = value[1];
        } else if (name === TokenFarmName) {
          state.TokenFarm!.contract = value[0];
          state.TokenFarm!.address = value[1];
        }
      }
    );

    builder.addCase(
      getContractTotalSupply.fulfilled,
      (state, action: PayloadAction<KeyValuePair>) => {
        let { name, value } = action.payload;

        if (name === RewardTokenName) {
          state.RewardToken!.totalSupply = Number(
            Web3.utils.fromWei(value[0], "ether")
          );
          state.RewardToken!.isLoading = false;
        } else if (name === StakingTokenName) {
          state.StakingToken!.totalSupply = Number(
            Web3.utils.fromWei(value[0], "ether")
          );
          state.StakingToken!.isLoading = false;
        }
        console.log(action.payload);
      }
    );

    builder.addCase(
      transferToken.fulfilled,
      (state, action: PayloadAction<KeyValuePair>) => {
        let { name, value } = action.payload;

        if (name === RewardTokenName) {
          state.RewardToken!.totalSupply = Number(
            Web3.utils.fromWei(value[0], "ether")
          );
          state.RewardToken!.currentCount = Number(
            Web3.utils.fromWei(value[1], "ether")
          );
          state.RewardToken!.isLoading = false;
        } else if (name === StakingTokenName) {
          state.StakingToken!.totalSupply = Number(
            Web3.utils.fromWei(value[0], "ether")
          );
          state.StakingToken!.currentCount = Number(
            Web3.utils.fromWei(value[1], "ether")
          );
          state.StakingToken!.isLoading = false;
        }
      }
    );

    builder.addCase(
      getAddressTokenCount.fulfilled,
      (state, action: PayloadAction<KeyValuePair>) => {
        let { name, value } = action.payload;

        if (name === RewardTokenName) {
          state.RewardToken!.currentCount = Number(
            Web3.utils.fromWei(value[0], "ether")
          );
          state.RewardToken!.isLoading = false;
        } else if (name === StakingTokenName) {
          state.StakingToken!.currentCount = Number(
            Web3.utils.fromWei(value[0], "ether")
          );
          state.StakingToken!.isLoading = false;
        } else if (name === TokenFarmName) {
          state.TokenFarm!.currentCount = Number(
            Web3.utils.fromWei(value[0], "ether")
          );
          state.TokenFarm!.isLoading = false;
        }
      }
    );

    builder.addCase(
      stakeToken.fulfilled,
      (state, action: PayloadAction<KeyValuePair>) => {
        let { name, value } = action.payload;

        state.StakingToken!.currentCount = Number(
          Web3.utils.fromWei(value[0], "ether")
        );
        state.TokenFarm!.currentCount = Number(
          Web3.utils.fromWei(value[1], "ether")
        );
      }
    );
  },
});

export const { setAccount, setIsLoading } = blockchainSlice.actions;

export default blockchainSlice.reducer;
