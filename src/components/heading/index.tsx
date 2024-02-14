"use client";
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss'
import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { LinkIcon } from 'lucide-react';
import { motion, useScroll } from "framer-motion";
import {useRouter} from 'next/navigation';
import { i1, i2, i3, i4, i5, i6 } from './data';

const Heading = () => {

    const plane1 = useRef(null);
    const plane2 = useRef(null);
    const [animationComplete, setAnimationComplete] = useState(false);

    const router = useRouter();
    
    let requestAnimationFrameId: any = null;
    let xForce = 0;
    let yForce = 0;
    const easing = 0.08;
    const speed = 0.01;

    const manageMouseMove = (e: any) => {
        if(!animationComplete){
          return;
        }
        const { movementX, movementY } = e
        xForce += movementX * speed;
        yForce += movementY * speed;
    
        if(requestAnimationFrameId == null){
          requestAnimationFrameId = requestAnimationFrame(animate);
        }
      }

    const lerp = (start: any, target: any, amount: any) => start * (1 - amount) +target * amount;

    const animate = () => {
        xForce = lerp(xForce, 0, easing);
        yForce = lerp(yForce, 0, easing);
        gsap.set(plane1.current, {x: `+=${xForce * 0.3}`, y: `+=${yForce * 0.2}`})
        gsap.set(plane2.current, {x: `+=${xForce * 0.2}`, y: `+=${yForce * 0.1}`})
    
        if(Math.abs(xForce) < 0.01) xForce = 0;
        if(Math.abs(yForce) < 0.01) yForce = 0;
        
        if(xForce != 0 || yForce != 0){
          requestAnimationFrame(animate);
        }
        else{
          cancelAnimationFrame(requestAnimationFrameId)
          requestAnimationFrameId = null;
        }
      }
      
  return (
    <main onMouseMove={(e) => {manageMouseMove(e)}} className={styles.main}>
      <motion.div 
        initial={{ y: 600}}
        animate={{ y: 0}}
        onAnimationComplete={() => {setAnimationComplete(true)}}
        transition={{
          delay: 0.6,
          duration: 0.4,
        }}
        ref={plane1} className={styles.plane}>
          <Image 
            src={i1}
            alt='image'
            width={300}
          />
           <Image 
            src={i2}
            alt='image'
            width={300}
          />
          {/* <Image 
            src={i3}
            alt='image'
            width={225}
          /> */}
      </motion.div>
      <motion.div 
        initial={{ y: 900}}
        animate={{ y: 0}}
        transition={{
          delay: 0.6,
          duration: 0.4,
        }}
        ref={plane2} className={styles.plane}>
          <Image 
            src={i4}
            alt='image'
            width={250}
          />
           <Image 
            src={i5}
            alt='image'
            width={200}
          />
          <Image 
            src={i6}
            alt='image'
            width={225}
          />
      </motion.div>
      <div className='top-[20%] absolute w-full'>
        <motion.div 
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{
              delay: 0.5,
              duration: 1,
            }}
          className='flex items-center space-x-2 w-full justify-center'>
            <LinkIcon className='text-white w-7 h-7' />
            <span className='font-bold text-white text-[32px] font-sat'>flex.it</span>
        </motion.div>
        <div className='flex flex-col items-center '>
          <span className='font-bold text-white text-[80px] font-sans'>Tip anyone, anywhere</span>
          <span className='font-bold text-white text-[80px] font-sans'>with just a link</span>
        </div>
        <div className='flex items-center mt-8 w-full justify-center'>
          <motion.div 
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            onClick={() => {router.push('/create')}}
            transition={{
              delay: 1,
              duration: 1.5,
            }}
            className='w-[130px] bg-white h-[45px] rounded-lg hover:bg-[#0D0D0D] hover:text-white duration-200 cursor-pointer flex justify-center items-center'>
            <span className='font-medium transition-[1s] text-[18px]'>Create Link</span>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

export default Heading