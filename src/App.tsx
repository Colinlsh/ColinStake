import React, { useEffect, useState } from "react";
import { web3State } from "./model/blockchain/blockchainModel";
import "./App.css";
import VideoBackground from "./UI/layout/videoBackground";
import { useDispatch, useSelector } from "react-redux";
import {
  getERC20Contract,
  getERC721Contract,
  getERC721TotalSupply,
  getWeb3,
} from "./redux/slice/blockchainSlice";
import { RootState } from "./redux/store";
import { Button, Container, createTheme, CssBaseline } from "@mui/material";
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

  const handleGetContract = (contractName: string) => {
    if (contractName === "erc20") {
      dispatch(getERC20Contract(state.web3!));
    } else if (contractName === "erc721") {
      dispatch(getERC721Contract(state.web3!));
    }
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
            <StakeTokenContainer
              name="test"
              handleStakeToken={() => {}}
              isEnable={true}
            />
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
