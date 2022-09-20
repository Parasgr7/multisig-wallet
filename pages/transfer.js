import { useEffect, useState } from "react";
import Router from 'next/router'
import {
  useOwnerList,
  useAccount,
  useTransferRequest,
  useApprovalLimit
} from "../components/hooks/web3";
import { useWeb3 } from "../components/providers/web3";

export default function Transfer() {
  const [address, setAddress] = useState(null);
  const [transferAmount, setTransferAmount] = useState(null);
  const { result } = useTransferRequest();
  const { approvalLimit } = useApprovalLimit();
  const { account } = useAccount();
  const { state, selectedToken, setBalance } = useWeb3();

  const createTransfer = async() => {

      try {
        let amountToSend = state.web3.utils.toWei(transferAmount, "ether");
        await state.walletContract.methods.createTransferRequest(selectedToken, address, amountToSend, state.selectedWallet).send({ from: account.data })
        setAddress('');
        const balance = await state.walletContract.methods.getBalance(selectedToken, state.selectedWallet).call();
        setBalance(state.web3.utils.fromWei(balance, "ether"));
        setTransferAmount('');
      } catch(err){
        console.log(err)
      }
  }

  const approveTransRequest = async(transaction_id) => {

      try {
        await state.walletContract.methods.approveTransferRequest(Number(transaction_id), state.selectedWallet).send({ from: account.data })
      } catch(err){
        console.log(err.message);
      }
  }

  const cancelTransRequest = async(transaction_id) => {
      try {
        await state.walletContract.methods.cancelTransferRequest(Number(transaction_id), state.selectedWallet).send({ from: account.data })
      } catch(err){
        console.log(err.message)
      }
  }



  return (
    <>
    <div class="flex my-10 items-center justify-center text-center">
        <div className="block w-full rounded-lg shadow-lg bg-white max-w-sm text-center">
          <div className="py-3 px-6 font-semibold border-b border-gray-300">
            Create Transaction
          </div>
          <div className="p-6">
            <p className="text-gray-700 text-base mb-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="receiver_address"
                type="text"
                placeholder="Receiver Address"
                value={address}
                onChange={e => { setAddress(e.currentTarget.value) }}
              />
            </p>
            <p className="text-gray-700 text-base mb-4">
              <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="deposit_amount"
                  type="number"
                  placeholder="Amount"
                  value={transferAmount}
                  onChange={e => { setTransferAmount(e.currentTarget.value) }}/>
            </p>
            <button
              type="button"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white w-full font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              onClick={() => createTransfer()}>
              Create
            </button>
          </div>
        </div>
    </div>
    <div class="grid my-10 items-center justify-center text-center">
      <h1 className="text-3xl font-light">  { result && result.length > 0 ? "Transfer Transactions" : null }</h1>
    </div>
    <div class="grid my-10 items-center justify-center text-center">
      <table className="text-sm text-left text-gray-500 dark:text-gray-400">
      { result && result.length > 0 ?
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                  <th scope="col" className="py-3 px-6">
                      Tx Id
                  </th>
                  <th scope="col" className="py-3 px-6">
                      Sender
                  </th>
                  <th scope="col" className="py-3 px-6">
                      Receiver
                  </th>
                  <th scope="col" className="py-3 px-6">
                      Amount
                  </th>
                  <th scope="col" className="py-3 px-6">
                      Ticker
                  </th>
                  <th scope="col" className="py-3 px-6">
                      Approval Count / Limit
                  </th>
                  <th scope="col" className="py-3 px-6">
                      Date Time
                  </th>
                  <th scope="col" className="py-3 px-6">
                      Approve
                  </th>
                  <th scope="col" className="py-3 px-6">
                      Cancel
                  </th>
              </tr>
          </thead>
        :
        null
      }
          <tbody>
          { result ? result.map((element, index) => {
            var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
            date.setUTCSeconds(element.timeOfTransaction)
            return (
                <>
                  <tr id={index} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700" >
                      <td className="py-4 px-6">
                        {element.id}
                      </td>
                      <td className="py-4 px-6">
                        {element.sender.slice(0,7) + "..." + element.sender.slice(element.sender.length-10)}
                      </td>
                      <td className="py-4 px-6">
                        {element.receiver.slice(0,7) + "..." + element.receiver.slice(element.receiver.length-10)}
                      </td>
                      <td className="py-4 px-6">
                        {element.amount}
                      </td>
                      <td className="py-4 px-6">
                        {element.ticker}
                      </td>
                      <td className="py-4 px-6">
                        {element.approvals + "/" + approvalLimit.data}
                      </td>
                      <td className="py-4 px-6">
                        {date.toString().split("(")[0]}
                      </td>
                      <td className="py-4 px-6">
                        {element.sender == account.data ?
                          <button
                            type="button"
                            disabled
                            className=" inline-block px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-800 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                            >
                            Pending
                          </button>
                        :
                        <button
                          type="button"
                          className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                          onClick={() => approveTransRequest(element.id)}>
                          Approve
                        </button>
                      }

                      </td>
                      <td className="py-4 px-6">
                        {element.sender == account.data ?
                        <button
                          type="button"
                          className=" inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-800 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                          onClick={() => cancelTransRequest(element.id)}>
                          Cancel
                        </button>
                       : null}
                      </td>

                  </tr>
                </>
            )
          }): null}

          </tbody>
      </table>
    </div>
    </>

  );
}
