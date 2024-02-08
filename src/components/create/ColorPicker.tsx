import React, { useState } from 'react';
import { TwitterPicker } from 'react-color';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";

const ColorPicker = ({selectedColor, setSelectedColor}: {selectedColor: any, setSelectedColor: any}) => {

    const [color, setColor] = useState('#fff')

    const handleChange = () => {
        setSelectedColor(color)
    }

  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <div className=''>
                <span className='font-semibold text-[12px] bg-white bg-opacity-50 px-[22px] py-2 rounded-lg'>Text Color</span>
            </div>
        </AlertDialogTrigger>
        <AlertDialogContent className='w-[330px] rounded-2xl'>
            <TwitterPicker color={color} onChangeComplete={(color) => {setColor(color.hex);}} />
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleChange}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default ColorPicker