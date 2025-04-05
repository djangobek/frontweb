import React from 'react'
import Link from 'next/link';
import { FaTasks } from "react-icons/fa";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
function Navbar() {
  return (
    <div className='fixed bottom-0 flex w-screen h-20 bg-neutral-800 p-3'>
      <div className='flex items-center w-full justify-between'>
        <Link href={"/"} className='flex flex-col items-center font-bold'>
            <div><FaTasks size={25}/></div>
            <div>Chellenjlar</div>
        </Link>
        <Link href={"/calendar"} className='flex flex-col items-center font-bold'>
            <div><IoCalendarNumberOutline size={25}/></div>
            <div>Kalendar</div>
        </Link>
        <Link href={"/reyting"} className='flex flex-col items-center font-bold'>
            <div><BiSolidBarChartAlt2 size={25}/></div>
            <div>Reyting</div>
        </Link>
        <Link href={"/settings"} className='flex flex-col items-center font-bold '>
            <div><CiSettings size={30}/></div>
            <div>Sozlamalar</div>
        </Link>
      </div>
    </div>
  )
}

export default Navbar
