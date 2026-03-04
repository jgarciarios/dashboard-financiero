"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createTransaction } from "@/app/dashboard/transacciones/actions"
import { Loader2 } from "lucide-react"

export function NewTransactionModal() {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        setError(null)

        try {
            await createTransaction(formData)
            setOpen(false) // Close modal on success
        } catch (e: any) {
            setError(e.message || "Ocurrió un error inesperado")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>+ Nueva Transacción</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Nueva Transacción</DialogTitle>
                        <DialogDescription>
                            Añade los detalles de tu nueva transacción aquí. Haz clic en guardar cuando termines.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {error && (
                            <div className="text-sm font-medium text-red-500">{error}</div>
                        )}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Descripción
                            </Label>
                            <Input
                                id="description"
                                name="description"
                                placeholder="Ej: Pago de alquiler"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Monto
                            </Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Tipo
                            </Label>
                            <div className="col-span-3">
                                <Select name="type" required defaultValue="Gasto">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ingreso">Ingreso</SelectItem>
                                        <SelectItem value="Gasto">Gasto</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                                Categoría
                            </Label>
                            <div className="col-span-3">
                                <Select name="category" required defaultValue="Otros">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una categoría" />
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
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                                Fecha
                            </Label>
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                className="col-span-3"
                                required
                                defaultValue={new Date().toISOString().split("T")[0]}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Guardar cambios"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
