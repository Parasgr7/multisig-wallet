import { useEffect } from "react";
import useSWR from "swr";
import { useWeb3 } from "../../../../components/providers/web3";

export const handler = (web3, contract) => {
  return () =>  {
    const { selectedToken } = useWeb3();
    const { mutate, data, error, ...rest } = useSWR(
      () => (web3 ? "web3/balance" : null),
      async () => {
        const balance = await contract.methods.getBalance(selectedToken).call();
        return balance;
      }
    );

    return {
      data
    };
  };
};
