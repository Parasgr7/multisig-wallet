import { useHooks, useWeb3 } from "../../providers/web3";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export const useAccount = () => {
  const data =  useHooks((hooks) => hooks.useAccount)();

  return {
    account: data
  }

};

export const useAccountRequest = () => {
  const { state } = useWeb3();
  const account_transactions = useHooks((hooks) => hooks.useAccountRequest)();

  const result = account_transactions.data ? account_transactions.data.filter(accountTransactions) : "";

  function accountTransactions(element) {
    return element.walletAddress == state.selectedWallet;
  }

  return {
    result
  };
};

export const useTransferRequest = () => {
  const { state } = useWeb3();
  const transfer_requests = useHooks((hooks) => hooks.useTransferRequest)();

  const result = transfer_requests.data ? transfer_requests.data.filter(accountTransactions) : "";

  function accountTransactions(element) {
    return element.walletAddress == state.selectedWallet;
  }


  return {
    result
  };
};

export const useWalletList = () => {
  const walletList = useHooks((hooks) => hooks.useWalletList)();

  return {
    walletList
  };
};

export const useOwnerList = () => {
  const ownerList = useHooks((hooks) => hooks.useOwnerList)();

  return {
    ownerList
  };
};

export const useApprovalLimit = () => {
  const approvalLimit = useHooks((hooks) => hooks.useApprovalLimit)();

  return {
    approvalLimit
  };
};
