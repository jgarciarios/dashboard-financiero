"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts"
import { useCurrencyStore } from "@/store/currency-store"

interface Transaction {
    id: string
    description: string
    category: string
    date: string
    type: string
    amount: number
}

interface FinancialChartProps {
    transactions: Transaction[]
}

export function FinancialChart({ transactions }: FinancialChartProps) {
    const { currency, mepRate } = useCurrencyStore()

    const chartData = useMemo(() => {
        // Agrupar transacciones por Mes y Año
        const grouped = transactions.reduce((acc, tx) => {
            const date = new Date(tx.date)
            if (isNaN(date.getTime())) return acc

            const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
            const month = monthNames[date.getMonth()]
            const year = date.getFullYear().toString().slice(2)

            const key = `${month} '${year}` // ej: "Ene '26"

            if (!acc[key]) {
                acc[key] = {
                    mes: key,
                    ingresos: 0,
                    gastos: 0,
                    sortKey: date.getFullYear() * 100 + date.getMonth()
                }
            }

            if (tx.type === "Ingreso" || tx.type === "ingreso") {
                acc[key].ingresos += tx.amount
            } else {
                acc[key].gastos += tx.amount
            }

            return acc
        }, {} as Record<string, { mes: string, ingresos: number, gastos: number, sortKey: number }>)

        // Convertir a array y ordenar cronológicamente
        let processedData = Object.values(grouped).sort((a, b) => a.sortKey - b.sortKey).map(({ mes, ingresos, gastos }) => ({ mes, ingresos, gastos }))

        // Aplicar divisas
        if (currency === 'USD' && mepRate) {
            processedData = processedData.map(item => ({
                mes: item.mes,
                ingresos: item.ingresos / mepRate,
                gastos: item.gastos / mepRate
            }))
        }

        return processedData
    }, [transactions, currency, mepRate])

    if (transactions.length === 0) {
        return (
            <Card className="flex flex-col items-center justify-center p-6 h-full min-h-[400px]">
                <div className="text-muted-foreground">No hay datos suficientes para graficar</div>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold">
                    Ingresos vs Gastos
                </CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                        6M
                    </Button>
                    <Button variant="secondary" size="sm" className="text-xs">
                        1A
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                        Todo
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="ingresos" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gastos" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke="hsl(var(--muted-foreground) / 0.2)" strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="mes"
                                className="text-xs font-medium"
                                tick={{ fill: "#888888" }}
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                            />
                            <YAxis
                                className="text-xs font-medium"
                                tick={{ fill: "#888888" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => currency === 'USD' ? `US$${value.toFixed(0)}` : `$${(value / 1000).toFixed(0)}k`}
                                tickMargin={10}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    color: "hsl(var(--foreground))",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
                                }}
                                itemStyle={{ color: "hsl(var(--foreground))", fontWeight: "500" }}
                                labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}
                                formatter={(value: any) => [
                                    `${currency === 'USD' ? 'USD ' : '$'}${Number(value).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                                    ""
                                ]}
                            />
                            <Area
                                type="monotone"
                                dataKey="ingresos"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fill="url(#ingresos)"
                                name="Ingresos"
                            />
                            <Area
                                type="monotone"
                                dataKey="gastos"
                                stroke="#f97316"
                                strokeWidth={2}
                                fill="url(#gastos)"
                                name="Gastos"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500" />
                        <span className="text-muted-foreground">Ingresos</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-orange-500" />
                        <span className="text-muted-foreground">Gastos</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
