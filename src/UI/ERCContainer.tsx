import { Button, CircularProgress, Divider, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  KeyValuePair,
  web3Contract,
} from "../model/blockchain/blockchainModel";
import {
  getContractTotalSupply,
  setIsLoading,
  transferToken,
} from "../redux/slice/blockchainSlice";
import { RootState } from "../redux/store";

interface ERCContainerProps {
  name: string;
  isEnable: boolean;
  contract: web3Contract;
}

export const ERCContainer: React.FC<ERCContainerProps> = ({
  name = "",
  isEnable = true,
  contract,
}) => {
  // #region Redux
  var dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.blockchain);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  // #endregion

  const handleTransfer = (to: string, amount: string) => {
    let from = state.StakingToken!.address;
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

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "");
    setAmount(value);
  };

  useEffect(() => {
    if (contract.contract !== undefined) {
      dispatch(getContractTotalSupply(contract.contract!));
    }
  }, [contract!.contract]);

  // set loading time out to be 1 second
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (contract!.isLoading) {
      timer = setTimeout(() => {
        setIsLoading({ name: contract!.name, value: [true] } as KeyValuePair);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [contract!.isLoading]);

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
      {contract!.isLoading ? (
        <CircularProgress />
      ) : (
        <div style={{ fontSize: "4rem" }}>{contract.totalSupply}</div>
      )}
      <TextField
        style={{ background: "aliceblue", marginBottom: "1rem" }}
        label="To Address"
        variant="filled"
        onChange={(e) => setToAddress(e.target.value)}
      />
      <Divider
        variant="middle"
        style={{ backgroundColor: "aliceblue", width: "100%" }}
      />
      <TextField
        style={{ background: "aliceblue", marginBottom: "1rem" }}
        label="Amount"
        variant="filled"
        onChange={(e) => handleAmountChange(e)}
      />
      <div>
        <Button
          color="secondary"
          variant="contained"
          sx={{ mt: 3, mb: 3, mr: 1 }}
          style={{ backgroundColor: "#21b6ae" }}
          onClick={() => handleTransfer(toAddress, amount)}
        >
          Transfer
        </Button>
      </div>
    </div>
  );
};
