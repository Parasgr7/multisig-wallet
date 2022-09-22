import { createContext, useContext, useState, useEffect, useMemo } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import { setupHooks } from "./hooks/setupHooks";
import { loadContract } from "../../../utils/loadContract";

const Web3Context = createContext(null);

const setListeners = (provider) => {
  provider.on("chainChanged", (_) => window.location.reload());
};

export default function Web3Provider({ children }) {
  const createWeb3State = ({ web3, provider, factoryContract, walletContract, LinkContract, DaiContract, isLoading, selectedWallet, tokenList, selectedToken}) => {
    return {
      web3,
      provider,
      factoryContract,
      walletContract,
      LinkContract,
      DaiContract,
      isLoading,
      selectedWallet,
      tokenList,
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
      tokenList: null,

    })
  );

  const [selectedToken, setSelectedToken] = useState("ETH");
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        const web3 = new Web3(provider);
        const walletContract = await loadContract("MultiSigWallet", web3);
        const factoryContract = await loadContract("MultiSigFactory", web3);
        const LinkContract = await loadContract("LINK", web3);
        const DaiContract = await loadContract("DAI", web3);
        const tokenList = walletContract ? await walletContract.methods.getTokenList().call() : null;
        setBalance(null);
        setWeb3Api(
          createWeb3State({ web3, provider, factoryContract, walletContract, LinkContract, DaiContract, isLoading: false, tokenList })
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
    <Web3Context.Provider value={{state:_web3Api, selectedToken, setSelectedToken, balance, setBalance}}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}

export function useHooks(callback) {
  const { state } = useWeb3();
  return callback(state.hooks);
}

/*

getHooks() method returns a dictionary containing name of the hook (key) and the handler to the hook (value)
That dictionary will be accessible anywhere useHooks() method is called because the dictionary is passed as an argument to the callback.

*/
