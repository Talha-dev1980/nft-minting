require("dotenv").config();
const alchemyKey = process.env.ALCHEMY_KEY;
const contractABI = require("../contract-abi.json");
const contractAddress =  process.env.CONTRACT_ADDRESS;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "Success Connect",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "Failed " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>Don't have metamask Installed</p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "Success Connect",
        };
      } else {
        return {
          address: "",
          status: " Not Connected",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "Failed " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>Don't have metamask Installed</p>
        </span>
      ),
    };
  }
};



export const mintNFT = async () => {
  
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);

  const transactionParameters = {
    to: contractAddress, 
    from: window.ethereum.selectedAddress, 
    data: window.contract.methods
      .safeMint(window.ethereum.selectedAddress)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "Success! transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "Failed! Something went wrong: " + error.message,
    };
  }
};
