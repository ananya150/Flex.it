"use client";
import { useEffect, useState } from "react";
import { Drawer } from "vaul";
import { clsx } from "clsx";
import { Separator } from "@/components/ui/separator";
import { Wallet, BookUser, Landmark, Link2, } from "lucide-react";
import { useAccount } from "wagmi";
import { useModal } from 'connectkit';
import { ethers } from "ethers";
import { AccountService } from "@/service/wallet/service";
import toast from "react-hot-toast";
import { db } from "@/utils/db";
import { FaGoogle } from "react-icons/fa";
import Google from "./Google";

export function ClaimDrawer({
    children,
    hash,
    setClaimed,
    setTxHash,
    data
  }: {
    children: React.ReactNode,
    hash: any,
    setClaimed: any,
    setTxHash: any,
    data: any
  }) {
    
    const [snap, setSnap] = useState<number | string | null>("300px");
    const [enterAddressPopUp, setEnterAddressPopUp] = useState(false);
    const [enteredAddress, setEnteredAddress] = useState('');
    const [isError, setIsError] = useState(false);
    const [selectedChain, setSelectedChain] = useState(0);
    const [selectedAddressType, setSelectedAddressType] = useState(2);
    const [accountService, setAccountService] = useState<any>(null);

    const {isConnected, address} = useAccount();
    const {setOpen} = useModal();
    const leftPosition = (window.innerWidth - 350) / 2;

    const handleConnectedWallet = () => {
        if(isConnected){
            setSelectedAddressType(1);
            // setSnap("400px");
            return;
        }
        setOpen(true);
        return;
    }

    const onDrawerClose = () => {
        setSnap("300px")
        setEnterAddressPopUp(false);
        setEnteredAddress('');
        setIsError(false);
        setSelectedChain(0);
        setSelectedAddressType(2);
    }

    const handleEnterAddressNext = () => {
        if(selectedAddressType === 1){
            // setEnteredAddress(address!);
            confirmTransfer(address!)
        } else if(selectedAddressType === 2){
            setIsError(false);
            if(!ethers.utils.isAddress(enteredAddress)){
                setIsError(true);
                return;
            }
            confirmTransfer(enteredAddress)
        }
    }

    const handleBack = () => {
        setEnteredAddress('');
        setIsError(false)
        setSnap("300px");
    }

    const confirmTransfer = (add: string) => {

        const promise = accountService.transferUsdc(add).then((txHash: any) => {
            setTxHash(txHash)
            setClaimed(true);
            console.log("tx completed with hash", txHash);
            data.isClaimed = true
            db.set(accountService.address, data)
        }).catch((e: any)=>{console.log(e)});
        toast.promise(promise, {
            loading: 'Claiming ...',
            success: 'Transaction confirmed',
            error: 'Error when claiming',
          });

    } 

    useEffect(() => {
        if(!hash){
            return;
        }
        const init = async () => {
            const service = await AccountService.init(hash);
            setAccountService(service);
        }
        init()
    }, [hash])

  return (
    <Drawer.Root
      snapPoints={["300px", "400px"]}
      activeSnapPoint={snap}
      onClose={onDrawerClose}
      setActiveSnapPoint={setSnap}
    >
      <Drawer.Trigger asChild>
        {children}
      </Drawer.Trigger>
      <Drawer.Overlay className="fixed inset-0 " />
      <Drawer.Portal>
        <Drawer.Content className="fixed flex flex-col bg-white border border-gray-200  rounded-[34px] bottom-[5%] w-[350px] h-full z-50" style={{left: leftPosition}}>
          <div
            className={clsx("flex flex-col max-w-md mx-auto w-full p-8", {
              "overflow-y-auto": snap === 1,
              "overflow-hidden": snap !== 1,
            })}
          >
            {
                snap === "300px" &&
                <div>
                    {
                        !enterAddressPopUp &&  
                        <div className="flex flex-col">
                            <div className="flex justify-between">
                                <span className="text-[20px] font-sat font-medium">Options</span>
                                <div/>
                            </div>
                            <Separator className="mt-7 bg-gray-100" />
                            <div className="mt-6 flex flex-col space-y-4">
                                {/* <div onClick={handleConnectedWallet} className="w-full bg-[#F7F8F9] cursor-pointer text-black text-[17px] font-sat font-medium rounded-2xl py-3 hover:bg-[#F7F8F9] flex justify-start items-center px-3 ">
                                    <Wallet className="text-black w-5 h-5 mr-4" />
                                    {isConnected ? `To ${address?.slice(0,6)}....${address?.slice(-4)}`: 'Connected Wallet'}
                                </div> */}
                                <div onClick={() => {setEnterAddressPopUp(true)}} className="w-full bg-[#F7F8F9] cursor-pointer text-black text-[17px] font-sat font-medium rounded-2xl py-3 hover:bg-[#F7F8F9] flex justify-start items-center px-3 ">
                                    <BookUser className="text-black w-5 h-5 mr-4" />
                                    Ethereum Address
                                </div>
                                <Google />
                                <div className="w-full cursor-not-allowed bg-[#FEF1F0] text-black text-[17px] font-sat font-medium rounded-2xl py-3 hover:bg-[#FEF1F0] flex justify-between items-center px-3 ">
                                    <div className="flex items-center">
                                        <Landmark className="text-black w-5 h-5 mr-4" />
                                        Withdraw to Bank
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        enterAddressPopUp && 
                        <div className="flex flex-col">
                            <div className="flex justify-between">
                                <span className="text-[20px] font-sat font-medium">Enter Address</span>
                                <div/>
                            </div>
                            <Separator className="mt-4 bg-gray-100" />
                            <div className="mt-6 flex flex-col">
                                <div onClick={handleConnectedWallet} className={`w-full ${selectedAddressType === 1 ? 'border border-[#4eaffe]': 'border border-[#F7F8F9]'} bg-[#F7F8F9] cursor-pointer text-black text-[17px] font-sat font-medium rounded-2xl py-3 hover:bg-[#F7F8F9] flex justify-start items-center px-3 `}>
                                    <Wallet className="text-black w-5 h-5 mr-4" />
                                    {isConnected ? `To ${address?.slice(0,6)}....${address?.slice(-4)}`: 'Connected Wallet'}
                                </div>
                                <div className="w-full mt-3 flex justify-between items-center">
                                    <Separator className=" bg-gray-100 w-[110px]" />
                                    <span className="text-gray-400 text-[11px] font-sat">OR</span>
                                    <Separator className=" bg-gray-100 w-[110px]" />
                                </div>
                                <div onClick={() => {setSelectedAddressType(2)}} className={`w-full mt-3 bg-[#F7F8F9] cursor-pointer text-black text-[17px] font-sat font-medium rounded-2xl py-3 hover:bg-[#F7F8F9] flex justify-start items-center px-3 ${selectedAddressType === 2 ? 'border border-[#4eaffe]': 'border border-[#F7F8F9]'} `}>
                                    <Wallet className="text-black w-5 h-5 mr-4" />
                                    <input value={enteredAddress} onChange={(e) => {setEnteredAddress(e.target.value)}} className="w-full bg-[#F7F8F9] outline-none border-none text-[14px] font-light" autoFocus />
                                </div>
                                {isError ?
                                    <div className="h-[20px] mt-2 text-[11px] text-red-400">
                                        Invalid address
                                    </div>
                                    :
                                    <div className="h-[20px] mt-2">

                                    </div>
                                }
                                <div className="flex justify-between space-x-2 mt-3">
                                    <div onClick={() => {
                                        setEnterAddressPopUp(false);
                                        setEnteredAddress('');
                                        setIsError(false);
                                    }} className="w-1/2 cursor-pointer bg-[#f0f2f4] rounded-2xl flex justify-center px-2 py-2">
                                        <span className="text-[18px] font-medium ">Back</span>
                                    </div>
                                    <Drawer.Close className="w-1/2">
                                        <div onClick={handleEnterAddressNext} className="w-full bg-[#4eaffe] cursor-pointer rounded-2xl flex justify-center px-2 py-2">
                                            <span className="text-[18px] text-white font-medium">Confirm</span>
                                        </div>
                                    </Drawer.Close>
                                </div>
                            </div>
                        </div>
                    }
                </div>

            }
            {
                snap === "400px" &&
                <div className="flex flex-col">
                        <Link2 className="text-gray-400 w-11 h-11" />
                        <div className="mt-2">
                            <span className="text-[24px] font-medium">Select Chain</span>
                        </div>
                        <div className="mt-2">
                            <span className="text-[17px] text-gray-400 font-medium">Choose the chain you want your assets on.</span>
                        </div>
                    <Separator className="mt-5 bg-gray-100" />
                    <div className="mt-6 flex flex-col space-y-4">
                        <div onClick={() => {setSelectedChain(1)}} className={`w-full ${selectedChain === 1 ? 'border border-[#4eaffe]': 'border border-[#F7F8F9]'} bg-[#F7F8F9] cursor-pointer text-black text-[17px] font-sat font-medium rounded-2xl py-3 hover:bg-[#F7F8F9] flex justify-between items-center px-3 `}>
                            <div className="flex items-center">
                                <Wallet className="text-black w-5 h-5 mr-4" />
                                Base
                            </div>
                            <div className="text-[12px] text-[#4eaffe]">
                                ~ 10 sec
                            </div>
                        </div>
                        <div onClick={() => {setSelectedChain(2)}} className={`w-full ${selectedChain === 2 ? 'border border-[#4eaffe]': 'border border-[#F7F8F9]'} bg-[#F7F8F9] cursor-pointer text-black text-[17px] font-sat font-medium rounded-2xl py-3 hover:bg-[#F7F8F9] flex justify-between items-center px-3 `}>
                            <div className="flex items-center">
                                <BookUser className="text-black w-5 h-5 mr-4" />
                                Polygon
                            </div>
                            <div className="text-[12px] text-[#4eaffe]">
                                ~ 10 min
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between space-x-2 mt-8">
                        <div onClick={handleBack} className="w-1/2 ">
                            <div className="w-full cursor-pointer bg-[#f0f2f4] rounded-2xl flex justify-center px-2 py-2">
                                <span className="text-[18px] font-medium ">Back</span>
                            </div>
                        </div>
                        {
                            selectedChain === 0 ?
                            <div className={`w-1/2 bg-[#4eaffe] rounded-2xl flex justify-center px-2 py-2 ${selectedChain === 0 ? 'cursor-not-allowed': 'cursor-pointer'}`}>
                                <span className="text-[18px] text-white font-medium">Confirm</span>
                            </div>
                            :
                            <Drawer.Close className="w-1/2">
                                <div className={`w-full bg-[#4eaffe] rounded-2xl flex justify-center px-2 py-2 ${selectedChain === 0 ? 'cursor-not-allowed': 'cursor-pointer'}`}>
                                    <span className="text-[18px] text-white font-medium">Confirm</span>
                                </div>
                            </Drawer.Close>
                        }
                    </div>
                </div>
            }
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
