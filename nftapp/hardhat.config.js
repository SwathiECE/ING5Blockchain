require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: './src/artifacts'
  },
  networks: {
    goerli: {
      url: "https://goerli.infura.io/v3/7fb0838ebba54ca58a05e95618c044b6",
      // cle privée de mon wallet
      
    }

  }
};