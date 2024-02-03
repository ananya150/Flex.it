"use client";
import React, {useState, useEffect} from 'react';
import { Link } from 'lucide-react';

const Navbar = () => {

    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        let lastScrollY = window.pageYOffset;
    
        const handleScroll = () => {
          const currentScrollY = window.pageYOffset;

          if (currentScrollY > 30) {
            setIsVisible(lastScrollY > currentScrollY);
          } else {
            // Always visible within the first 100px
            setIsVisible(true);
          }    

          lastScrollY = currentScrollY;
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);    


  return (
        <div className='flex w-[100%] justify-center'>
            <div style={{transition: 'top 0.4s'}} className={`fixed w-[92%] bg-[#0D0D0D] ${isVisible ? 'top-5': 'top-[-100px]'} h-[85px] rounded-[3rem] border-[#1D1D1D] border flex flex-col justify-center px-12 z-10 `}>
                <div className='w-full flex justify-between items-center'>
                    <div className='flex items-center space-x-2'>
                        <Link className='text-white w-7 h-7' />
                        <span className='font-bold text-white text-[32px] font-sat'>flex.it</span>
                    </div>
                    <div className='flex items-center space-x-16'>
                        <span className='text-white text-[18px] font-sat font-medium'>Home</span>
                        <span className='text-white text-[18px] font-sat font-medium'>Blog</span>
                        <span className='text-white text-[18px] font-sat font-medium'>FAQ</span>
                    </div>
                </div>        
            </div>  
        </div>
    )
}

export default Navbar