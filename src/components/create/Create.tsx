"use client";
import React,{useState, useEffect} from 'react'
import { Tabs } from './Tabs';
import { WavyBackground } from './WavyBackground';

const CreateLink = () => {

    const [activeTab, setActiveTab] = useState(0);
    const [background, setBackground] = useState('bg-purple-500'); // Default background

    useEffect(() => {
        const handleMouseMove = (event: any) => {
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          
          const mouseXpercentage = Math.round((event.pageX / windowWidth) * 100);
          const mouseYpercentage = Math.round((event.pageY / windowHeight) * 100);
          
          const newBackground = `radial-gradient(at ${mouseXpercentage}% ${mouseYpercentage}%, #3498db, #9b59b6)`;
          setBackground(newBackground);
        };
    
        document.addEventListener('mousemove', handleMouseMove);
    
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
        };
      }, []);
    

    return (
        <div>
            <div className='px-24 mt-[160px] flex items-end justify-center w-full'>
                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div className='mt-20 w-full flex justify-center'>
                <div className='w-[330px] h-[450px] rounded-3xl overflow-hidden relative flex flex-col justify-start '>
                    <div className='w-full flex justify-center z-20 absolute top-[180px]'>
                        <span className='text-white text-[45px] font-sat font-bold'>$ 15.00</span>
                    </div>
                    {/* <div className='mx-[10px] w-[310px] bg-white bottom-[10px] z-10 h-[50px] absolute rounded-xl'>

                    </div> */}
                    <WavyBackground />
                </div>
            </div>
        </div>
    )
}

export default CreateLink