import { useEffect } from "react";
import useSWR from "swr";
import { useWeb3 } from "../../../../components/providers/web3";

export const handler = (web3, contract) => {
  return () =>  {
    const {state} = useWeb3();
    const { mutate, data, error, ...rest } = useSWR(
      () => (web3 ? "web3/approvalLimit" : null),
      async () => {

        const approvalLimit = await contract.methods.getApprovalLimit(state.selectedWallet).call();

        return approvalLimit;
      }
    );

    return {
      data
    };
  };
};
