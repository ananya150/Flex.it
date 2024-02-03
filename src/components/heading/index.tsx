"use client";
import React from 'react'
import styles from './page.module.scss'
import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'lucide-react';

import { i1, i2, i3, i4, i5, i6 } from './data';

const Heading = () => {

    const plane1 = useRef(null);
    const plane2 = useRef(null);
    
    let requestAnimationFrameId: any = null;
    let xForce = 0;
    let yForce = 0;
    const easing = 0.08;
    const speed = 0.01;

    const manageMouseMove = (e: any) => {
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
        gsap.set(plane1.current, {x: `+=${xForce * 0.5}`, y: `+=${yForce * 0.5}`})
        gsap.set(plane2.current, {x: `+=${xForce * 0.2}`, y: `+=${yForce * 0.2}`})
    
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
      <div ref={plane1} className={styles.plane}>
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
      </div>
      <div ref={plane2} className={styles.plane}>
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
      </div>
      <div className='top-[25%] absolute w-full'>
        <div className='flex items-center space-x-2 w-full justify-center'>
          <Link className='text-white w-7 h-7' />
          <span className='font-bold text-white text-[32px] font-sat'>flex.it</span>
        </div>
        <div className='flex flex-col items-center '>
          <span className='font-bold text-white text-[80px] font-sans'>Tip anyone, anywhere</span>
          <span className='font-bold text-white text-[80px] font-sans'>with just a link</span>
        </div>
      </div>
    </main>
  )
}

export default Heading