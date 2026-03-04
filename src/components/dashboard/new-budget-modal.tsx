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
import { createBudget } from "@/app/dashboard/presupuestos/actions"
import { Loader2, Plus } from "lucide-react"

export function NewBudgetModal() {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        setError(null)

        try {
            await createBudget(formData)
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
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Crear Presupuesto
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Nuevo Presupuesto</DialogTitle>
                        <DialogDescription>
                            Define un límite de gasto mensual para una categoría específica.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {error && (
                            <div className="text-sm font-medium text-red-500">{error}</div>
                        )}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                                Categoría
                            </Label>
                            <div className="col-span-3">
                                <Select name="category" required defaultValue="Software">
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
                            <Label htmlFor="amount_limit" className="text-right">
                                Límite Mensual
                            </Label>
                            <Input
                                id="amount_limit"
                                name="amount_limit"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="col-span-3"
                                required
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
                                "Crear Presupuesto"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
