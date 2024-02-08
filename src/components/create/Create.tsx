"use client";
import React,{useState, useEffect, useRef, useCallback} from 'react'
import { Tabs } from './Tabs';
import { WavyBackground } from './WavyBackground';
import { Link, AlertCircle, Copy } from 'lucide-react';
import { ReloadIcon } from "@radix-ui/react-icons"
import { useAccount } from 'wagmi';
import { useModal } from 'connectkit';
import { generateRandomKeyPair, getUSDCBalance, sendUsdcTransaction, addLinkToStorage } from '@/service/wallet/utils';
import toast from 'react-hot-toast';
import { useSendTransaction, useWaitForTransaction } from 'wagmi' 
import { db } from '@/utils/db';
import QRCode from "react-qr-code";
import TextareaAutosize from 'react-textarea-autosize';
import ColorPicker from './ColorPicker';
import ImagePicker from './ImagePicker';

const CreateLink = () => {

    const [activeTab, setActiveTab] = useState(0);
    const [image, setImage] = useState("url(/people.jpg)");
    const [message, setMessage] = useState('');
    const [amount, setAmount] = useState('');
    const {isConnected, address} = useAccount()
    const [connected , setConnected] = useState(false);
    const [balance, setBalance] = useState('0.00');
    const [isDark, setIsDark] = useState(false);
    const [imageLink, setImageLink] = useState('');
    const [insertedImage, setInsertedImage] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [toastId, setToastId] = useState<any>(null);

    const [newAddress, setNewAddress] = useState('');
    const [hashLink, setHashLink] = useState('');

    const [isCreated, setIsCreated] = useState(false);

    const [colo1, setColor1] = useState('#fff');

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

    const handleInsertImage = () => {
        console.log(URL.createObjectURL(insertedImage))
        setImage(`url(${URL.createObjectURL(insertedImage)})`);
        setInsertedImage('')
    }

    const copy = () => {
        navigator.clipboard.writeText(`http://localhost:3000/claim/${hashLink}`);
        toast.success('Copied')
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
        setIsCreated(true);

        let data;
        if(activeTab === 0){
            data = {
                type: 0,
                amount: amount,
                message: '',
                image: '',
                link: hashLink,
                toAddress: newAddress,
                color: colo1,
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
                color: colo1,
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

    const setMax = (e: any) => {
        e.stopPropagation(); 
        setAmount(balance)
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
        <div className='flex w-full justify-center'>
            {
                isCreated ? 
                <div className='flex flex-col items-center'>
                    <div className='mt-[20vh] w-full flex justify-center'>
                        <span className='text-white text-[37px] sm:text-[45px] font-sat font-bold'>Your link is ready!</span>
                    </div>
                         <div className='flex flex-col items-center mt-[10vh]'>
                            <div className='bg-white p-3'>
                                <QRCode value={`http://localhost:3000/claim/${hashLink}`} className='w-[120px] h-[120px]' />
                            </div>
                             <div className='flex items-center space-x-2 mt-[7vh]'>
                                 <div className='bg-zinc-800 text-white  px-4 py-2 rounded-xl text-[12px] sm:text-[15px] font-semibold font-sat'>http://localhost:3000/claim/{hashLink}</div>
                             </div>
                             <div className='mt-[3vh] flex justify-between w-[200px]'>
                                <div onClick={copy} className='flex items-center space-x-2 cursor-pointer'>
                                    <div className='bg-zinc-800 text-white  px-4 py-2 rounded-xl text-[12px] sm:text-[15px] font-semibold font-sat'>Copy</div>
                                </div>
                                <div className='flex items-center space-x-2 cursor-not-allowed'>
                                    <div className='bg-zinc-800 text-white  px-4 py-2 rounded-xl text-[12px] sm:text-[15px] font-semibold font-sat'>Share</div>
                                </div>
                             </div>
                         </div>
                </div>
                :
                <div className='flex flex-col items-center'>
                    <div className='mt-[18vh] flex items-end ml-3'>
                        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>
                    {
                        activeTab === 0 && 
                        // @ts-ignore
                        <div onClick={() => {inputRef1.current.focus()}} className='rounded-3xl cursor-pointer mt-[5vh]'>
                            <div className='w-[340px] h-[55vh] rounded-3xl relative flex flex-col justify-start overflow-hidden'>
                                <div className='w-full flex justify-center z-20 absolute top-[21vh]'>
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
                                <div onClick={(e) => setMax(e)} className='absolute top-[32vh] w-full text-center'>
                                    <span className='font-semibold text-[13px] text-white font-sat z-50 px-3 py-2 rounded-2xl bg-zinc-800'>Max: {balance} USDC</span>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        activeTab === 1 &&
                        // @ts-ignore
                        <div onClick={() => {inputRef1.current.focus()}} style={{backgroundImage: image}} className='rounded-3xl cursor-pointer mt-[5vh] bg-cover'>
                            <div className='w-[340px] h-[55vh] rounded-3xl relative flex flex-col justify-start '>
                                <div className='w-full flex justify-center z-20 absolute top-[24vh]'>
                                    <span style={{color: colo1}} className=' text-[45px] font-sat font-bold'>$</span>
                                    <div className='max-w-[270px] overflow-clip'>
                                        <span style={{color: colo1}} className=' text-[45px] font-sat font-bold'>{amount}</span>
                                    </div>
                                    <input ref={inputRef1} value={amount} onChange={handleAmountChange} autoFocus className='outline-none border-none bg-transparent w-[1px] text-[45px] ml-[4px] text-white' />
                                    <span className={`text-gray-300 text-[45px] font-sat font-bold ${amount.length === 0 ? '': 'hidden'}`}>0.0</span>
                                </div>
                                <div className='w-full flex justify-start items-center z-20 absolute space-x-2 top-[15px] px-[15px]'>
                                    <Link className={`${isDark ? 'text-black' : 'text-gray-400'} w-4 h-4`} />
                                    <span className={`font-semibold ${isDark ? 'text-black' : 'text-gray-400'} text-[18px] font-sat`}>flex.it</span>                    
                                </div>
                                <div className='absolute top-[2vh] right-[20px] z-50 flex flex-col space-y-4 items-center'>
                                    <ImagePicker handleInsertImage={handleInsertImage} handleInsertLink={handleInsertLink} imageLink={imageLink} setImageLink={setImageLink} setInsertedImage={setInsertedImage} />
                                    {/* <ColorPicker selectedColor={colo1} setSelectedColor={setColor1} /> */}
                                </div>
                                <div onClick={handleEnterMessage} className={`absolute bottom-[2vh] z-40 mx-[20px] w-[310px] rounded-xl space-x-4 overflow-hidden `}>
                                    <TextareaAutosize  value={message} onChange={(e) => {setMessage(e.target.value)}} placeholder='Enter a small message!' ref={inputRef2} style={{color: colo1}} className={`font-bold max-h-[8rem] font-sat text-center outline-none border-none bg-transparent w-[300px] text-[17px] py-3 px-4`} ></TextareaAutosize>
                                </div>
                            </div>
                        </div>
                    }
                    {
                            connected ?
                            (
                                loading ?
                                <div>
                                    <div onClick={handleButtonClick} className='w-[130px] bg-white h-[45px] mt-[7vh] rounded-lg hover:bg-[#0D0D0D] hover:text-white duration-200 cursor-not-allowed flex justify-center items-center' >
                                        <ReloadIcon className="h-3 w-3 animate-spin mr-6" />
                                        <span className='font-medium transition-[1s] text-[15px]'>Waiting</span>
                                    </div>
                                </div>
                                :
                                <div onClick={handleButtonClick} className='w-[130px] bg-white h-[45px] rounded-lg mt-[7vh] hover:bg-[#0D0D0D] hover:text-white duration-200 cursor-pointer flex justify-center items-center'>
                                    <span className='font-medium transition-[1s] text-[18px]'>Create Link</span>
                                </div>
                            )
                                :
                            <div onClick={handleConnectWallet} className='w-[130px] bg-white h-[45px] rounded-lg mt-[7vh] hover:bg-[#0D0D0D] hover:text-white duration-200 cursor-pointer flex justify-center items-center'>
                                <span className='font-medium transition-[1s] text-[15px]'>Connect Wallet</span>
                            </div>
                    }
                </div>

            }
        </div>
    )
}

export default CreateLink