import { useEffect } from "react";
import useSWR from "swr";

export const handler = (web3, contract) => {
  return () =>  {

    const { mutate, data, error, ...rest } = useSWR(
      () => (web3 ? "web3/transferRequests" : null),
      async () => {
        const transfer_requests = await contract.methods.getTransferRequests().call;

        return transfer_requests;
      }
    );

    return {
      data
    };
  };
};
