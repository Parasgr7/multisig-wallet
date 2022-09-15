import {
  useOwnerList,
  useAccount
} from "../components/hooks/web3";
import { useWeb3 } from "../components/providers/web3";
import { useEffect, useState } from "react";
import Link from 'next/link';

export default function Admin() {
  const { ownerList } = useOwnerList();
  const contextApi = useWeb3();
  const { account } = useAccount();
  const [address, setAddress] = useState(null);


  const removeSelectedOwner = async(accountAddress) => {

    try {
      await contextApi.walletContract.methods.removeWalletOwner(accountAddress, contextApi.selectedWallet).send({ from: account.data })
    } catch(err){
      console.log(err)
    }
  }

  const addOwnerAddress = async(accountAddress) => {

    try {
      await contextApi.walletContract.methods.addWalletOwner(accountAddress, contextApi.selectedWallet).send({ from: account.data })
      setAddress('');
    } catch(err){
      console.log(err)
    }
  }

  return (
    <>
      <div className="flex row">
        <div className="flex justify-center">
          <div className="block rounded-lg shadow-lg bg-white max-w-sm text-center">
            <div className="py-3 px-6 border-b border-gray-300">
              Add Owner
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-base mb-4">
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="owner_address"
                  type="text"
                  placeholder="Owner Address"
                  value={address}
                  onChange={e => { setAddress(e.currentTarget.value) }}
                />
              </p>
              <button
                type="button"
                className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                onClick={() => addOwnerAddress(address)}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
            <h1 className="text-3xl font-light">
        Owners!
      </h1>

      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" className="py-3 px-6">
                          Address
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Remove
                      </th>
                  </tr>
              </thead>
              <tbody>
              { ownerList.data ? ownerList.data.map((element, index) => {
                return (
                    <>
                      <tr id={index} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700" >

                          <td className="py-4 px-6">
                          {element.owners}
                          </td>
                          <td className="py-4 px-6">
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                              onClick={() => removeSelectedOwner(element.owners)}>
                              Remove Owner
                            </button>
                          </td>
                      </tr>
                    </>
                  );
              }): null}

              </tbody>
          </table>
      </div>
    </>
  )
}
