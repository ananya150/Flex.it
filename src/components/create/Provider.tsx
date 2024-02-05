"use client";
import React from 'react';
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { base, baseSepolia } from 'viem/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { BASE_KEY, WALLET_CONNECT_ID, BASE_SEPOLIA_KEY } from '@/utils/chains';
import theme from './theme.json'
import { publicClient, chains } from '@/service/wallet/constants';

// const chains = [sepolia, arbitrumSepolia]

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