"use client";
import React from 'react';
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { base } from 'viem/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { BASE_KEY, WALLET_CONNECT_ID } from '@/utils/chains';
import theme from './theme.json'


// const chains = [sepolia, arbitrumSepolia]

const { publicClient, chains } = configureChains(
  [base],
  [
    alchemyProvider({apiKey: BASE_KEY! }),
  ]
)

const config = createConfig(
    getDefaultConfig({
      walletConnectProjectId: WALLET_CONNECT_ID!,
      chains,
      publicClient,  
      appName: "FLEX-IT",
    }),
  );

const Provider = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider mode='dark' 
        customTheme={theme}
      >        
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  )
}

export default Provider