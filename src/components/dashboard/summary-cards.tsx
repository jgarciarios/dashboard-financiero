"use client"

import { useMemo } from "react"
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Wallet,
    Briefcase,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CurrencyDisplay } from "./currency-display"

interface SummaryCardsProps {
    ingresos: number
    gastos: number
    flujoNeto: number
    patrimonioNeto?: number
}

export function SummaryCards({ ingresos, gastos, flujoNeto, patrimonioNeto = 0 }: SummaryCardsProps) {

    const cards = [
        {
            title: "Patrimonio Neto",
            value: patrimonioNeto,
            icon: Briefcase,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
        },
        {
            title: "Ingresos del Mes",
            value: ingresos,
            icon: TrendingUp,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            title: "Gastos del Mes",
            value: gastos,
            icon: TrendingDown,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
        },
        {
            title: "Flujo de Caja Neto",
            value: flujoNeto,
            icon: Wallet,
            color: flujoNeto >= 0 ? "text-emerald-500" : "text-red-500",
            bgColor: flujoNeto >= 0 ? "bg-emerald-500/10" : "bg-red-500/10",
        },
    ]

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.title} className="relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {card.title}
                        </CardTitle>
                        <div className={`rounded-lg p-2 ${card.bgColor}`}>
                            <card.icon className={`h-4 w-4 ${card.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {card.title === "Flujo de Caja Neto" ? (
                                <CurrencyDisplay amount={card.value} showSign />
                            ) : (
                                <CurrencyDisplay amount={card.value} />
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
