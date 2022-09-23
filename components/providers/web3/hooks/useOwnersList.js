import { useEffect } from "react";
import useSWR from "swr";
import { useWeb3 } from "../../../../components/providers/web3";

export const handler = (web3, contract, walletAddress) => {
  return () => {
    const { state } = useWeb3();
    const { mutate, data, error, ...rest } = useSWR(
      () => (web3 ? "web3/ownerList" : null),
      async () => {
        const owner_list = await contract.methods
          .getWalletOwners(state.selectedWallet)
          .call();

        return owner_list;
      }
    );

    return {
      data,
    };
  };
};
