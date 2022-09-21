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
      <ToastContainer position="bottom-right" toastStyle={{ backgroundColor: "#948dbb" }}/>
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
          <h1 className="text-3xl font-light">My Wallets</h1>
      </div>
      <div className="grid text-secondary-content place-content-center">
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="py-3 px-6">
                            Wallet ID
                        </th>
                        <th scope="col" className="py-3 px-6">
                            Wallet Address
                        </th>
                        <th scope="col" className="py-3 px-6">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                  { walletList ? walletList.map((element, index) => {
                    return (
                        <>
                          <tr id={index} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700" >

                              <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {index}
                              </th>
                              <td className="py-4 px-6">
                              {element.walletAddress}
                              </td>
                              <td className="py-4 px-6">
                                { element.walletAddress == state.selectedWallet ?
                                      <button
                                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed"
                                        disabled >
                                        Selected Wallet
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
                              </td>
                          </tr>
                        </>
                      );
                  }): null}

                </tbody>
            </table>
        </div>
      </div>
    </div>
  )
}
