import React, {useState, useEffect} from "react";
import { Menu } from '@headlessui/react'
import { useWeb3 } from "../../components/providers/web3";
import Link from 'next/link'
import { useRouter } from 'next/router';


export default function Navbar() {
  const router = useRouter();
  const {state, selectedToken, setSelectedToken, balance, setBalance} = useWeb3();
  const account_address = state.hooks.useAccount();

  useEffect(() => {
    if(!state.selectedWallet)
    {
      router.push('/');
    }
    const fetchBalance = async() => {
      if (state.walletContract && state.selectedWallet)
      {
        const response = await state.walletContract.methods.getBalance(selectedToken, state.selectedWallet).call();
        setBalance(state.web3.utils.fromWei(response, "ether"));
      }
    }
    fetchBalance();

  }, [selectedToken, state.selectedWallet]);

  return (
    <>
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">

              <button type="button" className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                <span className="sr-only">Open main menu</span>

                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>

                <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <img className="block h-8 w-auto lg:hidden" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company"/>
                <img className="hidden h-8 w-auto lg:block" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company"/>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <Link href='/'>
                    <a className={router.pathname == "/" ? "active navbarItem" : "navbarItem"}>Wallet</a>
                  </Link>
                  {state.selectedWallet ?
                      <>
                        <Link href='/admin'>
                      <a className={router.pathname == "/admin" ? "active navbarItem" : "navbarItem"}>Admin</a>
                    </Link>
                    <Link href='/accounts'>
                      <a className={router.pathname == "/accounts" ? "active navbarItem" : "navbarItem"}>Accounts</a>
                    </Link>
                    <Link href='/transfer'>
                      <a className={router.pathname == "/transfer" ? "active navbarItem" : "navbarItem"}>Transfers</a>
                    </Link>
                    <label className="dropdown">

                      <div className="dd-button">
                        {selectedToken}
                      </div>
                      <input type="checkbox" className="dd-input" id="test"/>

                      <ul className="dd-menu">
                        {state.tokenList? state.tokenList.map((element, index) => {
                          return (
                          <li id={index} onClick={() => setSelectedToken(element)}>{element}</li>
                          )
                        }): null }

                      </ul>

                    </label>
                      </>


                    : null}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

              <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  <b>Wallet ID: </b>{state.selectedWallet ? state.selectedWallet.slice(0,5) + "..." + state.selectedWallet.slice(state.selectedWallet.length-5) : "N/A"}
              </a>
              <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                <b>Balance:  </b>{balance? balance : "N/A"}
              </a>

              <div className="px-4 py-1 ml-4 text-white border bg-gray-800 border-gray-400 rounded-md">
                {account_address.data ? account_address.data.slice(0,7) + "..." + account_address.data.slice(account_address.data.length-7) : null}
              </div>
            </div>
          </div>
        </div>
      </nav>

    </>
  );
}
