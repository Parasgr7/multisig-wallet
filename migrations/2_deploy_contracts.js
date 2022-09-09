const LinkToken= artifacts.require('Link')
const MultiSigWallet = artifacts.require('MultiSigWallet')

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(LinkToken)
    await deployer.deploy(MultiSigWallet)

}
