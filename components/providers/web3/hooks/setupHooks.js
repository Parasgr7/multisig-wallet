import { handler as createAccountHook } from "./useAccount"
import { handler as createTransferRequestHook } from "./useTransferRequest"
import { handler as createWalletList } from "./useWalletList"
import { handler as createOwnerList } from "./useOwnersList"
import { handler as createAccountRequest } from "./useAccountRequest"
import { handler as createApprovalLimit } from "./useApprovalLimit"
import { handler as createWalletDetails } from "./useWalletDetails"

export const setupHooks = ({web3, provider, factoryContract, walletContract, selectedWallet}) => {

    return {
        useAccount: createAccountHook(web3, provider),
        useAccountRequest: createAccountRequest(web3, walletContract),
        useTransferRequest: createTransferRequestHook(web3, walletContract),
        useWalletList: createWalletList(web3, factoryContract),
        useOwnerList: createOwnerList(web3, factoryContract),
        useApprovalLimit: createApprovalLimit(web3, walletContract),
        useWalletDetails: createWalletDetails(web3, walletContract),

    }
}
