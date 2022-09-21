import Head from 'next/head'
import Image from 'next/image'
import Wallet from "../components/ui/Wallet"
import { useEffect, useState } from "react"
import {
  useAccount,
  useTransferRequest,
  useWalletList,
} from "../components/hooks/web3";
import { useWeb3 } from "../components/providers/web3";

export default function Home() {
  const { account } = useAccount();
  const { transferRequest } = useTransferRequest();
  const { walletList } = useWalletList();

  const { state } = useWeb3();

  return (
    <div>
      <Head>
        <title>MultiSigWallet DApp</title>
      </Head>
      {!state.isLoading ? (
        account.data ?
        (<>
          <Wallet walletList = {walletList.data} accountAddr = {account.data} />
        </>)
           : state.requireInstall ? (
          <div className="w-full grid h-screen place-items-center bg-black text-white">
            <button onClick={() => {window.open('https://metamask.io/download/', '_blank')}} className="border border-white p-2 rounded-md">
              Install metamask
            </button>
          </div>
        ) : (
          <div className="w-full grid h-screen place-items-center bg-black text-white">
            <button
              onClick={() => state.connect()}
              className="border border-white p-2 rounded-md"
            >
              Connect to metamask with your browser
            </button>
          </div>
        )
      ) : (
        <div className="w-full grid h-screen place-items-center bg-black text-white">
          <div className="border border-white p-2 rounded-md">
            Connecting.... Please! Wait for a moment.
          </div>
        </div>
      )}

    </div>
  )
}
