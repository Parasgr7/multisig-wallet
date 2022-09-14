import { handler as createAccountHook } from "./useAccount"
import { handler as createTransferRequestHook } from "./useTransferRequest"
import { handler as createWalletOwners } from "./getWalletOwners"
// import { handler as createNetworkHook } from "./useNetwork"

export const setupHooks = ({web3, provider, factoryContract, walletContract}) => {
    return {
        useAccount: createAccountHook(web3, provider),
        useTransferRequest: createTransferRequestHook(web3, walletContract),
        useTransferRequest: createWalletOwners(web3, walletContract),
        // useNetwork: createNetworkHook(web3)
    }
}
