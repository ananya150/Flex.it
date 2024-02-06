"use client";
import React,{useState, useEffect, useRef} from 'react'
import { Tabs } from './Tabs';
import { WavyBackground } from './WavyBackground';
import { Link, PartyPopper, Image, AlertCircle, } from 'lucide-react';
import { ReloadIcon } from "@radix-ui/react-icons"
import { useAccount } from 'wagmi';
import { useModal } from 'connectkit';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import {
    Tabs as ShadTabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs";
  import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Input } from "@/components/ui/input"
  import { generateRandomKeyPair, getUSDCBalance, sendUsdcTransaction, addLinkToStorage } from '@/service/wallet/utils';
  import toast from 'react-hot-toast';
  import { useSendTransaction, useWaitForTransaction } from 'wagmi' 
  import { Button } from '../ui/button';
  import { db } from '@/utils/db';

const CreateLink = () => {

    const [activeTab, setActiveTab] = useState(0);
    const [image, setImage] = useState("url(/scene.jpg)");
    const [message, setMessage] = useState('');
    const [amount, setAmount] = useState('');
    const {isConnected, address} = useAccount()
    const [connected , setConnected] = useState(false);
    const [balance, setBalance] = useState('0.0');
    const [isDark, setIsDark] = useState(false);
    const [imageLink, setImageLink] = useState('');
    const [insertedImage, setInsertedImage] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [toastId, setToastId] = useState<any>(null);

    const [newAddress, setNewAddress] = useState('');
    const [hashLink, setHashLink] = useState('');

    const {  data , sendTransaction, isError } = useSendTransaction() 
    const {
        data: txReceipt,
        error: txError,
        isLoading: txLoading,
        isSuccess,
        status
      } = useWaitForTransaction({ confirmations: 1, hash: data?.hash });

    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);

    const fetchBalance = async () => {
        const balance = await getUSDCBalance(address!);
        setBalance(((parseInt(balance._hex, 16))/1000000).toFixed(2))
    }

    useEffect(() => {
        setConnected(isConnected);
        // clearStorage()
        if(isConnected){
            fetchBalance()
        }
    }, [isConnected, address])

    const {setOpen} = useModal({onDisconnect: () => {
        setBalance('0.0');
    }});

    const handleConnectWallet = () => {
        if(!isConnected){
            setOpen(true);
            return;
        }
    }

    const handleAmountChange = (event: any) => {
        const { value } = event.target;

        if (/^[0-9]*\.?[0-9]{0,2}$/.test(value) || value === "") {
            setAmount(value);
        } else if (event.target.value === '') {
        setAmount('');
        }
    }

    const handleEnterMessage = (event: any) => {
        event.stopPropagation(); 
        // @ts-ignore
        inputRef2.current.focus();
    }

    const handleColorChange = (e: any, color: string) => {
        e.stopPropagation(); 
        if(color === "black"){
            setIsDark(true);
        }
        if(color === "white"){
            setIsDark(false);
        }
    }

    const handleInsertLink = () => {
        setImage(`url(${imageLink})`);
        setImageLink('');
    }

    const handleInsetImage = () => {
        console.log(URL.createObjectURL(insertedImage))
        setImage(`url(${URL.createObjectURL(insertedImage)})`);
        setInsertedImage('')
    }

    const handleButtonClick = async () => {

        setLoading(true);

        if(parseFloat(amount) > parseFloat(balance)){
            invalidAmountToast()
            setLoading(false)             
            return;
        }
        // generate hash and address for link
        const newPair = await generateRandomKeyPair()
        setNewAddress(newPair.address)
        setHashLink(newPair.hash);
        const tx = await sendUsdcTransaction(newPair.address, amount);
        console.log(newPair)
        console.log(tx)
        sendTransaction(tx as any);
    }

    useEffect(() => {
        if(isError){
            toast.error("Transaction Rejected");
            setLoading(false)
            return;
        }
        if(status === "loading"){
            const tId = toast.loading('Waiting for transaction');
            setToastId(tId);
            return;
        }
        if(status === "success"){
            handleTransactionConfirmation()
        }
        if(status === "error"){
            toast.dismiss(toastId);
            toast.error("Transaction Failed");
            setLoading(false)
            return;
        }

    }, [status, isError])


    useEffect(() => {

    },[amount, image])

    const handleTransactionConfirmation = async () => {
        toast.dismiss(toastId);
        toast.success("Transaction Confirmed");

        let data;
        if(activeTab === 0){
            data = {
                type: 0,
                amount: amount,
                message: '',
                image: '',
                link: hashLink,
                toAddress: newAddress,
                isClaimed: false
            }
        }else if(activeTab === 1){
            data = {
                type: 1,
                amount: amount,
                message: message,
                image: image,
                link: hashLink,
                toAddress: newAddress,
                isClaimed: false
            }
        }
        addLinkToStorage(data);
        setLoading(false);
        //@ts-ignore
        delete data?.link
        try{
            await db.set(newAddress, data);
        }catch(e){
            console.log("Error occured while saving");
        }
        // router.push(`/create/${newAddress}`)
        return;
    }


    const invalidAmountToast = () => {
        toast.custom((t: any) => (
            <div
              className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <AlertCircle className='text-yellow-700' />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Invalid Amount
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Max {balance}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )) 
    }

    return (
        <div className='flex w-full justify-evenly'>
            <div className='flex flex-col items-center px-24'>
                <div className='mt-[180px] flex items-end ml-3'>
                    <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                {
                    activeTab === 0 && 
                    <div className='mt-20'>
                         {/* @ts-ignore */}
                        <div onClick={() => {inputRef1.current.focus()}} className='w-[330px] cursor-pointer h-[450px] rounded-3xl relative flex flex-col justify-start '>
                            <div className='w-full flex justify-center z-20 absolute top-[180px]'>
                                <span className='text-white text-[45px] font-sat font-bold'>$</span>
                                <div className='max-w-[270px] overflow-clip'>
                                    <span className='text-white text-[45px] font-sat font-bold'>{amount}</span>
                                </div>
                                <input ref={inputRef1} value={amount} onChange={handleAmountChange} autoFocus className='outline-none border-none bg-transparent w-[1px] text-[45px] ml-[4px] text-white' />
                                <span className={`text-gray-400 text-[45px] font-sat font-bold ${amount.length === 0 ? '': 'hidden'}`}>0.0</span>
                            </div>
                            <div className='w-full flex justify-start items-center z-20 absolute space-x-2 top-[15px] px-[15px]'>
                                <Link className='text-gray-400 w-4 h-4' />
                                <span className='font-semibold text-gray-400 text-[18px] font-sat'>flex.it</span>                    
                            </div>
                            <div className='w-full overflow-hidden'>
                                <WavyBackground />
                            </div>
                            <div className='absolute z-10 right-[10px] -top-[30px] flex items-center'>
                                <span className='text-white tect-[18px] font-sat'>Max: {balance}</span>
                            </div>
                        </div>
                    </div>
                }
                {
                    activeTab === 1 &&
                    <div className='mt-20'>
                        {/* @ts-ignore */}
                        <div onClick={() => {inputRef1.current.focus()}} style={{backgroundImage: image}} className={`w-[330px] cursor-pointer bg-cover h-[450px] rounded-3xl relative flex flex-col justify-start`}>
                            <div className='w-full flex justify-center z-20 absolute top-[180px]'>
                                <span className={`${isDark ? 'text-black' : 'text-white'}  text-[45px] font-sat font-bold`}>$</span>
                                <div className='max-w-[270px] overflow-clip'>
                                    <span className={`${isDark ? 'text-black' : 'text-white'}  text-[45px] font-sat font-bold`}>{amount}</span>
                                </div>
                                <input ref={inputRef1} value={amount} onChange={handleAmountChange} autoFocus className='outline-none border-none ml-1 bg-transparent w-[1px] text-[45px] text-white' />
                                <span className={`${isDark ? 'text-gray-900' : 'text-gray-400'} text-[45px] font-sat font-bold ${amount.length === 0 ? '': 'hidden'}`}>0.0</span>
                            </div>
                            <div className='w-full flex justify-start items-center z-20 absolute space-x-2 top-[15px] px-[15px]'>
                                <Link className={`${isDark ? 'text-black' : 'text-gray-400'} w-4 h-4`} />
                                <span className={`font-semibold ${isDark ? 'text-black' : 'text-gray-400'} text-[18px] font-sat`}>flex.it</span>                    
                            </div>
                            <div onClick={handleEnterMessage} className={`absolute bottom-[20px] z-40 mx-[20px] w-[290px] px-3 ${isDark ? 'bg-black': 'bg-white'} rounded-xl h-[50px] flex items-center space-x-4 overflow-hidden`}>
                                <div className={`h-[30px] w-[30px] rounded-full ${isDark ? 'bg-[#0767EB]': 'bg-[#EA52A2] ' } flex flex-col justify-center items-center`}>
                                    <PartyPopper className='w-4 h-4 text-white' />
                                </div>
                                <input value={message} onChange={(e) => {setMessage(e.target.value)}} placeholder='Enter a small message!' ref={inputRef2} className={`${isDark ? 'text-white': 'text-black'} font-bold font-sans outline-none border-none bg-transparent w-[220px] text-[15px]`} ></input>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <div className='absolute -left-[190px] z-10 top-[175px] bg-white w-[170px] h-[40px] cursor-pointer rounded-xl flex flex-col justify-center items-center '>
                                        <span className='font-medium text-[12px]'>Upload background image</span>
                                    </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogDescription className='flex justify-center'>
                                            <ShadTabs defaultValue="upload" className="w-[400px]">
                                                <TabsList className="grid w-full grid-cols-2">
                                                    <TabsTrigger value="upload">Upload Image</TabsTrigger>
                                                    <TabsTrigger value="insert">Insert Link</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="upload">
                                                    <Card>
                                                        <CardHeader>
                                                            <CardTitle>Upload Image Here</CardTitle>
                                                        </CardHeader>
                                                        {/*  @ts-ignore */}
                                                        <CardContent className="space-y-2 h-[200px] flex flex-col justify-center items-center  ">
                                                            <Image className='w-9 h-9 text-gray-500' />
                                                            <input
                                                                type="file"
                                                                name="myImage"
                                                                className='ml-20'
                                                                onChange={(event) => {
                                                                    // @ts-ignore
                                                                    setInsertedImage(event.target.files[0]);
                                                                }}
                                                            />
                                                        </CardContent>
                                                        <CardFooter className='flex justify-end px-5 space-x-5'>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={handleInsetImage}>Confirm</AlertDialogAction>
                                                        </CardFooter>
                                                    </Card>
                                                </TabsContent>
                                                <TabsContent value="insert">
                                                    <Card>
                                                        <CardHeader>
                                                            <CardTitle>Insert Link Here</CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="space-y-2 h-[200px] flex flex-col justify-center">
                                                            <div className="space-y-1">
                                                                <Input value={imageLink} onChange={(e) => {setImageLink(e.target.value)}} id="current"  />
                                                            </div>
                                                        </CardContent>
                                                        <CardFooter className='flex justify-end px-5 space-x-5'>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={handleInsertLink}>Confirm</AlertDialogAction>
                                                        </CardFooter>
                                                    </Card>
                                                </TabsContent>
                                            </ShadTabs>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                </AlertDialogContent>
                            </AlertDialog>
                            <div className='absolute z-10 right-[10px] -top-[30px] flex items-center'>
                                <span className='text-white tect-[18px] font-sat'>Max: {balance}</span>
                            </div>
                            <div className='absolute arrow-right z-10 top-[175px] -left-[30px] cursor-pointer'></div>
                            <div onClick={(e) => handleColorChange(e, "black")} className='top-[180px] -right-[50px] absolute w-[30px] h-[30px] rounded-full border-[1px] border-white bg-black' />
                            <div onClick={(e) => handleColorChange(e, "white")} className='top-[230px] -right-[50px] absolute w-[30px] h-[30px] rounded-full bg-white' />
                        </div>
                    </div>
                }
            </div>
            <div className='flex flex-col justify-center'>
                {
                    connected ?
                    (
                        loading ?
                        <div>
                            <div onClick={handleButtonClick} className='w-[130px] mt-40 bg-white h-[45px] rounded-lg hover:bg-[#0D0D0D] hover:text-white duration-200 cursor-pointer flex justify-center items-center' >
                                <ReloadIcon className="h-3 w-3 animate-spin mr-6" />
                                <span className='font-medium transition-[1s] text-[15px]'>Waiting</span>
                            </div>
                        </div>
                        :
                        <div onClick={handleButtonClick} className='w-[130px] mt-40 bg-white h-[45px] rounded-lg hover:bg-[#0D0D0D] hover:text-white duration-200 cursor-pointer flex justify-center items-center'>
                            <span className='font-medium transition-[1s] text-[18px]'>Create Link</span>
                        </div>
                    )
                        :
                    <div onClick={handleConnectWallet} className='w-[130px] mt-40 bg-white h-[45px] rounded-lg hover:bg-[#0D0D0D] hover:text-white duration-200 cursor-pointer flex justify-center items-center'>
                        <span className='font-medium transition-[1s] text-[15px]'>Connect Wallet</span>
                    </div>
                }
            </div>
        </div>
    )
}

export default CreateLink