import { Button, CircularProgress, Divider, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  KeyValuePair,
  web3Contract,
} from "../model/blockchain/blockchainModel";
import {
  getAddressTokenCount,
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
    let from = state.currentAccount;
    dispatch(
      setIsLoading({ name: contract.name, value: [true] } as KeyValuePair)
    );
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
    let timer: NodeJS.Timeout;
    if (contract.contract !== undefined && state.currentAccount !== "") {
      dispatch(
        setIsLoading({ name: contract.name, value: [true] } as KeyValuePair)
      );
      timer = setTimeout(
        () =>
          dispatch(
            getAddressTokenCount({
              contract: contract.contract!,
              from: state.currentAccount,
              to: "",
              tokenId: "",
              value: "",
            })
          ),
        1000
      );
    }
    return () => clearTimeout(timer);
  }, [contract!.contract, state.currentAccount]);

  return (
    <div
      style={{
        width: "50%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        pointerEvents: isEnable ? "auto" : "none",
        opacity: isEnable ? "1" : "0.5",
        margin: "0 1rem",
      }}
    >
      <div style={{ fontSize: "4rem" }}>{name}</div>
      {contract!.isLoading ? (
        <div
          style={{
            height: "5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <div style={{ fontSize: "4rem" }}>{contract.currentCount}</div>
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
        style={{ background: "aliceblue", margin: "1rem 0" }}
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
