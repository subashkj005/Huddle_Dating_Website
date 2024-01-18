import React from 'react'
import { TbStarsFilled } from "react-icons/tb";

function ZodiacSign(props) {
  return (
    <div className=" rounded-2xl p-2 m-3 border-2 border-slate-400   h-8 flex items-center justify-center text-center">
        <span>
        <TbStarsFilled/>
        </span>
        <span className="text-[0.8rem] ">{props.value}</span>
      </div>
  )
}

export default ZodiacSign