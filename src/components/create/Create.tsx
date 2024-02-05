"use client";
import React,{useState, useEffect, useRef} from 'react'
import { Tabs } from './Tabs';
import { WavyBackground } from './WavyBackground';
import { Link, PartyPopper } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useModal } from 'connectkit';

const CreateLink = () => {

    const [activeTab, setActiveTab] = useState(0);
    const [image, setImage] = useState("url(/scene.jpg)");
    const [message, setMessage] = useState('');
    const [amount, setAmount] = useState('');
    const {isConnected, address} = useAccount()
    const [connected , setConnected] = useState(false);
    const [balance, setBalance] = useState('0.0');
    const [isDark, setIsDark] = useState(false);

    const inputRef1 = useRef(null);
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
                         {/* @ts-ignore */}
                        <div onClick={() => {inputRef1.current.focus()}} className='w-[330px] cursor-pointer h-[450px] rounded-3xl overflow-hidden relative flex flex-col justify-start '>
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
                            <WavyBackground />
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
                            {/* @ts-ignore */}
                            <div onClick={handleEnterMessage} className={`absolute bottom-[20px] z-40 mx-[20px] w-[290px] px-3 ${isDark ? 'bg-black': 'bg-white'} rounded-xl h-[50px] flex items-center space-x-4 overflow-hidden`}>
                                <div className={`h-[30px] w-[30px] rounded-full ${isDark ? 'bg-[#0767EB]': 'bg-[#EA52A2] ' } flex flex-col justify-center items-center`}>
                                    <PartyPopper className='w-4 h-4 text-white' />
                                </div>
                                <input value={message} onChange={(e) => {setMessage(e.target.value)}} placeholder='Enter a small message!' ref={inputRef2} className={`${isDark ? 'text-white': 'text-black'} font-bold font-sans outline-none border-none bg-transparent w-[220px] text-[15px]`} ></input>
                            </div>
                            <div className='absolute -left-[190px] z-10 top-[175px] bg-white w-[170px] h-[40px] cursor-pointer rounded-xl flex flex-col justify-center items-center '>
                                <span className='font-medium text-[12px]'>Upload background image</span>
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