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
  const data = useHooks((hooks) => hooks.useAccountRequest)();

  return {
    account_transactions: data
  };
};

export const useTransferRequest = () => {
  const data = useHooks((hooks) => hooks.useTransferRequest)();

  return {
    transfer_requests: data
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
