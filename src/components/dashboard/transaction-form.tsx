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
import { createTransaction } from "@/app/dashboard/transacciones/actions"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export function TransactionForm() {
    const [type, setType] = useState("Gasto")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState(new Date().toISOString().split("T")[0])
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleAction(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!amount || !category || !description) return

        setSubmitting(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append("description", description)
            formData.append("amount", amount)
            formData.append("type", type === "Ingreso" || type === "ingreso" || type === "ingresos" ? "Ingreso" : "Gasto")
            // Make sure category has an uppercase first letter to match Enum conventions earlier
            formData.append("category", category.charAt(0).toUpperCase() + category.slice(1))
            formData.append("date", date)

            await createTransaction(formData)

            // Reset form
            setAmount("")
            setCategory("")
            setDescription("")
            setType("Gasto")
            setDate(new Date().toISOString().split("T")[0])

            toast.success("Transacción agregada con éxito")
        } catch (err: any) {
            const errorMessage = err.message || "Ocurrió un error guardando la transacción."
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Card>
            <form onSubmit={handleAction}>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">
                        Nueva Transacción
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {error && (
                        <div className="text-sm font-medium text-red-500">{error}</div>
                    )}
                    {/* Tipo */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="type">Tipo</Label>
                        <Select value={type} onValueChange={setType} name="type" required>
                            <SelectTrigger id="type">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Ingreso">Ingreso</SelectItem>
                                <SelectItem value="Gasto">Gasto</SelectItem>
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
                                name="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="pl-7"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Categoría */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="category">Categoría</Label>
                        <Select value={category} onValueChange={setCategory} name="category" required>
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Ventas">Ventas</SelectItem>
                                <SelectItem value="Software">Software</SelectItem>
                                <SelectItem value="Marketing">Marketing</SelectItem>
                                <SelectItem value="Comida">Comida</SelectItem>
                                <SelectItem value="Salario">Salario</SelectItem>
                                <SelectItem value="Otros">Otros</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Descripción */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Input
                            id="description"
                            name="description"
                            placeholder="Ej: Pago de alquiler"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    {/* Fecha */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="date">Fecha</Label>
                        <Input
                            id="date"
                            name="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="mt-2 w-full gap-2" disabled={submitting}>
                        {submitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Guardando…
                            </>
                        ) : (
                            <>
                                <Plus className="h-4 w-4" />
                                Agregar Transacción
                            </>
                        )}
                    </Button>
                </CardContent>
            </form>
        </Card>
    )
}
