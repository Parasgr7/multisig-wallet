import { useEffect } from "react";
import useSWR from "swr";

export const handler = (web3, contract) => {
  return () =>  {

    const { mutate, data, error, ...rest } = useSWR(
      () => (web3 ? "web3/accountTransactions" : null),
      async () => {

        const account_transactions = await contract.methods.getAccountTransactions().call();

        return account_transactions;
      }
    );

    return {
      data
    };
  };
};
