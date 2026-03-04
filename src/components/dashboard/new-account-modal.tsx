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
import { createAccount } from "@/app/dashboard/billetera/actions"
import { Loader2, Plus } from "lucide-react"

export function NewAccountModal() {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        setError(null)

        try {
            await createAccount(formData)
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
                    <Plus className="mr-2 h-4 w-4" /> Nueva Cuenta
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Añadir Nueva Cuenta</DialogTitle>
                        <DialogDescription>
                            Registra una nueva cuenta bancaria, efectivo o tarjeta para llevar tu control.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {error && (
                            <div className="text-sm font-medium text-red-500">{error}</div>
                        )}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nombre
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Ej: Santander, Mercado Pago"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Tipo
                            </Label>
                            <div className="col-span-3">
                                <Select name="type" required defaultValue="Banco">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Banco">Banco</SelectItem>
                                        <SelectItem value="Efectivo">Efectivo</SelectItem>
                                        <SelectItem value="Tarjeta de Crédito">Tarjeta de Crédito</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="balance" className="text-right">
                                Saldo Inicial
                            </Label>
                            <Input
                                id="balance"
                                name="balance"
                                type="number"
                                step="0.01"
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
                                "Guardar Cuenta"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
