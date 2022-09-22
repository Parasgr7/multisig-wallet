import { useEffect, useState } from "react";
import { useWeb3 } from "../components/providers/web3";
import Router from 'next/router'
import {
  useOwnerList,
  useAccount,
  useAccountRequest,
} from "../components/hooks/web3";

import { trackPromise} from 'react-promise-tracker';
import { LoadingSpinerComponent } from "../utils/Spinner";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Accounts() {
  const [depositAmount, setDepositAmount] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState(null);
  const { state, selectedToken, setBalance } = useWeb3();
  const { account } = useAccount();
  const { result } = useAccountRequest();

  const toWei = (value) => {
    return state.web3.utils.toWei(value.toString(), 'ether');
  };
  const toEther = (value) => {
    return state.web3.utils.fromWei(value.toString(), 'ether');
  };

  const deposit = async() => {
    if (depositAmount <= 0){
      toast.error('Enter correct amount ', {hideProgressBar: true,theme: "white"}) ;
      setDepositAmount('');
      return;
    }
    if(selectedToken == "ETH")
    {
      try{
        await trackPromise(
          state.walletContract.methods.deposit( selectedToken , toWei(depositAmount) , state.selectedWallet).send({ from: account.data, value: toWei(depositAmount)})
        )
      }catch(e){
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
    else {
      const contract = selectedToken == "LINK" ? state.LinkContract : state.DaiContract;
      await trackPromise(
          contract.methods.approve(state.walletContract._address, toWei(depositAmount)).send({ from: account.data })
      )

      try{
        await trackPromise(
          state.walletContract.methods.deposit( selectedToken ,  toWei(depositAmount) , state.selectedWallet).send({ from: account.data})
        )
      }catch(e){
        if (e.code === 4001){
             toast.error('Transaction Rejected!!!', {hideProgressBar: true,theme: "white"});
          }
          else if (e.code === -32603)
          {
            var error_msg = JSON.parse(e.message.split('\'')[1])["value"]["data"]["message"].split('revert')[1];

            toast.error(error_msg.length > 0 ? error_msg : "Error!" , {hideProgressBar: true,theme: "white"});
          }
      }

    }
    const balance = await state.walletContract.methods.getBalance(selectedToken, state.selectedWallet).call();
    setBalance(state.web3.utils.fromWei(balance, "ether"));
    setDepositAmount('');

  }
  const withdraw = async() => {
    let amountToWithdraw;
    if (withdrawAmount <= 0){
      toast.error('Enter correct amount ', {hideProgressBar: true,theme: "white"}) ;
      setWithdrawAmount('');
      return;
    }

    try {
      await trackPromise(
        state.walletContract.methods.withdraw( selectedToken , toWei(withdrawAmount) , state.selectedWallet).send({ from: account.data })
      )
      const balance = await state.walletContract.methods.getBalance(selectedToken, state.selectedWallet).call();
      setBalance(state.web3.utils.fromWei(balance, "ether"));
      setWithdrawAmount('');
    } catch(err){
        if(e.code === 4001){
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
    <div className="flex my-10 items-center justify-center">
      <div className="block w-96 mx-5 rounded-lg shadow-lg bg-white max-w-sm text-center">
        <div className="py-3 px-6 font-semibold border-b border-gray-300">
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
              className="inline-block px-6 py-2.5 bg-blue-600 text-white w-full font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              onClick={() => deposit()}>
            Deposit Amount
          </button>
        </div>
      </div>

      <div className="block w-96 mx-5 rounded-lg shadow-lg bg-white max-w-sm text-center">
        <div className="py-3 px-6 font-semibold border-b border-gray-300">
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
              className="inline-block px-6 py-2.5 bg-blue-600 text-white w-full font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              onClick={() => withdraw()}>
            Withdraw Amount
          </button>
        </div>
      </div>
    </div>
    <div className="grid my-10 items-center justify-center">
      { result && result.length > 0 ? <h1 className="text-3xl font-light">Account Transactions</h1> : null}
    </div>
    <div className="grid items-center justify-center">
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
                        {toEther(element.amount)}
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
