import Vector from "assets/Vector.png"
import React from "react"

interface IconProps {
  style?: React.CSSProperties
  onClick: () => void
}

const AiIcon: React.FC<IconProps> = ({ style, onClick }) => {
  return (
    <div
      className="rounded-full shadow-md flex items-center justify-center p-1 h-10 w-10 bg-white cursor-pointer"
      style={style}
      onMouseDown={onClick}>
      <img src={Vector} alt="vector" />
    </div>
  )
}

export default AiIcon
