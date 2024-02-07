"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils/cn";

type Tab = {
  title: string;
  value: string;
};

const tabs = [
    {
      title: "Default",
      value: "default",
    },
    {
      title: "Custom",
      value: "custom",
    },
  ];

export const Tabs = ({
  activeTab, setActiveTab,
}: {
  activeTab: any,
  setActiveTab: any
}) => {

  const [active, setActive] = useState<Tab>(tabs[0]);

  const moveSelectedTabToTop = (idx: number) => {
    if(active === tabs[0]){
      setActiveTab(1);
    }else{
      setActiveTab(0)
    }
    const newTabs = [...tabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setActive(newTabs[0]);
  };

  const [hovering, setHovering] = useState(false);

  return (
    <>
      <div
        className="flex flex-row mr-6 space-x-20 items-center [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar"
      >
        {tabs.map((tab, idx) => (
          <button
            key={tab.title}
            onClick={() => {
              moveSelectedTabToTop(idx);
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className="relative px-4 py-2 rounded-full"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {active.value === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className="absolute inset-0 bg-zinc-800 rounded-full "
              />
            )}
            <span className="relative block text-white text-[16px] font-sat">
              {tab.title}
            </span>
          </button>
        ))}
      </div>
    </>
  );
};

