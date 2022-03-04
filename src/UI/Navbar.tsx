import { Button, Container } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccount } from "../redux/slice/blockchainSlice";
import { RootState } from "../redux/store";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Navbar = () => {
  // #region Redux
  var dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.blockchain);
  // #endregion
  //   const [account, setAccount] = useState("");

  const handleConnectWallet = async () => {
    let accounts = await state.web3?.eth.requestAccounts();
    console.log(accounts);
    dispatch(setAccount(accounts![0]));
  };

  return (
    <Container
      style={{
        padding: "2rem 0",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      <div
        onClick={(e) => {
          e.preventDefault();
          window.open(
            "https://www.linkedin.com/in/colin-lee-181ba7112/",
            "_blank"
          ); //to open new page
        }}
        style={{
          display: "flex",
          flexDirection: "row",
          cursor: "pointer",
          backgroundColor: "black",
          padding: "0.5rem",
          width: "20rem",
          justifyContent: "center",
        }}
      >
        <div style={{ alignSelf: "center" }}>COLIN | FIND ME HERE</div>
        <LinkedInIcon style={{ alignSelf: "center" }} />
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          style={{
            backgroundColor: "#21b6ae",
          }}
          onClick={handleConnectWallet}
        >
          Connect Wallet
        </Button>
      </div>
    </Container>
  );
};

export default Navbar;
