import { FaPlus } from "react-icons/fa";
import { FaRunning } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { FaSwimmer } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import Navbar from "./components/navbar";
export default function Home() {
  return (
    <div>
      <div className="w-screen h-screen flex flex-col bg-[url('/bg2.jpg')] bg-cover bg-center bg-fixed gap-5 pt-5 p-3">
        <div className="border-none w-full p-3 rounded-xl h-20 items-center flex bg-linear-to-r from-neutral-800 to-neutral-600 justify-between">
          <div className="text-xl">Label</div>
          <div className="h-7 w-7 flex items-center justify-center rounded-full border-2"><IoIosClose size={25}/></div>
        </div>
        <div className="flex justify-between items-center text-2xl">
          <div>Challenges</div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border-1 border-white"><FaPlus size={30}/></div>
        </div>
        <div className="flex flex-col gap-3 items-center">
          <div className="w-full bg-neutral-800 rounded-xl h-20 text-xl flex justify-between items-center p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex bg-white text-black items-center justify-center">
                <FaRunning size={30}/>
              </div>
              <div>Yugurish</div>
            </div>
            <div className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-xl">0</div>
          </div>
          <div className="w-full bg-neutral-800 rounded-xl h-20 text-xl flex justify-between items-center p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex bg-white text-black items-center justify-center">
                <FaBook size={25}/>
              </div>
              <div>Kitob o&apos;qish</div>
            </div>
            <div className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-xl">0</div>
          </div>
          <div className="w-full bg-neutral-800 rounded-xl h-20 text-xl flex justify-between items-center p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex bg-white text-black items-center justify-center">
                <FaSwimmer size={25}/>
              </div>
              <div>Suzish</div>
            </div>
            <div className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-xl">0</div>
          </div>

        </div>
      </div>
      <Navbar />
    </div>
  );
}
