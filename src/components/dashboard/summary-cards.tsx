"use client"

import {
    Zap,
    Users,
    Target,
    TrendingUp,
    TrendingDown,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CurrencyDisplay } from "./currency-display"
import { useCountUp } from "@/hooks/use-count-up"

interface SummaryCardsProps {
    mrr: number
    mrrTrend: number
    retainers: number
    retainersTrend: number
    ticketPromedio: number
    ticketPromedioTrend: number
    rentabilidad: number
    rentabilidadTrend: number
}

export function SummaryCards({ 
    mrr, mrrTrend, 
    retainers, retainersTrend, 
    ticketPromedio, ticketPromedioTrend, 
    rentabilidad, rentabilidadTrend 
}: SummaryCardsProps) {
    const animatedMrr = useCountUp(mrr)
    const animatedRetainers = useCountUp(retainers)
    const animatedTicket = useCountUp(ticketPromedio)
    const animatedRentabilidad = useCountUp(rentabilidad)

    const formatTrend = (trend: number) => {
        const value = Math.abs(trend).toFixed(1)
        return trend >= 0 ? `+${value}%` : `-${value}%`
    }

    const cards = [
        {
            title: "MRR (Ingreso Recurrente)",
            value: animatedMrr,
            isCurrency: true,
            icon: Zap,
            color: "text-cyan-400",
            bgColor: "bg-cyan-500/10",
            insight: `${formatTrend(mrrTrend)} vs mes anterior`,
            isPositive: mrrTrend >= 0,
            delay: "animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both",
        },
        {
            title: "Retainers / Clientes Activos",
            value: Math.round(animatedRetainers),
            isCurrency: false,
            icon: Users,
            color: "text-cyan-400",
            bgColor: "bg-cyan-500/10",
            insight: `${formatTrend(retainersTrend)} vs mes anterior`,
            isPositive: retainersTrend >= 0,
            delay: "animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both",
        },
        {
            title: "Ticket Promedio",
            value: animatedTicket,
            isCurrency: true,
            icon: Target,
            color: "text-cyan-400",
            bgColor: "bg-cyan-500/10",
            insight: `${formatTrend(ticketPromedioTrend)} vs mes anterior`,
            isPositive: ticketPromedioTrend >= 0,
            delay: "animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both",
        },
        {
            title: "Rentabilidad Neta",
            value: animatedRentabilidad,
            isCurrency: true,
            icon: TrendingUp, // Main icon
            color: "text-cyan-400",
            bgColor: "bg-cyan-500/10",
            insight: `${formatTrend(rentabilidadTrend)} vs mes anterior`,
            isPositive: rentabilidadTrend >= 0,
            delay: "animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both",
        },
    ]

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <Card 
                    key={card.title} 
                    className={`group relative overflow-hidden rounded-2xl border-border/40 bg-card hover:bg-accent/5 hover:border-cyan-500/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)] hover:border-cyan-500/50 ${card.delay}`}
                >
                    {/* Efecto de resplandor sutil (Midnight Cyan aesthetic) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6 relative z-10">
                        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                            {card.title}
                        </CardTitle>
                        <div className={`rounded-xl p-2.5 ${card.bgColor} ring-1 ring-inset ring-cyan-500/20 shadow-sm`}>
                            <card.icon className={`h-5 w-5 ${card.color}`} strokeWidth={2.5} />
                        </div>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 relative z-10">
                        <div className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1 drop-shadow-sm">
                            {card.isCurrency ? (
                                <CurrencyDisplay amount={card.value} />
                            ) : (
                                card.value.toLocaleString()
                            )}
                        </div>
                        <div className="mt-4 flex items-center text-xs font-semibold">
                            <span className={`flex items-center ${card.isPositive ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-500 bg-rose-500/10 border-rose-500/20'} px-2.5 py-1 rounded-full border`}>
                                {card.isPositive ? (
                                    <TrendingUp className="mr-1 h-3.5 w-3.5" strokeWidth={2.5} />
                                ) : (
                                    <TrendingDown className="mr-1 h-3.5 w-3.5" strokeWidth={2.5} />
                                )}
                                {card.insight}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
