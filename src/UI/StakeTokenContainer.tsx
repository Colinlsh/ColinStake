import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface StakeTokenContainerProps {
  handleStakeToken: (amount: string) => void;
  isEnable: boolean;
}
const StakeTokenContainer: React.FC<StakeTokenContainerProps> = ({
  handleStakeToken,
  isEnable,
}) => {
  const [stakeAmount, setStakeAmount] = useState("");

  const state = useSelector((state: RootState) => state.blockchain);

  return (
    <div
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <div
        style={{
          fontSize: "2rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        <>Avaliable Stake amount:</>
      </div>
      <div style={{ fontSize: "2rem" }}>
        {}
        {state.StakingToken?.currentCount}
      </div>
      <TextField
        style={{ background: "aliceblue", margin: "1rem 0" }}
        label="Enter amount to stake"
        variant="filled"
        onChange={(e) => setStakeAmount(e.target.value)}
      />
      <Button
        color="secondary"
        variant="contained"
        sx={{ mt: 3, mb: 3, mr: 1 }}
        style={{ backgroundColor: "#21b6ae" }}
        onClick={() => handleStakeToken(stakeAmount)}
      >
        Stake
      </Button>
    </div>
  );
};

export default StakeTokenContainer;
