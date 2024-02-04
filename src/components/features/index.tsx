"use client"
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

function ScrollSection() {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    const pin = gsap.fromTo(
      sectionRef.current,
      {
        translateX: 0,
      },
      {
        translateX: "-200vw",
        ease: "none",
        duration: 1,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "2000 top",
          scrub: 0.6,
          pin: true,
        },
      }
    );
    return () => {
      {/* A return function for killing the animation on component unmount */ }
      pin.kill();
    };
  }, []);

  return (
    <section className="overflow-hidden bg-[#0D0D0D]">
      <div ref={triggerRef}>
        <div ref={sectionRef} className="h-[100vh] w-[300vw] bg-[#0D0D0D] flex relative ">
          <div className="h-[100vh] w-[100vw] justify-center items-center flex px-[10vw] py-[10vh] ">
            <div className="w-full h-full relative bg-1">
              <div className="w-full h-full flex flex-col justify-center ">
                <div className="w-full text-center">
                  <span className="text-white text-[40px] font-bold font-sans opacity-100">Tip Anyone without needing their information</span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[100vh] w-[100vw] justify-center items-center flex px-[10vw] py-[10vh] ">
            <div className="w-full h-full relative bg-2">
              <div className="w-full h-full flex flex-col justify-center ">
                <div className="w-full text-center">
                  <span className="text-white text-[40px] font-bold font-sans opacity-100">Tip Anywhere without worrying about their currency</span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[100vh] w-[100vw] justify-center items-center flex px-[10vw] py-[10vh] ">
            <div className="w-full h-full relative bg-3">
              <div className="w-full h-full flex flex-col justify-center ">
                <div className="w-full text-center">
                  <span className="text-white text-[40px] font-bold font-sans opacity-100">Fully Decentralized with security of a blockchain</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ScrollSection;