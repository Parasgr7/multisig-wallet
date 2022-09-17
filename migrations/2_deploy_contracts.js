const MultiSigWallet = artifacts.require('MultiSigWallet')
const MultiSigFactory = artifacts.require('MultiSigFactory')
const LinkToken = artifacts.require('Link')
const DaiToken = artifacts.require('Dai')

module.exports = async function(deployer, network, accounts) {

    await deployer.deploy(MultiSigFactory)
    const multisig_factory = await MultiSigFactory.deployed()

    await deployer.deploy(MultiSigWallet, multisig_factory.address)
    const multisig_wallet = await MultiSigWallet.deployed()

    await multisig_factory.addNewWalletInstance(accounts[0],multisig_wallet.address)

    await deployer.deploy(LinkToken)
    let chainlink_token = await LinkToken.deployed()
    await multisig_wallet.addToken("LINK",chainlink_token.address)

    await deployer.deploy(DaiToken)
    let dai_token = await DaiToken.deployed()
    await multisig_wallet.addToken("DAI",dai_token.address)


}
