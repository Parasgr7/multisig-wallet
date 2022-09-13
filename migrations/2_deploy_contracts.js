const ERCToken= artifacts.require('ERCToken')
const MultiSigWallet = artifacts.require('MultiSigWallet')

module.exports = async function(deployer, network, accounts) {

    const token_info = {
      "Chainlink" : "LINK",
      "LAR Token" : "LAR",
      "DAI token" : "DAI"
    }
    await deployer.deploy(MultiSigWallet)
    const multisig_wallet = await MultiSigWallet.deployed()

    for (let key in token_info) {
      await deployer.deploy(ERCToken,key, token_info[key])
      let erc_token = await ERCToken.deployed()
      await multisig_wallet.addToken(token_info[key],erc_token.address)
    }

}
