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
  mintModel,
  burnModel,
  transactionModel,
} from "../../model/blockchain/blockchainModel";

import COLINERC721 from "../../blockchain/build/Token1.json";
import COLINERC20 from "../../blockchain/build/Token2.json";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";

// #region Async thunk
export const getWeb3 = createAsyncThunk("blockchain/getWeb3", async () => {
  const _web3 = new Web3(
    Web3.givenProvider ||
      new Web3.providers.WebsocketProvider(
        process.env.REACT_APP_INFURA_API_URL!
      )
  );

  return _web3;
});

export const getERC20Contract = createAsyncThunk(
  "blockchain/getERC20Contract",
  async (web3: Web3) => {
    let id = await web3.eth.net.getId();
    let deployedNetwork = (COLINERC20.networks as any)[id];
    let _contract = new web3.eth.Contract(
      COLINERC20.abi as AbiItem[],
      deployedNetwork && deployedNetwork.address
    );

    return _contract;
  }
);

export const getERC20TotalSupply = createAsyncThunk(
  "blockchain/getERC20TotalSupply",
  async (contract: Contract) => {
    let num = await contract.methods.totalSupply().call();
    return num;
  }
);

export const setERC20Mint = createAsyncThunk(
  "blockchain/setERC20Mint",
  async (mint: mintModel) => {
    try {
      await mint.contract.methods
        .mint(mint.to, Web3.utils.toBN(Web3.utils.toWei(mint.amount)))
        .send({ from: mint.currentAccount });
    } catch (error) {
      console.log(`${error}`);
    }

    return await mint.contract.methods.totalSupply().call();
  }
);

export const getERC721Contract = createAsyncThunk(
  "blockchain/getERC721Contract",
  async (web3: Web3) => {
    let id = await web3.eth.net.getId();
    let deployedNetwork = (COLINERC721.networks as any)[id];
    let _contract = new web3.eth.Contract(
      COLINERC721.abi as AbiItem[],
      deployedNetwork && deployedNetwork.address
    );

    return _contract;
  }
);

export const getERC721TotalSupply = createAsyncThunk(
  "blockchain/getERC721TotalSupply",
  async (contract: Contract) => {
    let num = await contract.methods.totalSupply().call();
    return num;
  }
);

export const setERC721Mint = createAsyncThunk(
  "blockchain/setERC721Mint",
  async (mint: mintModel) => {
    await mint.contract.methods
      .safeMint(mint.to)
      .send({ from: mint.currentAccount });

    return await mint.contract.methods.totalSupply().call();
  }
);

export const burnERC721 = createAsyncThunk(
  "blockchain/burnERC721",
  async (burn: burnModel) => {
    await burn.contract.methods
      .burn(Number(burn.tokenId))
      .send({ from: burn.currentAccount });

    return await burn.contract.methods.totalSupply().call();
  }
);

export const pauseERC721 = createAsyncThunk(
  "blockchain/pauseERC721",
  async (pause: transactionModel) => {
    await pause.contract.methods.pause().send({ from: pause.currentAccount });

    return await pause.contract.methods.totalSupply().call();
  }
);

export const unpauseERC721 = createAsyncThunk(
  "blockchain/unpauseERC721",
  async (pause: transactionModel) => {
    await pause.contract.methods.unpause().send({ from: pause.currentAccount });

    return await pause.contract.methods.totalSupply().call();
  }
);

export const safeTransferERC721 = createAsyncThunk(
  "blockchain/safeTransferERC721",
  async (safeTransfer: transactionModel) => {
    await safeTransfer.contract.methods
      .safeTransferFrom(safeTransfer.to, Number(safeTransfer.tokenId))
      .send({ from: safeTransfer.currentAccount });

    return await safeTransfer.contract.methods.totalSupply().call();
  }
);

const blockchainSlice: Slice<
  web3State,
  SliceCaseReducers<web3State>,
  "blockchain"
> = createSlice({
  name: "blockchain",
  initialState: {
    currentAccount: "0x0",
    web3: undefined,
    ERC20contract: {
      contract: undefined,
      totalSupply: 0,
    },
    ERC721contract: {
      contract: undefined,
      totalSupply: 0,
    },
  } as web3State,
  reducers: {
    setAccount: (state, action) => {
      state.currentAccount = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getWeb3.fulfilled, (state, action: PayloadAction<Web3>) => {
      state.web3 = action.payload;
    });

    // builder.addCase(
    //   getERC721Contract.fulfilled,
    //   (state, action: PayloadAction<Contract>) => {
    //     state.ERC721contract!.contract = action.payload;
    //   }
    // );

    // builder.addCase(
    //   getERC20Contract.fulfilled,
    //   (state, action: PayloadAction<Contract>) => {
    //     state.ERC20contract!.contract = action.payload;
    //   }
    // );

    builder.addCase(
      getERC20TotalSupply.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.ERC20contract!.totalSupply = Number(
          Web3.utils.fromWei(action.payload, "ether")
        );
        console.log(action.payload);
      }
    );

    builder
      .addCase(
        setERC20Mint.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.ERC20contract!.totalSupply = Number(
            Web3.utils.fromWei(action.payload, "ether")
          );
          state.isLoading = false;
        }
      )
      .addCase(setERC20Mint.rejected, (state, action) => {
        console.log(action.payload);
      });

    builder.addCase(
      getERC721TotalSupply.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.ERC721contract!.totalSupply = action.payload;
        console.log(action.payload);
      }
    );

    builder.addCase(
      setERC721Mint.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.ERC721contract!.totalSupply = action.payload;
        state.isLoading = false;
      }
    );

    builder.addCase(
      burnERC721.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.ERC721contract!.totalSupply = action.payload;
        state.isLoading = false;
      }
    );

    builder.addCase(
      pauseERC721.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.ERC721contract!.totalSupply = action.payload;
        state.isLoading = false;
      }
    );

    builder.addCase(
      unpauseERC721.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.ERC721contract!.totalSupply = action.payload;
        state.isLoading = true;
      }
    );

    builder.addCase(
      safeTransferERC721.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.isLoading = true;
      }
    );
  },
});

export const { setAccount, setIsLoading } = blockchainSlice.actions;

export default blockchainSlice.reducer;
