"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { resetDemoData } from "@/actions/seed"
import { toast } from "sonner"

export function ResetButton() {
    const [isLoading, setIsLoading] = useState(false)

    const handleReset = async () => {
        setIsLoading(true)
        const toastId = toast.loading("Eliminando datos...")
        try {
            await resetDemoData()
            toast.success("Datos eliminados correctamente", { id: toastId })
        } catch (error: any) {
            toast.error(error.message || "Error al limpiar datos", { id: toastId })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            onClick={handleReset}
            disabled={isLoading}
            variant="destructive"
        >
            <Trash2 className="mr-2 h-4 w-4" />
            Limpiar Dashboard
        </Button>
    )
}
