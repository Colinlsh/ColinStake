import { useEffect, useState } from "react";
import {
  getContractModel,
  RewardTokenName,
  StakingTokenName,
  TokenFarmName,
  web3Contract,
  web3State,
} from "./model/blockchain/blockchainModel";
import "./App.css";
import VideoBackground from "./UI/layout/videoBackground";
import { useDispatch, useSelector } from "react-redux";
import {
  getContract,
  getWeb3,
  setIsLoading,
  stakeToken,
  transferToken,
} from "./redux/slice/blockchainSlice";
import { RootState } from "./redux/store";
import { Container, createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { ERCContainer } from "./UI/ERCContainer";
import Navbar from "./UI/Navbar";
import StakeTokenContainer from "./UI/StakeTokenContainer";

const theme = createTheme();

function App() {
  // #region Redux
  var dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.blockchain);
  // #endregion

  const init = () => {
    dispatch(getWeb3());
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (state.web3 !== undefined) {
      handleGetContract(RewardTokenName);
      handleGetContract(StakingTokenName);
      handleGetContract(TokenFarmName);
    }
  }, [state.web3, state.currentAccount]);

  const handleGetContract = (contractName: string) => {
    dispatch(
      getContract({
        web3: state.web3!,
        contractName: contractName,
      } as getContractModel)
    );
  };

  const handleStakeToken = (amount: string) => {
    dispatch(
      stakeToken({
        stakecontract: state.StakingToken!,
        tokenFarmcontract: state.TokenFarm!,
        value: amount,
        owner: state.currentAccount,
      })
    );
  };

  const handleTransfer = (
    contract: web3Contract,
    to: string,
    amount: string
  ) => {
    let from = state.currentAccount;
    dispatch(setIsLoading({ name: contract.name, value: [true] }));
    dispatch(
      transferToken({
        contract: contract.contract!,
        from: from,
        to: to,
        tokenId: "",
        value: amount,
      })
    );
  };

  return (
    <div>
      <VideoBackground />
      <ThemeProvider theme={theme}>
        <Navbar />
        <Container
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>Wallet Address</div>
          <div>{state.currentAccount}</div>
        </Container>
        <Container
          style={{
            padding: "2rem 0",
            alignItems: "center",
            height: "100%",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <ERCContainer
              name={RewardTokenName}
              isEnable={state.web3 !== undefined}
              contract={state.RewardToken!}
              handleTransfer={handleTransfer}
            />
            <div>
              <ERCContainer
                name={StakingTokenName}
                isEnable={state.web3 !== undefined}
                contract={state.StakingToken!}
                handleTransfer={handleTransfer}
              />
              <StakeTokenContainer
                handleStakeToken={handleStakeToken}
                isEnable={true}
              />
            </div>
            <ERCContainer
              name={TokenFarmName}
              isEnable={state.web3 !== undefined}
              contract={state.TokenFarm!}
              handleTransfer={() => {}}
            />
          </div>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
