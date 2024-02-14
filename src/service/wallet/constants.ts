import { ethers } from "ethers";
import USDC from "./artifacts/contracts/test/USDC.sol/USDC.json";
import EntryPoint from "./artifacts/contracts/test/EntryPoint.sol/EP.json"
import Account from "./artifacts/contracts/core/Account.sol/LightAccount.json"
import Extractor from "./artifacts/contracts/core/Extractor.sol/Extractor.json"
import {configureChains } from "wagmi";
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { baseSepolia, base } from 'viem/chains';


const isTestNet = process.env.NEXT_PUBLIC_IS_TESTNET === "true";

const BASE_SEPOLIA_CHAIN_ID = '0x14A34';
const BASE_CHAIN_ID = '0x2105'
export const CHAIN_ID = isTestNet ? BASE_SEPOLIA_CHAIN_ID : BASE_CHAIN_ID;

const BASE_SEPOLIA_KEY = process.env.NEXT_PUBLIC_BASE_SEPOLIAKEY;
const BASE_KEY = process.env.NEXT_PUBLIC_BASEKEY;

const BASE_SEPOLIA_BUNDLER = process.env.NEXT_PUBLIC_BASE_SEPOLIA_BUNDLER_URL;
const BASE_BUNDLER = process.env.NEXT_PUBLIC_BASE_BUNDLER_URL

export const BUNDLER = isTestNet ? BASE_SEPOLIA_BUNDLER : BASE_BUNDLER;

const BASE_SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC;
const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL;

export const RPC_URL = isTestNet ? BASE_SEPOLIA_RPC_URL : BASE_RPC_URL;
export const PROVIDER = new ethers.providers.JsonRpcProvider(RPC_URL);    
export const DEPLOYERADDRESS = "0x621096843bcDf08F84Ed33E07128ac5daae95A3B";


export const USDCADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
export const ENTRYPOINTADDRESS = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
export const ACCOUNTADDRESS = '0xF1aC61cE7c387a8f26b2839Eb159293C1F50fF17';
export const EXTRACTORADDRESS = '0x93759b710caf622Ddf803517f6ADb95fF799dC19';

export const usdc = new ethers.Contract(USDCADDRESS, USDC.abi, PROVIDER);
export const entryPoint = new ethers.Contract(ENTRYPOINTADDRESS, EntryPoint.abi, PROVIDER);
export const account = new ethers.Contract(ACCOUNTADDRESS, Account.abi, PROVIDER);
export const extractor = new ethers.Contract(EXTRACTORADDRESS, Extractor.abi, PROVIDER);


export const extractorInterface = new ethers.utils.Interface(Extractor.abi);
export const accountInterface = new ethers.utils.Interface(Account.abi);

export const { publicClient, chains } = isTestNet? 
    configureChains(
        [baseSepolia],
        [
        alchemyProvider({apiKey: BASE_SEPOLIA_KEY! })
        ]
    ) :
    configureChains(
        [base],
        [
        alchemyProvider({apiKey: BASE_KEY! })
        ]
    )
