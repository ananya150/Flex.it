import React from 'react'
import { WavyBackground } from '../create/WavyBackground';
import { Link as LinkIcon } from 'lucide-react';

const Claimed = ({data}: {data: any}) => {
  return (
    <div className='flex flex-col w-full items-center'>
        <div className='mt-[180px] flex flex-col w-full items-center'>
            <div>
                <span className='text-white text-[50px] font-sat font-bold'>This link is already claimed</span>
            </div>
            {
                data["type"] === 0 ?
                    <div className='rounded-3xl mt-20'>
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
                    <div>

                    </div>
            }
        </div>
    </div>  
    )
}

export default Claimed