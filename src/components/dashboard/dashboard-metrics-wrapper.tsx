"use client"

import { useState, useMemo } from "react"
import { SummaryCards } from "./summary-cards"
import { FinancialChart } from "./financial-chart"
import { Button } from "@/components/ui/button"

interface Transaction {
    id: string
    description: string
    category: string
    date: string
    type: string
    amount: number
}

interface DashboardMetricsWrapperProps {
    transactions: Transaction[]
    patrimonioNeto: number
}

export function DashboardMetricsWrapper({ transactions, patrimonioNeto }: DashboardMetricsWrapperProps) {
    const [timeFilter, setTimeFilter] = useState<'6M' | '1A' | 'Todo'>('Todo')

    // 1. Filtrar transacciones según el rango de tiempo seleccionado
    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            if (timeFilter === 'Todo') return true
            
            const txDate = new Date(tx.date)
            if (isNaN(txDate.getTime())) return false

            if (timeFilter === '6M') {
                return txDate >= new Date(new Date().setMonth(new Date().getMonth() - 6))
            }
            if (timeFilter === '1A') {
                return txDate >= new Date(new Date().setFullYear(new Date().getFullYear() - 1))
            }
            return true
        })
    }, [transactions, timeFilter])

    // Función de Variación Porcentual (MoM)
    const calculateTrend = (current: number, previous: number) => {
        if (previous === 0) {
            if (current === 0) return 0
            return current > 0 ? 100 : -100
        }
        const trend = ((current - previous) / Math.abs(previous)) * 100
        return Number(trend.toFixed(1))
    }

    // 2. Recalcular las métricas clave (MRR, Retainers, etc.)
    const metrics = useMemo(() => {
        let ingresos = 0
        let gastos = 0
        let retainersCount = 0

        filteredTransactions.forEach((tx) => {
            const amount = Number(tx.amount) || 0
            if (tx.type === "Ingreso" || tx.type === "ingreso") {
                ingresos += amount
                retainersCount++
            } else {
                gastos += amount
            }
        })

        const mrr = ingresos
        const retainers = retainersCount > 0 ? retainersCount : 0
        const ticketPromedio = retainers > 0 ? mrr / retainers : 0
        const rentabilidad = mrr - gastos

        // Separar transactions en 'Periodo Actual' y 'Periodo Anterior'
        let currentIngresos = 0
        let currentGastos = 0
        let currentRetainers = 0

        let previousIngresos = 0
        let previousGastos = 0
        let previousRetainers = 0

        const now = new Date()
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

        transactions.forEach((tx) => {
            const txDate = new Date(tx.date)
            if (isNaN(txDate.getTime())) return

            const amount = Number(tx.amount) || 0
            if (txDate >= thirtyDaysAgo && txDate <= now) {
                if (tx.type === "Ingreso" || tx.type === "ingreso") {
                    currentIngresos += amount
                    currentRetainers++
                } else {
                    currentGastos += amount
                }
            } else if (txDate >= sixtyDaysAgo && txDate < thirtyDaysAgo) {
                if (tx.type === "Ingreso" || tx.type === "ingreso") {
                    previousIngresos += amount
                    previousRetainers++
                } else {
                    previousGastos += amount
                }
            }
        })

        const currentMrr = currentIngresos
        const previousMrr = previousIngresos
        
        const currentRentabilidad = currentIngresos - currentGastos
        const previousRentabilidad = previousIngresos - previousGastos
        
        const currentTicket = currentRetainers > 0 ? currentMrr / currentRetainers : 0
        const previousTicket = previousRetainers > 0 ? previousMrr / previousRetainers : 0

        return {
            mrr,
            retainers,
            ticketPromedio,
            rentabilidad,
            trends: {
                mrr: calculateTrend(currentMrr, previousMrr),
                retainers: calculateTrend(currentRetainers, previousRetainers),
                ticketPromedio: calculateTrend(currentTicket, previousTicket),
                rentabilidad: calculateTrend(currentRentabilidad, previousRentabilidad)
            }
        }
    }, [filteredTransactions, transactions])

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Controles de Filtro de Tiempo para todo el Dashboard */}
            <div className="flex items-center justify-end gap-2 print:hidden w-full">
                <Button 
                    variant={timeFilter === '6M' ? "secondary" : "outline"} 
                    size="sm" 
                    className="text-xs"
                    onClick={() => setTimeFilter('6M')}
                >
                    Últimos 6M
                </Button>
                <Button 
                    variant={timeFilter === '1A' ? "secondary" : "outline"} 
                    size="sm" 
                    className="text-xs"
                    onClick={() => setTimeFilter('1A')}
                >
                    Último 1A
                </Button>
                <Button 
                    variant={timeFilter === 'Todo' ? "secondary" : "outline"} 
                    size="sm" 
                    className="text-xs"
                    onClick={() => setTimeFilter('Todo')}
                >
                    Todo
                </Button>
            </div>

            {/* Tarjetas de Métricas Dinámicas */}
            <SummaryCards
                mrr={metrics.mrr}
                mrrTrend={metrics.trends.mrr}
                retainers={metrics.retainers}
                retainersTrend={metrics.trends.retainers}
                ticketPromedio={metrics.ticketPromedio}
                ticketPromedioTrend={metrics.trends.ticketPromedio}
                rentabilidad={metrics.rentabilidad}
                rentabilidadTrend={metrics.trends.rentabilidad}
            />

            {/* Gráfico (ahora solo recibe la data filtrada) */}
            <FinancialChart transactions={filteredTransactions} />
        </div>
    )
}
