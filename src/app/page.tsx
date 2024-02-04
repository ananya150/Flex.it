import Navbar from "@/components/navbar";
import React, { useRef } from "react";
import Heading from "@/components/heading";
import ScrollSection from "@/components/features";
import Hero from "@/components/hero";
import Working from "@/components/working";

export default function Home() {
  return (
    <div className="h-[300vh] bg-[#0D0D0D]" >
      <div className="h-[100vh]">
        <Navbar />
        <Heading />
      </div>
      <Hero />
      <ScrollSection />
      <Working />
      <div className="h-[100vh] bg-[#0D0D0D] flex flex-col justify-center items-center">
        <span className="text-white text-[30px]">Footer</span>
      </div>
    </div>
  )
}
