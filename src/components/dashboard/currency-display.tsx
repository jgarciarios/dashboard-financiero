"use client"

import { useCurrencyStore } from "@/store/currency-store"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface CurrencyDisplayProps {
    amount: number
    className?: string
    showSign?: boolean // + or - sign specifically 
}

export function CurrencyDisplay({ amount, className = "", showSign = false }: CurrencyDisplayProps) {
    const { currency, mepRate } = useCurrencyStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        // Prevent hydration mismatch by showing skeleton initially
        return <Skeleton className="h-6 w-24 inline-block" />
    }

    let displayAmount = amount
    let symbol = '$'
    let currencySuffix = ''

    if (currency === 'USD' && mepRate) {
        displayAmount = amount / mepRate
        symbol = 'USD '
    }

    const formattedAmount = Math.abs(displayAmount).toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

    const sign = amount < 0 ? '-' : showSign && amount > 0 ? '+' : ''

    return (
        <span className={className}>
            {sign}{symbol}{formattedAmount}{currencySuffix}
        </span>
    )
}
