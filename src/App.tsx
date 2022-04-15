import { useEffect, useState } from "react";
import {
  getContractModel,
  RewardTokenName,
  StakingTokenName,
  TokenFarmName,
  web3State,
} from "./model/blockchain/blockchainModel";
import "./App.css";
import VideoBackground from "./UI/layout/videoBackground";
import { useDispatch, useSelector } from "react-redux";
import { getContract, getWeb3 } from "./redux/slice/blockchainSlice";
import { RootState } from "./redux/store";
import { Container, createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { ERCContainer } from "./UI/ERCContainer";
import Navbar from "./UI/Navbar";

const theme = createTheme();

function App() {
  // #region Redux
  var dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.blockchain);
  // #endregion

  const [account, setAccount] = useState("");
  const [ERC20TotalSupply, setERC20TotalSupply] = useState<number>(0);
  const [ERC721TotalSupply, setERC721TotalSupply] = useState<number>(0);
  const [web3State, setweb3State] = useState<web3State>();
  const [hello, setHello] = useState("");

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
            />
            <ERCContainer
              name={StakingTokenName}
              isEnable={state.web3 !== undefined}
              contract={state.StakingToken!}
            />
            <ERCContainer
              name={TokenFarmName}
              isEnable={state.web3 !== undefined}
              contract={state.TokenFarm!}
            />
            {/* <StakeTokenContainer
              name="test"
              handleStakeToken={() => {}}
              isEnable={true}
            /> */}
            {/* <ERCContainer
              name="ERC20"
              handleGetContract={() => handleGetContract("erc20")}
              isEnable={state.web3 !== undefined}
            />
            <ERCContainer
              name="ERC721"
              handleGetContract={() => handleGetContract("erc721")}
              isEnable={state.web3 !== undefined}
            /> */}
          </div>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
