import { useEffect, useState } from "react";
import Router from 'next/router'
import {
  useOwnerList,
  useAccount,
  useTransferRequest,
  useApprovalLimit
} from "../components/hooks/web3";
import { useWeb3 } from "../components/providers/web3";
import { trackPromise} from 'react-promise-tracker';
import { LoadingSpinerComponent } from "../utils/Spinner";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function Transfer() {
  const [address, setAddress] = useState("");
  const [pendingTab, setPendingTabActive] = useState(true);
  const [cancelledTab, setCancelledTabActive] = useState(null);

  const [transferAmount, setTransferAmount] = useState(null);
  const { result_length, pending_transactions, cancel_transactions } = useTransferRequest();

  const { approvalLimit } = useApprovalLimit();
  const { account } = useAccount();
  const { state, selectedToken, setBalance } = useWeb3();

  const toWei = (value) => {
    return state.web3.utils.toWei(value.toString(), 'ether');
  };
  const toEther = (value) => {
    return state.web3.utils.fromWei(value.toString(), 'ether');
  };

  const createTransfer = async() => {
      if (transferAmount <= 0){
        toast.error('Enter correct amount ', {hideProgressBar: true,theme: "white"}) ;
        setTransferAmount('');
        return;
      }
      !state.web3.utils.isAddress(address) ? toast.error('Invalid address', {hideProgressBar: true,theme: "white"}) : null;
      try {
        await trackPromise(
          state.walletContract.methods.createTransferRequest(selectedToken, address, toWei(transferAmount), state.selectedWallet).send({ from: account.data })
        )
        setAddress('');
        const balance = await state.walletContract.methods.getBalance(selectedToken, state.selectedWallet).call();
        setBalance(state.web3.utils.fromWei(balance, "ether"));
        setTransferAmount('');

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

  const approveTransRequest = async(transaction_id) => {

      try {
        await trackPromise(
          state.walletContract.methods.approveTransferRequest(Number(transaction_id), state.selectedWallet).send({ from: account.data })
        )
        toast.success('Transfer Approved!', {hideProgressBar: true,theme: "white"});

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

  const cancelTransRequest = async(transaction_id) => {
      try {
        await trackPromise(
          state.walletContract.methods.cancelTransferRequest(Number(transaction_id), state.selectedWallet).send({ from: account.data })
        )
        toast.error('Transfer Cancelled!', {hideProgressBar: true,theme: "white"});
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
    <div className="flex my-10 items-center justify-center text-center">
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
     { result_length ?
         <div>
           <div className="grid items-center justify-center text-center">
             <h1 className="text-3xl font-light">  { result_length > 0 ? "Transfer Transactions" : null }</h1>
           </div>
           <div className="grid my-5 items-center justify-center text-center">

             <div className="text-base font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                 <ul className="flex flex-wrap -mb-px justify-center items-center">

                     <li id="pending" className="w-80">
                         <a
                           className={pendingTab ? 'text-blue-600 border-b-2 inline-block p-4 rounded-t-lg border-blue-600 dark:text-blue-500 dark:border-blue-500': 'inline-block p-4 rounded-t-lg border-blue-600 dark:text-blue-500 dark:border-blue-500'}
                           onClick={() => {setPendingTabActive(true); setCancelledTabActive(null) }}>Pending for Approval</a>
                     </li>
                     <li id="cancel" className="w-80">
                         <a
                           className={cancelledTab ? 'text-blue-600 border-b-2 inline-block p-4 rounded-t-lg border-blue-600 dark:text-blue-500 dark:border-blue-500': 'inline-block p-4 rounded-t-lg border-blue-600 dark:text-blue-500 dark:border-blue-500'}
                           onClick={() => {setCancelledTabActive(true); setPendingTabActive(null)}}>Cancel Transaction</a>
                     </li>
                 </ul>
             </div>
           </div>
           <div className="grid items-center justify-center text-center">
             { pendingTab && (
               <table className="text-sm text-left text-gray-500 dark:text-gray-400">
               { pending_transactions && pending_transactions.length > 0 ?
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
                       </tr>
                   </thead>
                 :
                 <thead className="text-sm text-gray-700 uppercase">
                     <tr>
                       <th scope="col" className="py-3 px-6">
                           No Data Available
                       </th>
                     </tr>
                 </thead>
               }
                   <tbody>
                   { pending_transactions ? pending_transactions.map((element, index) => {
                     var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
                     date.setUTCSeconds(element.timeOfTransaction)
                     return (
                         <>
                           <tr key={index} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700" >
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
                                 {element.ticker == 'ETH' ? toEther(element.amount) : element.amount }
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
                                 <button
                                   type="button"
                                   className=" inline-block px-6 py-2.5 bg-green-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
                                   onClick={() => approveTransRequest(element.id)}>
                                   Approve
                                 </button>
                               </td>
                           </tr>
                         </>
                     )
                   }): null}

                   </tbody>
               </table>
             )
           }
             {
               cancelledTab && (
                 <table className="text-sm text-left text-gray-500 dark:text-gray-400">
                 { cancel_transactions && cancel_transactions.length > 0 ?
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
                                 Cancel
                             </th>
                         </tr>
                     </thead>
                   :
                   <thead className="text-sm text-gray-700 uppercase">
                       <tr>
                         <th scope="col" className="py-3 px-6">
                             No Data Available
                         </th>
                       </tr>
                   </thead>
                 }
                     <tbody>
                     { cancel_transactions ? cancel_transactions.map((element, index) => {
                       var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
                       date.setUTCSeconds(element.timeOfTransaction)
                       return (
                           <>
                             <tr key={index} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700" >
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
                                   { element.ticker == 'ETH' ? toEther(element.amount) : element.amount }
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
                                   <button
                                     type="button"
                                     className=" inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-800 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                                     onClick={() => cancelTransRequest(element.id)}>
                                     Cancel
                                   </button>
                                 </td>
                             </tr>
                           </>
                       )
                     }): null}

                     </tbody>
                 </table>
               )
             }


           </div>
         </div>

       : null}



    </>

  );
}
