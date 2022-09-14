import { handler as createAccountHook } from "./useAccount"
import { handler as createTransferRequestHook } from "./useTransferRequest"
import { handler as createWalletList } from "./useWalletList"
// import { handler as createNetworkHook } from "./useNetwork"

export const setupHooks = ({web3, provider, factoryContract, walletContract}) => {
    return {
        useAccount: createAccountHook(web3, provider),
        useTransferRequest: createTransferRequestHook(web3, walletContract),
        useWalletList: createWalletList(web3, factoryContract),
        // useNetwork: createNetworkHook(web3)
    }
}
