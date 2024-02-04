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
        translateX: "-300vw",
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
    <section className="overflow-hidden">
      <div ref={triggerRef}>
        <div ref={sectionRef} className="h-[100vh] w-[400vw] bg-[#0D0D0D] flex relative ">
          <div className="h-[100vh] w-[100vw] justify-center items-center flex">
            <h3 className="text-white">Section 1</h3>
          </div>
          <div className="h-[100vh] w-[100vw] justify-center items-center flex">
            <h3 className="text-white">Section 2</h3>
          </div>
          <div className="h-[100vh] w-[100vw] justify-center items-center flex">
            <h3 className="text-white">Section 3</h3>
          </div>
          <div className="h-[100vh] w-[100vw] justify-center items-center flex">
            <h3 className="text-white">Section 4</h3>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ScrollSection;