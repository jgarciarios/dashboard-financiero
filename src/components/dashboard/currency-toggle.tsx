"use client"

import { useEffect, useState } from "react"
import { useCurrencyStore } from "@/store/currency-store"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

export function CurrencyToggle() {
    const { currency, setCurrency, fetchMepRate } = useCurrencyStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Fetch rate on global layout mount basically
        fetchMepRate()
    }, [fetchMepRate])

    if (!mounted) {
        // Render empty placeholder to avoid layout shift while hydrating
        return <div className="h-9 w-[110px] bg-muted animate-pulse rounded-md" />
    }

    const handleCurrencyChange = (v: string) => {
        const newCurrency = v as "ARS" | "USD"
        setCurrency(newCurrency)
        toast('Moneda actualizada', { description: `Mostrando valores en ${newCurrency}` })
    }

    return (
        <Tabs value={currency} onValueChange={handleCurrencyChange} className="w-[110px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ARS" className="text-xs font-semibold">ARS</TabsTrigger>
                <TabsTrigger value="USD" className="text-xs font-semibold">USD</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}
