import { useEffect, useState } from "react";
import {ens_normalize} from '@adraffy/ens-normalize';
import axios from "axios";
import { ethers } from 'ethers';
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT,
} from "./util/interact.js";

const Minter = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [conButtonText, connectedButtonText] = useState("Connected");
  const [currBalance, setBalance] = useState("");
  const [userId, setUser] = useState("");


useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          connectedButtonText("Wallet Connected")
          getAccountBalance(accounts[0].toString());
        } else {
          setWallet("");
        }
      });
    } else {
      setStatus(
        <p>
          MetaMask Not found
        </p>
      );
    }
  }
  const getAccountBalance = async (account) => {
    window.ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] })
      .then(balance => {
        setBalance(ethers.formatEther(balance));
      })
      await axios
      .post(`https://backend.celebritygames.net/api/v1/user/`, {
        walletAddress: walletAddress,
      }, {
        headers: { "authorization": `Bearer bIq7Olx4abs2zDM01DMMEgt33fbEe54fuTBncWdXFhWYOs3CrKZt86atzL3-CJdExpP4` }
      })
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user._id);
          localStorage.setItem("tokenCelebrity", res.data.token);
          // loadProfile();
          console.log(userId, 'users')
        } else {
          setUser("")
        }
      })
      .catch(error => {
        console.log(error.message);
      });
    }
    const connectWalletPressed = async () => {
      const walletResponse = await connectWallet();
      setStatus(walletResponse.status);
      setWallet(walletResponse.address);
    };

    const onMintPressed = async () => {
       const { success, status } = await mintNFT();
      setStatus(success+status);

    };

    return (
      <div className="Minter">
        <button id="walletButton" onClick={connectWalletPressed}>
          {conButtonText}
        </button>
        <p>
          {walletAddress.length > 0 ? (
            "Connected: " +
            String(walletAddress).substring(0, 6) +
            "..." +
            String(walletAddress).substring(38)
          ) : (
            <span>Connect Wallet</span>
          )}</p>
          <p>{currBalance}</p>
          <p>{userId+""}</p>
        <br></br>
        <h1 id="title">NFT Minting</h1>

        <button id="button" onClick={onMintPressed}>
          Mint NFT
        </button>
        <p id="status" style={{ color: "red" }}>
          {status}
        </p>
      </div>
    );
  };

  export default Minter;
