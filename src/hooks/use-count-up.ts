"use client"

import { useEffect, useState } from "react"

export function useCountUp(end: number, duration: number = 1500) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let startTime: number | null = null
        let animationFrame: number

        const updateCount = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = timestamp - startTime
            
            // Ease out expo function
            const easeOutExpo = (x: number): number => {
                return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
            }

            const increment = end * easeOutExpo(Math.min(progress / duration, 1))

            if (progress < duration) {
                setCount(increment)
                animationFrame = requestAnimationFrame(updateCount)
            } else {
                setCount(end)
            }
        }

        animationFrame = requestAnimationFrame(updateCount)

        return () => cancelAnimationFrame(animationFrame)
    }, [end, duration])

    return count
}
