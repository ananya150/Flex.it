"use client";
import React,{useState, useEffect, useRef} from 'react'
import { Tabs } from './Tabs';
import { WavyBackground } from './WavyBackground';
import { Link } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useModal } from 'connectkit';

const CreateLink = () => {

    const [activeTab, setActiveTab] = useState(0);
    const [image, setImage] = useState('');
    const [message, setMessage] = useState('');
    const [amount, setAmount] = useState('');
    const {isConnected, address} = useAccount()
    const [connected , setConnected] = useState(false);
    const [balance, setBalance] = useState('0.0')

    const imputRef1 = useRef(null);
    const inputRef2 = useRef(null)

    useEffect(() => {
        setConnected(isConnected);
        // clearStorage()
        if(isConnected){
            // fetchBalance()
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

    useEffect(() => {

    },[amount])

    return (
        <div className='flex w-full justify-evenly'>
            <div className='flex flex-col items-center px-24'>
                <div className='mt-[180px] flex items-end ml-3'>
                    <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                {
                    activeTab === 0 && 
                    <div className='mt-20'>
                        <div className='w-[330px] h-[450px] rounded-3xl overflow-hidden relative flex flex-col justify-start '>
                            <div className='w-full flex justify-center z-20 absolute top-[180px]'>
                                <span className='text-white text-[45px] font-sat font-bold'>$</span>
                                <div className='max-w-[270px] overflow-clip'>
                                    <span className='text-white text-[45px] font-sat font-bold'>{amount}</span>
                                </div>
                                1<input value={amount} onChange={handleAmountChange} autoFocus className='outline-none border-none bg-transparent w-[1px] text-[45px] text-white' />
                                <span className={`text-gray-400 text-[45px] font-sat font-bold ${amount.length === 0 ? '': 'hidden'}`}>0.0</span>
                            </div>
                            <div className='w-full flex justify-start items-center z-20 absolute space-x-2 top-[15px] px-[15px]'>
                                <Link className='text-gray-400 w-4 h-4' />
                                <span className='font-semibold text-gray-400 text-[18px] font-sat'>flex.it</span>                    
                            </div>
                            <WavyBackground />
                        </div>
                    </div>
                }
                {
                    activeTab === 1 &&
                    <div className='mt-20'>
                        <div className='w-[330px] bg-white h-[450px] rounded-3xl overflow-hidden relative flex flex-col justify-start '>
                            <div className='w-full flex justify-center z-20 absolute top-[180px]'>
                                <span className=' text-[45px] font-sat font-bold'>$ 15.00</span>
                            </div>
                            <div className='w-full flex justify-start items-center z-20 absolute space-x-2 top-[15px] px-[15px]'>
                                <Link className='text-gray-800 w-4 h-4' />
                                <span className='font-semibold text-gray-800 text-[18px] font-sat'>flex.it</span>                    
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className='flex flex-col justify-center'>
                {
                    connected ?
                    <div className='w-[130px] mt-40 bg-white h-[45px] rounded-lg hover:bg-[#0D0D0D] hover:text-white duration-200 cursor-pointer flex justify-center items-center'>
                        <span className='font-medium transition-[1s] text-[18px]'>Create Link</span>
                    </div>
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