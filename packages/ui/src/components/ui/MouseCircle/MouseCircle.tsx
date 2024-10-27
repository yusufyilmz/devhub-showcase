'use client'

import { useEffect, useState } from 'react'

export const MouseCircle = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      style={{
        left: position.x,
        top: position.y,
        position: 'fixed',
        transform: 'translate(-50%, -50%)',
        zIndex: 50
      }}
      className="w-0 h-0 pointer-events-none shadow-[0_0_20px_10px_rgba(30,144,255,0.4)]"
    ></div>
  )
}
