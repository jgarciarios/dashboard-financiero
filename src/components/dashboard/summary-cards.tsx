"use client"

import { useMemo } from "react"
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Wallet,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactionStore } from "@/store/transactions-store"

function formatCurrency(value: number) {
    return `$${Math.abs(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`
}

export function SummaryCards() {
    const transactions = useTransactionStore((s) => s.transactions)

    const { ingresos, gastos, flujoNeto } = useMemo(() => {
        let inc = 0
        let exp = 0
        for (const tx of transactions) {
            if (tx.tipo === "ingreso") inc += tx.monto
            else exp += tx.monto
        }
        return { ingresos: inc, gastos: exp, flujoNeto: inc - exp }
    }, [transactions])

    const cards = [
        {
            title: "Balance Total",
            value: formatCurrency(flujoNeto),
            icon: Wallet,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
        },
        {
            title: "Ingresos del Mes",
            value: formatCurrency(ingresos),
            icon: TrendingUp,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            title: "Gastos del Mes",
            value: formatCurrency(gastos),
            icon: TrendingDown,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
        },
        {
            title: "Flujo de Caja Neto",
            value: flujoNeto >= 0 ? `+${formatCurrency(flujoNeto)}` : `-${formatCurrency(flujoNeto)}`,
            icon: DollarSign,
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
                        <div className="text-2xl font-bold">{card.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
