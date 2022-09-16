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
    <div className="bg-slate-50">
      <div className="max-w-sm rounded overflow-hidden shadow-lg">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">Create New Wallet</div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            onClick={() => createNewWallet()}>
            Create
          </button>
        </div>
      </div>
      <h1 className="text-3xl font-light">My Wallets!</h1>
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
                              <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                                onClick={() => setSelectedWalletAddr(element.walletAddress)}>
                                <Link href='/admin'>Use Wallet</Link>
                              </button>
                            </td>
                        </tr>
                      </>
                    );
                }): null}

              </tbody>
          </table>
      </div>

    </div>
  )
}
