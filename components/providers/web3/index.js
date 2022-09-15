import { createContext, useContext, useState, useEffect, useMemo } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import { setupHooks } from "./hooks/setupHooks";
import { loadContract } from "../../../utils/loadContract";
import Navbar from "../../../components/ui/Navbar"

const Web3Context = createContext(null);

const setListeners = (provider) => {
  provider.on("chainChanged", (_) => window.location.reload());
};

export default function Web3Provider({ children }) {
  const createWeb3State = ({ web3, provider, factoryContract, walletContract, isLoading, selectedWallet }) => {
    return {
      web3,
      provider,
      factoryContract,
      walletContract,
      isLoading,
      selectedWallet,
      hooks: setupHooks({ web3, provider, factoryContract, walletContract, selectedWallet }),
    };
  };

  const [web3Api, setWeb3Api] = useState(
    createWeb3State({
      web3: null,
      provider: null,
      factoryContract: null,
      walletContract: null,
      isLoading: true,
    })
  );

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        const web3 = new Web3(provider);
        const walletContract = await loadContract("MultiSigWallet", web3);
        const factoryContract = await loadContract("MultiSigFactory", web3);
        setWeb3Api(
          createWeb3State({ web3, provider, factoryContract, walletContract, isLoading: false })
        );
        setListeners(provider);
      } else {
        console.error("Please Install metamask");
        setWeb3Api((prevWeb3Api) => ({ ...prevWeb3Api, isLoading: false }));
      }
    };

    loadProvider();
  }, []);

  const _web3Api = useMemo(() => {
    const { web3, provider, isLoading, factoryContract, walletContract } = web3Api;

    return {
      ...web3Api,
      requireInstall: !isLoading && !web3,
      connect: provider
        ? async () => {
            try {
              console.log(provider)
              console.log("Trying to connect to metamask");
              await provider.request({
                method: "eth_requestAccounts",
              });
            } catch {
              console.error("Not connecting to metamask");
              location.reload();
            }
          }
        : () => console.log("Cannot find provider"),
    };
  }, [web3Api]);

  // Return another instance of _web3Api if web3Api changes

  return (
    <Web3Context.Provider value={_web3Api}>
      <Navbar web3API={_web3Api} />
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}

export function useHooks(callback) {
  const { hooks } = useWeb3();
  return callback(hooks);
}

export const useAccount = async(web3) => {

  let account = null;
  if (web3){
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];

    if (!account) {
      throw new Error(
        "Failed to detect Account. Please refresh your browser"
      );
    }
  }
  console.log(account);
  return {
    account
  };

};
/*

getHooks() method returns a dictionary containing name of the hook (key) and the handler to the hook (value)
That dictionary will be accessible anywhere useHooks() method is called because the dictionary is passed as an argument to the callback.

*/
