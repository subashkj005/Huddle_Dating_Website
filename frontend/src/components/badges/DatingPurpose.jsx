import React from 'react'
import { TiZoom } from "react-icons/ti";

function DatingPurpose(props) {
  return (
    <div className=" rounded-2xl p-2 m-3 border-2 border-slate-400 h-8 flex items-center justify-center text-center">
        <span>
        <TiZoom/>
        </span>
        <span className="text-[0.8rem]">{props.value}</span>
      </div>
  )
}

export default DatingPurpose