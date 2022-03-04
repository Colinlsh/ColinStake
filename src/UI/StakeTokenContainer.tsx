import { TextField } from "@mui/material";
import React, { useState } from "react";

interface StakeTokenContainerProps {
  name: string;
  handleStakeToken: () => void;
  isEnable: boolean;
}
const StakeTokenContainer: React.FC<StakeTokenContainerProps> = ({
  name,
  handleStakeToken,
  isEnable,
}) => {
  const [stakeAmount, setStakeAmount] = useState(0);

  return (
    <div>
      <TextField
        style={{ background: "aliceblue", marginBottom: "1rem" }}
        label="To Address"
        variant="filled"
        onChange={(e) => setStakeAmount(parseInt(e.target.value))}
      />
    </div>
  );
};

export default StakeTokenContainer;
