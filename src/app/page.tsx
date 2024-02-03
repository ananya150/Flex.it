import Navbar from "@/components/navbar";
import React, { useRef } from "react";
import Heading from "@/components/heading";

export default function Home() {
  return (
    <div className="h-[300vh] bg-[#0D0D0D]" >
      <Navbar />
      <Heading />
    </div>
  )
}
