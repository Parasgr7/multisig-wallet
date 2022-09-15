const ERCToken= artifacts.require('ERCToken')
const MultiSigWallet = artifacts.require('MultiSigWallet')
const MultiSigFactory = artifacts.require('MultiSigFactory')

module.exports = async function(deployer, network, accounts) {

    const token_info = {
      "Chainlink" : "LINK",
      "LAR Token" : "LAR",
      "DAI token" : "DAI"
    }

    await deployer.deploy(MultiSigFactory)
    const multisig_factory = await MultiSigFactory.deployed()

    await deployer.deploy(MultiSigWallet, multisig_factory.address)
    const multisig_wallet = await MultiSigWallet.deployed()


    await multisig_factory.addNewWalletInstance(accounts[0],multisig_wallet.address)

    for (let key in token_info) {
      await deployer.deploy(ERCToken,key, token_info[key])
      let erc_token = await ERCToken.deployed()
      await multisig_wallet.addToken(token_info[key],erc_token.address)
    }

}
