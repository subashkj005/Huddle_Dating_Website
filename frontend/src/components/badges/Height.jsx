import React from 'react'
import { PiRulerLight } from "react-icons/pi";

function Height(props) {
  return (
    <div className=" rounded-2xl p-2 m-3 border-2 border-slate-400 h-8 flex items-center justify-center text-center">
        <span>
        <PiRulerLight/>
        </span>
        <span className="text-[0.8rem]">{props.value}cm</span>
      </div>
  )
}

export default Height