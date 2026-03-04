"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const MONTHS = [
    { value: "01", label: "Enero" },
    { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" },
    { value: "06", label: "Junio" },
    { value: "07", label: "Julio" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
]

const YEARS = ["2025", "2026", "2027"]

export function MonthYearFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Default to current month/year if not in URL
    const today = new Date()
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0")
    const currentYear = today.getFullYear().toString()

    const monthParam = searchParams.get("mes") || currentMonth
    const yearParam = searchParams.get("anio") || currentYear

    const updateFilter = (type: "mes" | "anio", value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(type, value)
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-2 print:hidden">
            <Select value={monthParam} onValueChange={(val) => updateFilter("mes", val)}>
                <SelectTrigger className="w-[130px] bg-background">
                    <SelectValue placeholder="Mes" />
                </SelectTrigger>
                <SelectContent>
                    {MONTHS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={yearParam} onValueChange={(val) => updateFilter("anio", val)}>
                <SelectTrigger className="w-[100px] bg-background">
                    <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                    {YEARS.map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
