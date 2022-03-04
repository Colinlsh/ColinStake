import { Button, CircularProgress, Divider, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  burnERC721,
  getERC20TotalSupply,
  getERC721TotalSupply,
  pauseERC721,
  safeTransferERC721,
  setERC20Mint,
  setERC721Mint,
  setIsLoading,
  unpauseERC721,
} from "../redux/slice/blockchainSlice";
import { RootState } from "../redux/store";
import { burnModel } from "../model/blockchain/blockchainModel";

interface ERCContainerProps {
  name: string;
  handleGetContract: () => void;
  isEnable: boolean;
}

export const ERCContainer: React.FC<ERCContainerProps> = ({
  name = "",
  handleGetContract = () => {},
  isEnable = true,
}) => {
  // #region Redux
  var dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.blockchain);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  // #endregion

  const handleMintToken = (to: string, amount: string) => {
    if (name === "ERC20") {
      dispatch(
        setERC20Mint({
          web3: state.web3!,
          contract: state.ERC20contract!.contract!,
          to: to,
          amount: amount,
          currentAccount: state.currentAccount,
        })
      );
    } else {
      dispatch(
        setERC721Mint({
          web3: state.web3!,
          contract: state.ERC721contract!.contract!,
          to: to,
          amount: amount,
          currentAccount: state.currentAccount,
        })
      );
    }

    dispatch(setIsLoading(true));
  };

  const handlePauseToken = () => {
    if (!isPaused) {
      dispatch(
        pauseERC721({
          currentAccount: state.currentAccount,
          contract: state.ERC721contract!.contract!,
          to: "",
          tokenId: "",
        })
      );
    } else {
      dispatch(
        unpauseERC721({
          currentAccount: state.currentAccount,
          contract: state.ERC721contract!.contract!,
          to: "",
          tokenId: "",
        })
      );
    }

    setIsPaused(!isPaused);
  };

  const handleSafeTransfer = (to: string, tokenId: string) => {
    dispatch(
      safeTransferERC721({
        currentAccount: state.currentAccount,
        contract: state.ERC721contract!.contract!,
        to: to,
        tokenId: tokenId,
      })
    );
  };

  const handleBurnToken = (tokenId: string) => {
    dispatch(
      burnERC721({
        currentAccount: state.currentAccount,
        contract: state.ERC721contract!.contract!,
        tokenId: tokenId,
      } as burnModel)
    );
    dispatch(setIsLoading(true));
  };

  useEffect(() => {
    if (state.ERC721contract?.contract !== undefined) {
      dispatch(getERC721TotalSupply(state.ERC721contract.contract));
    }
  }, [state.ERC721contract?.contract]);

  useEffect(() => {
    if (state.ERC20contract?.contract !== undefined) {
      dispatch(getERC20TotalSupply(state.ERC20contract.contract));
    }
  }, [state.ERC20contract?.contract]);

  // set loading time out to be 1 second
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state.isLoading) {
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [state.isLoading]);

  return (
    <div
      style={{
        width: "50%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        pointerEvents: isEnable ? "auto" : "none",
        opacity: isEnable ? "1" : "0.5",
      }}
    >
      <div style={{ fontSize: "4rem" }}>COLIN {name}</div>
      {state.isLoading ? (
        <CircularProgress />
      ) : (
        <div style={{ fontSize: "4rem" }}>
          {name === "ERC20"
            ? state.ERC20contract?.totalSupply
            : state.ERC721contract?.totalSupply}
        </div>
      )}
      <Button
        color="secondary"
        variant="contained"
        sx={{ mt: 3, mb: 3 }}
        style={{ backgroundColor: "#21b6ae" }}
        onClick={handleGetContract}
      >
        Get {name} contract
      </Button>
      <TextField
        style={{ background: "aliceblue", marginBottom: "1rem" }}
        label="To Address"
        variant="filled"
        onChange={(e) => setToAddress(e.target.value)}
      />
      {name === "ERC20" ? (
        <TextField
          style={{ background: "aliceblue" }}
          label="Amount"
          variant="filled"
          onChange={(e) => setAmount(e.target.value)}
        />
      ) : (
        ""
      )}
      <Button
        color="secondary"
        variant="contained"
        sx={{ mt: 3, mb: 3 }}
        style={{ backgroundColor: "#21b6ae" }}
        onClick={() => handleMintToken(toAddress, amount)}
      >
        MINT
      </Button>

      {name === "ERC20" ? (
        ""
      ) : (
        <>
          <Divider
            variant="middle"
            style={{ backgroundColor: "aliceblue", width: "100%" }}
          />
          <TextField
            style={{
              background: "aliceblue",
              marginBottom: "1rem",
              marginTop: "1rem",
            }}
            label="Token ID"
            variant="filled"
            onChange={(e) => setTokenId(e.target.value)}
          />
          <Button
            color="secondary"
            variant="contained"
            sx={{ mt: 3, mb: 3 }}
            style={{ backgroundColor: "#21b6ae" }}
            onClick={() => handleBurnToken(tokenId)}
          >
            BURN
          </Button>
          <Divider
            variant="middle"
            style={{ backgroundColor: "aliceblue", width: "100%" }}
          />
          <TextField
            style={{
              background: "aliceblue",
              marginBottom: "1rem",
              marginTop: "1rem",
            }}
            label="To Address"
            variant="filled"
            onChange={(e) => setToAddress(e.target.value)}
          />
          <TextField
            style={{ background: "aliceblue", marginBottom: "1rem" }}
            label="Token ID"
            variant="filled"
            onChange={(e) => setTokenId(e.target.value)}
          />
          <div>
            <Button
              color="secondary"
              variant="contained"
              sx={{ mt: 3, mb: 3, mr: 1 }}
              style={{ backgroundColor: "#21b6ae" }}
              onClick={() => handleSafeTransfer(toAddress, tokenId)}
            >
              Transfer
            </Button>
            <Button
              color="secondary"
              variant="contained"
              sx={{ mt: 3, mb: 3, ml: 1 }}
              style={{ backgroundColor: "#21b6ae" }}
              onClick={() => handlePauseToken()}
            >
              {isPaused ? "UNPAUSE" : "PAUSE"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
