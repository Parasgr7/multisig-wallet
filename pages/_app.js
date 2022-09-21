import '../styles/globals.css'
import { Web3Provider } from "../components/providers";
import Navbar from "../components/ui/Navbar"

function MyApp({ Component, pageProps }) {
  return (
    <Web3Provider>
      <Navbar />
      <Component {...pageProps} />
    </Web3Provider>
  )
}

export default MyApp
