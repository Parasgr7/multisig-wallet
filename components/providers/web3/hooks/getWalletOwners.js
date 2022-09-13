import { useEffect } from "react";
import useSWR from "swr";

export const handler = (web3, contract) => {
  return () =>  {

    const { mutate, data, error, ...rest } = useSWR(
      () => (web3 ? "web3/walletOwners" : null),
      async () => {
        const wallet_owners = await contract.methods.getWalletOwers().call;

        return wallet_owners;
      }
    );

    return {
      data
    };
  };
};
