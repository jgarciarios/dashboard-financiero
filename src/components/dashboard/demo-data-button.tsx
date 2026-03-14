"use client"

import { useState } from "react"
import { Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { injectDemoData } from "@/actions/inject-demo-data"
import { useRouter } from "next/navigation"

export function DemoDataButton() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleInjectData = async () => {
        setIsLoading(true)
        const toastId = toast.loading("Inyectando demo data...")
        try {
            await injectDemoData()
            toast.success("¡Demo Data cargada! Se han inyectado transacciones de prueba.", { id: toastId })
            router.refresh()
        } catch (error: any) {
            console.error("Error inyectando datos:", error)
            toast.error(error.message || "Error al inyectar datos", { id: toastId })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button 
            variant="outline" 
            size="sm" 
            className="text-xs border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors pointer-events-auto"
            onClick={handleInjectData}
            disabled={isLoading}
        >
            <Wand2 className={`mr-2 h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? "Cargando..." : "Cargar Demo Data"}
        </Button>
    )
}
