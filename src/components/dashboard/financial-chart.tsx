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
import { useTransactionStore } from "@/store/transactions-store"

export function FinancialChart() {
    const { transactions } = useTransactionStore()

    const chartData = useMemo(() => {
        // Agrupar transacciones por Mes y Año
        const grouped = transactions.reduce((acc, tx) => {
            const date = new Date(tx.fecha)
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

            if (tx.tipo === "ingreso") {
                acc[key].ingresos += tx.monto
            } else {
                acc[key].gastos += tx.monto
            }

            return acc
        }, {} as Record<string, { mes: string, ingresos: number, gastos: number, sortKey: number }>)

        // Convertir a array y ordenar cronológicamente
        return Object.values(grouped).sort((a, b) => a.sortKey - b.sortKey).map(({ mes, ingresos, gastos }) => ({ mes, ingresos, gastos }))
    }, [transactions])

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
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="mes"
                                className="text-xs"
                                tick={{ fill: "hsl(var(--muted-foreground))" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                className="text-xs"
                                tick={{ fill: "hsl(var(--muted-foreground))" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                }}
                                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, ""]}
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
