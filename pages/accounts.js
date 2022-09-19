import { useEffect, useState } from "react";
import { useWeb3 } from "../components/providers/web3";
import Router from 'next/router'
import {
  useOwnerList,
  useAccount,
  useAccountRequest,
} from "../components/hooks/web3";

const Web3 = require('web3');
const web3 = new Web3();

export default function Accounts() {
  const [depositAmount, setDepositAmount] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState(null);
  const { state, selectedToken, setBalance } = useWeb3();
  const { account } = useAccount();
  const { result } = useAccountRequest();

  const deposit = async() => {

    if(selectedToken == "ETH")
    {
      let amountToSend = web3.utils.toWei(depositAmount, "ether");
      await state.walletContract.methods.deposit( selectedToken , depositAmount , state.selectedWallet).send({ from: account.data, value: amountToSend});
    }
    else {
      const contract = selectedToken == "LINK" ? state.LinkContract : state.DaiContract;
      await contract.methods.approve(state.walletContract._address, depositAmount).send({ from: account.data})
      await state.walletContract.methods.deposit( selectedToken , depositAmount , state.selectedWallet).send({ from: account.data});
    }
    const balance = await state.walletContract.methods.getBalance(selectedToken, state.selectedWallet).call();
    setBalance(state.web3.utils.fromWei(balance, "ether"));
    setDepositAmount('');

  }
  const withdraw = async() => {
    let amountToWithdraw;
    if(selectedToken == "ETH")
    {
      amountToWithdraw = web3.utils.toWei(withdrawAmount, "ether");
    }
    try {
      await state.walletContract.methods.withdraw( selectedToken , amountToWithdraw , state.selectedWallet).send({ from: account.data });
      const balance = await state.walletContract.methods.getBalance(selectedToken, state.selectedWallet).call();
      setBalance(state.web3.utils.fromWei(balance, "ether"));
      setWithdrawAmount('');
    } catch(err){
      console.log(err)
    }

  }
  return (
    <>
      <h1>Accounts Post</h1>
      <div className="flex row">
        <div className="flex justify-center">
          <div className="block rounded-lg shadow-lg bg-white max-w-sm text-center">
            <div className="py-3 px-6 border-b border-gray-300">
              Deposit
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-base mb-4">
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="deposit_amount"
                    type="number"
                    placeholder="Amount"
                    value={depositAmount}
                    onChange={e => { setDepositAmount(e.currentTarget.value) }}/>
              </p>
              <button
                  type="button"
                  className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                  onClick={() => deposit()}>
                Deposit Amount
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="block rounded-lg shadow-lg bg-white max-w-sm text-center">
            <div className="py-3 px-6 border-b border-gray-300">
              Withdraw
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-base mb-4">
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="deposit_amount"
                    type="number"
                    placeholder="Amount"
                    value={withdrawAmount}
                    onChange={e => { setWithdrawAmount(e.currentTarget.value) }}
                    />
              </p>
              <button
                  type="button"
                  className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                  onClick={() => withdraw()}>
                Withdraw Amount
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            { result && result.length > 0 ?
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" className="py-3 px-6">
                          Id
                      </th>
                      <th scope="col" className="py-3 px-6">
                          User Address
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Amount
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Ticker
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Action
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Date Time
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
                            {index}
                          </td>
                          <td className="py-4 px-6">
                            {element.sender}
                          </td>
                          <td className="py-4 px-6">
                            {element.amount}
                          </td>
                          <td className="py-4 px-6">
                            {element.ticker}
                          </td>
                          <td className="py-4 px-6">
                            {element.action}
                          </td>
                          <td className="py-4 px-6">
                            {date.toString().split("(")[0]}
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
