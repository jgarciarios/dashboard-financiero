"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTransactionStore } from "@/store/transactions-store"

export function TransactionForm() {
    const addTransaction = useTransactionStore((s) => s.addTransaction)

    const [type, setType] = useState("gasto")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState(new Date().toISOString().split("T")[0])
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit() {
        if (!amount || !category || !description) return

        setSubmitting(true)
        const success = await addTransaction({
            id: crypto.randomUUID(),
            fecha: date,
            concepto: description,
            monto: parseFloat(amount),
            tipo: type === "ingreso" ? "ingreso" : "egreso",
            estado: "completada",
            categoria:
                category.charAt(0).toUpperCase() + category.slice(1),
        })
        setSubmitting(false)

        if (!success) return

        // Reset form
        setAmount("")
        setCategory("")
        setDescription("")
        setType("gasto")
        setDate(new Date().toISOString().split("T")[0])
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold">
                    Nueva Transacción
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {/* Tipo */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger id="type">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ingreso">Ingreso</SelectItem>
                            <SelectItem value="gasto">Gasto</SelectItem>
                            <SelectItem value="transferencia">Transferencia</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Monto */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="amount">Monto</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            $
                        </span>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            className="pl-7"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </div>

                {/* Categoría */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="alimentacion">Alimentación</SelectItem>
                            <SelectItem value="transporte">Transporte</SelectItem>
                            <SelectItem value="entretenimiento">Entretenimiento</SelectItem>
                            <SelectItem value="servicios">Servicios</SelectItem>
                            <SelectItem value="salario">Salario</SelectItem>
                            <SelectItem value="freelance">Freelance</SelectItem>
                            <SelectItem value="otros">Otros</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Descripción */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Input
                        id="description"
                        placeholder="Ej: Supermercado"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Fecha */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <Button className="mt-2 w-full gap-2" onClick={handleSubmit} disabled={submitting}>
                    <Plus className="h-4 w-4" />
                    {submitting ? "Guardando…" : "Agregar Transacción"}
                </Button>
            </CardContent>
        </Card>
    )
}
