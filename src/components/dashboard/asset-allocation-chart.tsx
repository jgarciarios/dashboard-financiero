"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCurrencyStore } from "@/store/currency-store"

interface AssetAllocationChartProps {
    accounts: any[]
    investments: any[]
}

const COLORS = ['#f97316', '#3b82f6', '#06b6d4'] // Naranja, Azul, Cian

export function AssetAllocationChart({ accounts, investments }: AssetAllocationChartProps) {
    const { currency, mepRate } = useCurrencyStore()

    const chartData = useMemo(() => {
        let efectivo = 0
        let bancos = 0
        let invertido = 0

        // Agrupar cuentas (Ignorar pasivos/tarjetas para la torta de activos brutos)
        accounts.forEach((acc) => {
            const balance = Number(acc.balance) || 0
            if (balance > 0) {
                if (acc.type === "Efectivo" || acc.type === "Billetera Virtual") {
                    efectivo += balance
                } else if (acc.type === "Banco") {
                    bancos += balance
                }
            }
        })

        // Agrupar inversiones
        investments.forEach((inv) => {
            const value = Number(inv.current_value) || 0
            if (value > 0) {
                invertido += value
            }
        })

        let data = [
            { name: "Efectivo y Billeteras", value: efectivo },
            { name: "Cuentas Bancarias", value: bancos },
            { name: "Inversiones", value: invertido },
        ].filter(item => item.value > 0) // No dibujar porciones vacías

        // Convertir a USD si corresponde
        if (currency === 'USD' && mepRate) {
            data = data.map(item => ({
                name: item.name,
                value: item.value / mepRate
            }))
        }

        return data
    }, [accounts, investments, currency, mepRate])

    const totalAssets = chartData.reduce((sum, item) => sum + item.value, 0)

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            const percentage = totalAssets > 0 ? ((data.value / totalAssets) * 100).toFixed(1) : 0

            return (
                <div className="bg-background border border-border rounded-lg shadow-md p-3 text-sm">
                    <p className="font-semibold mb-1 text-foreground">{data.name}</p>
                    <div className="flex justify-between items-center gap-4">
                        <span className="text-muted-foreground mr-2">Valor:</span>
                        <span className="font-medium">
                            {currency === 'USD' ? 'USD ' : '$'}
                            {data.value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div className="flex justify-between items-center gap-4 mt-1">
                        <span className="text-muted-foreground mr-2">Del total:</span>
                        <span className="font-medium">{percentage}%</span>
                    </div>
                </div>
            )
        }
        return null
    }

    if (chartData.length === 0) {
        return (
            <Card className="flex flex-col h-full min-h-[400px]">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Asignación de Activos</CardTitle>
                    <CardDescription>Distribución de tu capital</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                    <div className="text-muted-foreground text-sm text-center">
                        No hay activos registrados para graficar
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="flex flex-col h-full min-h-[400px]">
            <CardHeader className="pb-0">
                <CardTitle className="text-base font-semibold">Asignación de Activos</CardTitle>
                <CardDescription>Distribución de capital</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={110}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
