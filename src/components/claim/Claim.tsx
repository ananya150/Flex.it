"use client";
import React, {useState} from 'react';
import { WavyBackground } from '../create/WavyBackground';
import { Link as LinkIcon, PartyPopper, Image, AlertCircle, Copy } from 'lucide-react';
import { ClaimDrawer } from './Drawer';
import Link from 'next/link';
import TextareaAutosize from 'react-textarea-autosize';

const Claim = ({data, address, link}: {data: any, address: any, link: any}) => {

    const [claimed, setClaimed] = useState(false);
    const [txHash, setTxHash] = useState('')

  return (
    <div>
            <div className='flex flex-col w-full items-center'>
                <div className='mt-[25vh] flex w-full justify-center'>
                    {
                        data["type"] === 0 ?
                            <div className='rounded-3xl'>
                                <div className='w-[330px] h-[450px] rounded-3xl relative flex flex-col justify-start overflow-hidden'>
                                    <div className='absolute top-[180px] flex flex-col items-center space-y-2  z-20 w-full'>
                                        <span className='text-white text-[15px] font-sat font-medium'>Someone sent you</span>
                                        <div className='w-full flex justify-center'>
                                            <span className='text-white text-[45px] font-sat font-bold'>$</span>
                                            <div className='max-w-[270px] overflow-clip'>
                                                <span className='text-white text-[45px] font-sat font-bold'>{data["amount"]}</span>
                                            </div>
                                            <span className={`text-gray-400 text-[45px] font-sat font-bold ${data["amount"].length === 0 ? '': 'hidden'}`}>0.0</span>
                                        </div>
                                    </div>
                                    <div className='w-full flex justify-start items-center z-20 absolute space-x-2 top-[15px] px-[15px]'>
                                        <LinkIcon className='text-gray-400 w-4 h-4' />
                                        <span className='font-semibold text-gray-400 text-[18px] font-sat'>flex.it</span>                    
                                    </div>
                                    <WavyBackground />
                                </div>
                            </div>
                            :
                            <div style={{backgroundImage: data["image"]}} className='rounded-3xl cursor-pointer bg-cover'>
                                <div className='w-[340px] h-[55vh] rounded-3xl relative flex flex-col justify-start '>
                                    <div className='w-full flex justify-center z-20 absolute top-[24vh]'>
                                        <span style={{color: data["color"]}} className=' text-[45px] font-sat font-bold'>$</span>
                                        <div className='max-w-[270px] overflow-clip'>
                                            <span style={{color: data["color"]}} className='text-[45px] font-sat font-bold'>{data["amount"]}</span>
                                        </div>
                                    </div>
                                    <div className='w-full flex justify-start items-center z-20 absolute space-x-2 top-[15px] px-[15px]'>
                                        <LinkIcon className={`text-gray-400 w-4 h-4`} />
                                        <span className={`font-semibold text-gray-400 text-[18px] font-sat`}>flex.it</span>                    
                                    </div>
                                    <div className='absolute top-[2vh] right-[20px] z-50 flex flex-col space-y-4 items-center'>
                                    </div>
                                    <div className={`absolute bottom-[2vh] z-40 mx-[20px] w-[310px] rounded-xl space-x-4 overflow-hidden `}>
                                        <TextareaAutosize disabled value={data["message"]} placeholder='Enter a small message!' style={{color: data["color"]}} className={`font-bold max-h-[8rem] font-sat text-center outline-none border-none bg-transparent w-[300px] text-[17px] py-3 px-4`} ></TextareaAutosize>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
                {
                    claimed ?
                    <div className='mt-[5vh]'>
                        <span className='text-white sm:text-[26px] text-[15px] text-center font-sat font-bold'>Link successfully claimed! Check the transaction </span> <Link href={`https://base-sepolia.blockscout.com/tx/${txHash}`} target='_blank' className='text-white sm:text-[26px] text-[15px] font-sat font-bold'><u>here</u></Link>
                    </div>
                    :
                    <ClaimDrawer data={data} hash={link} setClaimed={setClaimed} setTxHash={setTxHash}>
                        <div className='w-[130px] mt-20 bg-white px-4 h-[45px] rounded-lg hover:bg-[#0D0D0D] hover:text-white duration-200 cursor-pointer flex justify-center items-center'>
                            <span className='font-medium transition-[1s] text-[18px]'>Claim</span>
                        </div>
                    </ClaimDrawer>
                }
            </div>

    </div>
  )
}

export default Claim