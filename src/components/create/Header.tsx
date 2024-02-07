"use client";
import React, {useState, useEffect} from 'react';
import { Link } from 'lucide-react';
import { ConnectKitButton } from 'connectkit'

const Header = () => {

  return (
        <div className='flex w-[100%] justify-center'>
            <div className={`fixed w-[92%] bg-[#0D0D0D] top-5 h-[10vh] rounded-[3rem] border-[#1D1D1D] border flex flex-col justify-center sm:px-12 px-8 z-10 `}>
                <div className='w-full flex justify-between items-center'>
                    <div className='flex items-center space-x-2'>
                        <Link className='text-white w-7 h-7 ' />
                        <span className='font-bold text-white text-[32px] font-sat'>flex.it</span>
                    </div>
                    <div className='items-center space-x-16 hidden sm:block'>
                        <ConnectKitButton mode='dark'/>
                    </div>
                </div>        
            </div>  
        </div>
    )
}

export default Header