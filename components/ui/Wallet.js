import React, { useContext, useEffect } from "react";
import { useWeb3 } from "../../components/providers/web3";
import Link from 'next/link';
import { trackPromise} from 'react-promise-tracker';
import { LoadingSpinerComponent } from "../../utils/Spinner";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Wallet({ walletList, accountAddr}) {
  const {state} = useWeb3();

  const setSelectedWalletAddr = (walletAddress) => {
    state.selectedWallet = walletAddress;
  }

  const createNewWallet = async() => {
    try {
      await trackPromise(
         state.factoryContract.methods.createNewWallet().send({ from: accountAddr })
      );
    } catch(e){
      if (e.code === 4001){
           toast.error('Transaction Rejected!!!', {hideProgressBar: true,theme: "white"});
        }
        else if (e.code === -32603)
        {
           var error_msg = JSON.parse( e.message.split('\'')[1])["value"]["data"]["message"].split('revert')[1];
          toast.error(error_msg, {hideProgressBar: true,theme: "white"});
        }
    }
  }

  return (
    <div>
      <ToastContainer position="bottom-right" toastStyle={{ backgroundColor: "#2e2d29" }}/>
      <LoadingSpinerComponent/>
      <div className="grid my-10 items-center justify-center text-center">
        <div className="max-w-sm w-96 rounded-lg overflow-hidden shadow-lg bg-white">
          <div className="px-6 py-4 font-bold border-b border-gray-300">
            Add New Wallet
          </div>

          <div className="px-6 py-4 ">
            <button className='bg-blue-500 w-full hover:bg-blue-700 uppercase text-white font-bold py-2 px-4 border border-blue-700 rounded hover:bg-blue-700'
              onClick={() => createNewWallet()}>
              Create Wallet
            </button>
          </div>

      </div>
      </div>
      <div className="grid my-10 place-content-center">
          {walletList && walletList.length > 0 ? <h1 className="text-3xl font-light">My Wallets</h1> : null}
      </div>

      <div className="flex flex-wrap -mb-4">
        <div className="w-1/3 mb-4">
        </div>
      </div>


      <div className="flex flex-wrap -mb-4 my-10 items-center justify-center">
        { walletList ? walletList.map((element, index) => {
          return(
            <div className="block w-1/3 mb-2 mx-5 rounded-lg shadow-lg bg-white max-w-sm text-center">
              <div className="py-3 px-6 font-semibold border-b border-gray-300">
                Wallet {index + 1}
              </div>
              <div className="p-6">
                <p className="text-gray-500 text-medium font-bold break-words">
                  {element.walletAddress}
                </p>
              </div>
              <div className="pb-2">
                { element.walletAddress != state.selectedWallet ?
                <svg className="h-12 w-12 text-red-500"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <rect x="5" y="11" width="14" height="10" rx="2" />  <circle cx="12" cy="16" r="1" />  <path d="M8 11v-4a4 4 0 0 1 8 0v4" /></svg>
                :
                <svg className="h-12 w-12 text-green-500"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <rect x="5" y="11" width="14" height="10" rx="2" />  <circle cx="12" cy="16" r="1" />  <path d="M8 11v-5a4 4 0 0 1 8 0" /></svg>
                }
              </div>
              <div className="py-3 px-6 font-semibold border-t border-gray-300">
                { element.walletAddress == state.selectedWallet ?
                      <button
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed"
                        disabled >
                        Selected
                      </button>
                  :
                    <Link href='/admin' className="text-white hover:bg-blue-700">
                      <button
                        className="bg-blue-500  hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                        onClick={() => setSelectedWalletAddr(element.walletAddress)}>
                        Use Wallet
                      </button>
                    </Link>
                }
              </div>
            </div>
          )

        }): null }
      </div>
    </div>
  )
}
