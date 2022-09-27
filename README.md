# Multi-Signature Wallet DApp
A MultiSig wallet is a digital wallet that operates with multisignature addresses. This means that it requires more than one private key to sign and authorize a crypto transaction.

A decentralised multisignature crypto digital wallet helps users to create multiple wallets and add multiple owners. It even enables the user to deposit and withdraw ETH, and multiple other ERC20 token in the wallet and lets user to send a transaction that needs to be approved by other owners of the wallet.

Smart Contract is deployed on the Ethereum Sepolia Network.

![multisigwallet-functioning](https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/HX2VPWTONNDWVPOLCFVD3X2YHM.png)

# Features

* The contract supports ETh & 2 test tokens; DAI, LINK
* User can create new wallets and Add or Remove Owners to the wallet
* User can deposit and withdraw Eth and tokens in wallet.
* Usage of **Factory Contract**: A factory contract deploy a new smart contract from a smart contract class. In this way, it can deploy multiple smart contracts with different parameters directly from the blockchain itself
* Integration with web3 wallets (Metamask)
* Interacting with any contracts with UI support
* User can create a transaction which will deposit Eth or ERC20 tokens in the receivers account.
* **Multisig Wallet n-of-m**: Transactions require some of the keys, but not necessarily all of them, to be authorized (1-of-2, 2-of-3, 3-of-5 etc.).


# Technologies
1. **Open Zeppelin**: The contract uses IERC20 of OpenZeppelin create an instance of a token and also, it uses the Ownable contract of the OpenZepppelin to ensure security of the contract
3. **Truffle**: Truffle is a development environment, asset pipeline, and testing framework for developing smart contracts.
4. **Ganache**: Ganache is used as blockchain for local testing. 
5. **Next JS**: Next JS is the front end framework used to ensure flexible user interaction.
6. **Tailwind CSS**
7. **Metamask**
8. **web3.js**


# Programming Languages
1. Solidity
2. Truffle
3. Javascript
4. Next.js

# What to Install
1. Tailwind CSS: Install tailwind css [here](https://tailwindcss.com/docs/installation)

# How to use
1. To deploy solidity smart contract on Sepolia Network
```
truffle deploy --network sepolia
```
2. Deploy Smart Contract on local blockchain using Ganache
```
truffle migrate --reset
```
3. Start the Server
```
npm run dev
```
 # Developer
 Let's Connect! 👋 👋 
 ```
 Paras Gaur - 
    Email - parasgr484@gmail.com
    Linkedin - https://www.linkedin.com/in/paras-gaur/
    Website - https://paras-portfolio-flame.vercel.app/
 ```

