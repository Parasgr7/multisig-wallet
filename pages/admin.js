import {
  useOwnerList,
  useAccount
} from "../components/hooks/web3";
import { useWeb3 } from "../components/providers/web3";
import { useEffect, useState } from "react";
import Router from 'next/router'
import Link from 'next/link';
import { trackPromise} from 'react-promise-tracker';
import { LoadingSpinerComponent } from "../utils/Spinner";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function Admin() {
  const { ownerList } = useOwnerList();
  const { account } = useAccount();
  const {state} = useWeb3();
  const [address, setAddress] = useState(null);

  const removeSelectedOwner = async(accountAddress) => {

    try {
      await trackPromise (
        state.walletContract.methods.removeWalletOwner(accountAddress, state.selectedWallet).send({ from: account.data })
      )
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

  const addOwnerAddress = async(accountAddress) => {
    !state.web3.utils.isAddress(accountAddress) ? toast.error('Invalid address', {hideProgressBar: true,theme: "white"}) : null;
    try {
      await trackPromise (
        state.walletContract.methods.addWalletOwner(accountAddress, state.selectedWallet).send({ from: account.data })
      )
      setAddress('');
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
    <>
    <ToastContainer position="bottom-right" toastStyle={{ backgroundColor: "#2e2d29" }}/>
    <LoadingSpinerComponent/>
    <div class="flex my-10 items-center justify-center">
        <div className="w-full block w-96 rounded-lg shadow-lg bg-white max-w-sm text-center">
          <div className="py-3 px-6 font-semibold border-b border-gray-300">
            New Owner
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
              className='bg-blue-500 uppercase w-full hover:bg-blue-700 text-white font-base py-2 px-4 border border-blue-700 rounded hover:bg-blue-700'
              onClick={() => addOwnerAddress(address)}>
              Add Owner
            </button>
          </div>
        </div>
    </div>
    <div class="grid my-10 items-center justify-center">
      <h1 className="text-3xl font-light">
        Wallet Owners
      </h1>
    </div>
    <div class="grid my-10 items-center justify-center">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                  <th scope="col" className="py-3 px-6">
                      Address
                  </th>
                  <th scope="col" className="py-3 px-6">
                      Action
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
                        {element.owners != account.data ? (<button
                          className='inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md  active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out hover:bg-red-800 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0'
                          onClick={() => removeSelectedOwner(element.owners)}>
                          Remove Owner
                        </button>): null}
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
