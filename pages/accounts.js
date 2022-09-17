import { useEffect, useState } from "react";
import { useWeb3 } from "../components/providers/web3";
import {
  useOwnerList,
  useAccount,
  useTransferRequest,
} from "../components/hooks/web3";
const Web3 = require('web3');
const web3 = new Web3();

export default function Accounts() {
  const [depositAmount, setDepositAmount] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState(null);
  const { state, selectedToken, setBalance } = useWeb3();
  const { account } = useAccount();
  const { trasnfer_requests } = useTransferRequest();

  const deposit = async() => {
    let amountToSend;

    if(selectedToken == "ETH")
    {
      amountToSend = web3.utils.toWei(depositAmount, "ether");
    }

    try {
      await state.walletContract.methods.deposit( selectedToken , depositAmount , state.selectedWallet).send({ from: account.data, value: amountToSend});
      const balance = await state.walletContract.methods.getBalance(selectedToken, state.selectedWallet).call();
      setBalance(state.web3.utils.fromWei(balance, "ether"));
      setDepositAmount('');
    } catch(err){
      console.log(err)
    }

  }
  const withdraw = async() => {
    let amountToWithdraw;
    if(selectedToken == "ETH")
    {
      amountToWithdraw = web3.utils.toWei(withdrawAmount, "ether");
    }
    try {
      await state.walletContract.methods.withdraw( selectedToken , amountToWithdraw , state.selectedWallet).send({ from: account.data });
      const balance = await state.walletContract.methods.getBalance(selectedToken).call();
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
    </>
      );
}
