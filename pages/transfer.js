import { useEffect, useState } from "react";
import {
  useOwnerList,
  useAccount,
  useTransferRequest
} from "../components/hooks/web3";
import { useWeb3 } from "../components/providers/web3";

export default function Transfer() {
  const [address, setAddress] = useState(null);
  const [transferAmount, setTransferAmount] = useState(null);
  const { transfer_requests } = useTransferRequest();
  const { account } = useAccount();
  const { state, selectedToken, setBalance } = useWeb3();

  const result = transfer_requests.data ? transfer_requests.data.filter(accountTransactions) : null;

  function accountTransactions(element) {
    return element.walletAddress == state.selectedWallet;
  }

  const createTransfer = async() => {

      try {
        let amountToSend = state.web3.utils.toWei(transferAmount, "ether");
        await state.walletContract.methods.createTransferRequest(selectedToken, address, amountToSend, state.selectedWallet).send({ from: account.data })
        setAddress('');
        setTransferAmount('');
      } catch(err){
        console.log(err)
      }
  }

  const cancelTransferRequest = async(transaction_id) => {

      try {
        await state.walletContract.methods.cancelTransferRequest( transaction_id, state.selectedWallet).send({ from: account.data })
      } catch(err){
        console.log(err)
      }
  }

  const approveTransferRequest = async(transaction_id) => {
      try {
        await state.walletContract.methods.approveTransferRequest( transaction_id, state.selectedWallet).send({ from: account.data })
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
                className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                onClick={() => createTransfer()}>
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          { result.length > 0 ?
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
                          Approval Count
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Date Time
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Approve
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Reject
                      </th>
                  </tr>
              </thead>
            :
            <h1>No Transfer Transactions</h1>
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
                            {element.approvals}
                          </td>
                          <td className="py-4 px-6">
                            {date.toString().split("(")[0]}
                          </td>
                          <td className="py-4 px-6">
                            <button
                              type="button"
                              className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                              onClick={() => approveTransferRequest(element.id)}>
                              Approve
                            </button>
                          </td>
                          <td className="py-4 px-6">
                            <button
                              type="button"
                              className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                              onClick={() => cancelTransferRequest(element.id)}>
                              Cancel
                            </button>
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
