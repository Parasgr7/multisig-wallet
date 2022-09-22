import { useEffect } from "react";
import useSWR from "swr";

export const handler = (web3, contract) => {
  return () =>  {

    const { mutate, data, error, ...rest } = useSWR(
      () => (web3 ? "web3/walletList" : null),
      async () => {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        const wallet_list = await contract.methods.getOwnerWallets(account).call();


        return wallet_list;
      }
    );

    return {
      data
    };
  };
};
