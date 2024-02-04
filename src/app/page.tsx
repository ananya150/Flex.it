import Navbar from "@/components/navbar";
import React, { useRef } from "react";
import Heading from "@/components/heading";
import ScrollSection from "@/components/features";

export default function Home() {
  return (
    <div className="h-[300vh] bg-[#0D0D0D]" >
      <div className="h-[100vh]">
        <Navbar />
        <Heading />
      </div>
      <ScrollSection />
    </div>
  )
}
