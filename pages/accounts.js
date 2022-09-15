export default function Accounts() {
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
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="deposit_amount" type="number" placeholder="Amount"/>
              </p>
              <button type="button" className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
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
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="deposit_amount" type="number" placeholder="Amount"/>
              </p>
              <button type="button" className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
                Withdraw Amount
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
      );
}
