"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DatabaseZap } from "lucide-react"
import { seedDemoData } from "@/actions/seed"
import { toast } from "sonner"

export function SeedButton() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSeed = async () => {
        setIsLoading(true)
        const toastId = toast.loading("Poblando el Dashboard...")
        try {
            await seedDemoData()
            toast.success("Dashboard poblado con éxito", { id: toastId })
        } catch (error: any) {
            toast.error(error.message || "Error al cargar datos", { id: toastId })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            onClick={handleSeed}
            disabled={isLoading}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
            <DatabaseZap className="mr-2 h-4 w-4" />
            Cargar Datos de Demo
        </Button>
    )
}
