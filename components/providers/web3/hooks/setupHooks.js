import { handler as createAccountHook } from "./useAccount"
import { handler as createTransferRequestHook } from "./useTransferRequest"
import { handler as createWalletOwners } from "./getWalletOwners"
// import { handler as createNetworkHook } from "./useNetwork"

export const setupHooks = ({web3, provider, contract}) => {
    return {
        useAccount: createAccountHook(web3, provider),
        useTransferRequest: createTransferRequestHook(web3, contract),
        useTransferRequest: createWalletOwners(web3, contract),
        // useNetwork: createNetworkHook(web3)
    }
}
