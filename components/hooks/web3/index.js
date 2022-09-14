import { useHooks, useWeb3 } from "../../providers/web3";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useAccount = () => {
  const data =  useHooks((hooks) => hooks.useAccount)();

  return {
    account: data
  }

};

export const useTransferRequest = () => {
  const data = useHooks((hooks) => hooks.useTransferRequest)();

  return {
    trasnfer_requests: data,
  };
};

export const getWalletOwers = () => {
  const data = useHooks((hooks) => hooks.useTransferRequest)();

  return {
    wallet_owners: data,
  };
};
