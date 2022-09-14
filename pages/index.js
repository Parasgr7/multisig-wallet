import Head from 'next/head'
import Image from 'next/image'
import Wallet from "../components/ui/Wallet"
import {
  useAccount,
  useTransferRequest,
  getWalletOwers
} from "../components/hooks/web3";
import { useWeb3 } from "../components/providers/web3";
import Navbar from "../components/ui/Navbar"


export default function Home() {
  const { account } = useAccount();
  const { transferRequest } = useTransferRequest();
  const { walletOwers } = getWalletOwers();
  const { requireInstall, isLoading, connect, factoryContract, walletContract, web3 } = useWeb3();

  return (
    <div>
      <Head>
        <title>MultiSigWallet DApp</title>
      </Head>


      {!isLoading ? (
        account.data ?
        (<>
          <Wallet/>
        </>)
           : requireInstall ? (
          <div className="w-full grid h-screen place-items-center bg-black text-white">
            <button onClick={() => {window.open('https://metamask.io/download/', '_blank')}} className="border border-white p-2 rounded-md">
              Install metamask
            </button>
          </div>
        ) : (
          <div className="w-full grid h-screen place-items-center bg-black text-white">
            <button
              onClick={() => connect()}
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
