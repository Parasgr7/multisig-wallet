import React, { useContext, useEffect } from "react";
import { useWeb3 } from "../../components/providers/web3";
import Link from 'next/link';

export default function Wallet({ walletList, accountAddr}) {
  const {state} = useWeb3();

  const setSelectedWalletAddr = (walletAddress) => {
    state.selectedWallet = walletAddress;
  }

  const createNewWallet = async() => {
    try {
      await state.factoryContract.methods.createNewWallet().send({ from: accountAddr })
    } catch(err){
      console.log(err)
    }
  }

  return (
    <div>
      <div class="grid my-10 items-center justify-center text-center">
        <div className="max-w-sm w-96 rounded-lg overflow-hidden shadow-lg">
          <div className="py-3 px-6 font-semibold border-b border-gray-300">
            Wallet
          </div>
          <div className="px-6 py-4">
            <div className="font-medium text-xl mb-2">Create New Wallet</div>
          </div>
          <div className="px-6 py-4 ">
            <button className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
              onClick={() => createNewWallet()}>
              Create
            </button>
          </div>

      </div>
      </div>
      <div class="grid my-10 place-content-center">
          <h1 className="text-3xl font-light">My Wallets</h1>
      </div>
      <div class="grid text-secondary-content place-content-center">
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
                                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full opacity-50 cursor-not-allowed"
                                        disabled >
                                        Selected Wallet
                                      </button>
                                  :
                                    <Link href='/admin' className="text-white hover:bg-blue-700">
                                      <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded-full"
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
