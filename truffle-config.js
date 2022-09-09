require('babel-register');
require('babel-polyfill');
const path = require("path");
const HDWalletProvider = require('./node_modules/@truffle/hdwallet-provider');
require('./node_modules/dotenv').config();

const MNEMONIC = process.env.MNEMONIC;
const INFURA_API_KEY = process.env.INFURA_API_KEY;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      gasPrice: 25000000000
    },
    kovan: {
      provider: function(){
        return new HDWalletProvider(
          MNEMONIC,
          `https://kovan.infura.io/v3/${INFURA_API_KEY}`
        )
      },
      gas_price: 25000000000,
      network_id: 42
    }
  },
  compilers: {
    solc: {
      version: "0.8.10",    // Fetch exact version from solc-bin (default: truffle's version)
    }
  },
  contracts_directory: './contracts/',
  contracts_build_directory: './abis/',
}