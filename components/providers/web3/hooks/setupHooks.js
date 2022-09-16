import { handler as createAccountHook } from "./useAccount"
import { handler as createTransferRequestHook } from "./useTransferRequest"
import { handler as createWalletList } from "./useWalletList"
import { handler as createOwnerList } from "./useOwnersList"
import { handler as createBalance } from "./useBalance"

export const setupHooks = ({web3, provider, factoryContract, walletContract, selectedWallet}) => {

    return {
        useAccount: createAccountHook(web3, provider),
        useTransferRequest: createTransferRequestHook(web3, walletContract),
        useWalletList: createWalletList(web3, factoryContract),
        useOwnerList: createOwnerList(web3, factoryContract, selectedWallet),
        useBalance: createBalance(web3, walletContract),

    }
}
