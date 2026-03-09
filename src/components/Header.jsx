import { useState, useEffect } from "react";

export default function Header(){

  const [time,setTime] = useState(0)

  useEffect(()=>{

    const timer = setInterval(()=>{
      setTime(t=>t+1)
    },1000)

    return ()=>clearInterval(timer)

  },[])

  return(

    <div className="game-header">

      <div className="mines-count">
        💣
      </div>

      <button>
        ⟳
      </button>

      <div className="timer">
        ⏱ {time}
      </div>

    </div>

  )
}