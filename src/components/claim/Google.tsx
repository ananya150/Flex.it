/* eslint-disable @typescript-eslint/no-use-before-define */

"use client";

import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/single-factor-auth";
import { ADAPTER_EVENTS, CHAIN_NAMESPACES, IProvider } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
// Firebase libraries for custom authentication
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, UserCredential } from "firebase/auth";
import Web3 from "web3";
import { FaGoogle } from "react-icons/fa";

const clientId = "BOwLHiulVTzDvXlStF4D0dXE42xu1GhuVt8mYlSwsPcnasHi3Otf3snGvI7coh6iPGo_zmFWxWmUM89580SF6cY"; // get from https://dashboard.web3auth.io

const verifier = "w3a-firebase-demo";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x14a34", // Please use 0x1 for Mainnet
  rpcTarget: "https://base-sepolia.g.alchemy.com/v2/pZUSMqo1vfSBaZYyEdu1Xt2f0FyDDMJ9",
  displayName: "Base Sepolia",
  blockExplorer: "https://base-sepolia.blockscout.com//",
  ticker: "ETH",
  tickerName: "Ethereum",
};

const web3auth = new Web3Auth({
  clientId, // Get your Client ID from Web3Auth Dashboard
  web3AuthNetwork: "sapphire_devnet",
});

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC0Be_fIhYCt3xktipapZVwjuzH1CChgwQ",
    authDomain: "flex-it-c6d91.firebaseapp.com",
    projectId: "flex-it-c6d91",
    storageBucket: "flex-it-c6d91.appspot.com",
    messagingSenderId: "551992914383",
    appId: "1:551992914383:web:8eba7ad7c7a8104b7e62ba",
    measurementId: "G-PYF6BBTY3K"
  };

function Google() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  // Firebase Initialisation
  const app = initializeApp(firebaseConfig);

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.init(privateKeyProvider);
        setProvider(web3auth.provider);

        if (web3auth.status === ADAPTER_EVENTS.CONNECTED) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      const auth = getAuth(app);
      const googleProvider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, googleProvider);
      console.log(res);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const parseToken = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace("-", "+").replace("_", "/");
      return JSON.parse(window.atob(base64 || ""));
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const login = async () => {
    if (!web3auth.ready) {
      uiConsole("web3auth initialised yet");
      return;
    }
    // login with firebase
    const loginRes = await signInWithGoogle();
    // get the id token from firebase
    const idToken = await loginRes.user.getIdToken(true);
    const userInfo = parseToken(idToken);

    // console.log(userInfo);
    // console.log(idToken);
    console.log(loginRes)
    navigator.clipboard.writeText(`${loginRes}`)

    // const web3authProvider = await web3auth.connect({
    //   verifier,
    //   verifierId: userInfo.sub,
    //   idToken,
    // });

    // if (web3authProvider) {
    //   setLoggedIn(true);
    //   setProvider(web3authProvider);
    // }
  };

  const getUserInfo = async () => {
    if(!loggedIn){
        await login();
    }
    // const user = await web3auth.getUserInfo();
    // console.log(user);
    // uiConsole(user);
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const address = await web3.eth.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const address = (await web3.eth.getAccounts())[0];

    // Get user's balance in ether
    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(address), // Balance is in wei
      "ether"
    );
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0];

    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = await web3.eth.personal.sign(
      originalMessage,
      fromAddress,
      "test password!" // configure your own password here.
    );
    uiConsole(signedMessage);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
    console.log(...args);
  }

  return (
    <div className="w-full bg-[#FEF1F0] cursor-not-allowed text-black text-[17px] font-sat font-medium rounded-2xl py-3 hover:bg-[#FEF1F0] flex justify-start items-center px-3 ">
        <FaGoogle className="text-black w-5 h-5 mr-4" />
        Claim with Google
    </div>
  );
}

export default Google;