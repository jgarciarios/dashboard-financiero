"use client"

import { Button } from "@/components/ui/button"
import { Download, Lock } from "lucide-react"
import { toast } from "sonner"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Transaction {
    id: string
    description: string
    category: string
    date: string
    type: string
    amount: number
}

interface ExportPDFButtonProps {
    transactions: Transaction[]
    role: string
}

export function ExportPDFButton({ transactions, role }: ExportPDFButtonProps) {
    const isPremium = role === 'pro' || role === 'admin'

    const handleExport = () => {
        if (!isPremium) {
            toast.info('Mejorá a Premium para descargar reportes PDF', {
                description: 'Accedé a herramientas avanzadas para tu negocio.'
            })
            return
        }

        if (transactions.length === 0) {
            toast.error('No hay transacciones para exportar')
            return
        }

        try {
            const doc = new jsPDF()

            // Elegante Título
            doc.setFontSize(20)
            doc.setTextColor(15, 23, 42) // Slate 900
            doc.text("FinanzApp - Reporte de Transacciones", 14, 22)

            // Subtítulo / Fecha
            doc.setFontSize(11)
            doc.setTextColor(100, 116, 139) // Slate 500
            const dateStr = new Date().toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
            doc.text(`Generado el: ${dateStr}`, 14, 30)

            // Tabla
            const tableColumn = ["Fecha", "Descripción", "Categoría", "Monto", "Tipo"]
            const tableRows = transactions.map(tx => [
                new Date(tx.date + "T12:00:00").toLocaleDateString('es-AR'),
                tx.description,
                tx.category,
                `$${tx.amount.toFixed(2)}`,
                tx.type
            ])

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                styles: { fontSize: 9, cellPadding: 4 },
                headStyles: { fillColor: [14, 165, 233], textColor: 255 }, // Cyan 500
                alternateRowStyles: { fillColor: [248, 250, 252] }, // Slate 50
                margin: { top: 40 }
            })

            doc.save("finanzapp-reporte.pdf")
            toast.success("PDF generado exitosamente")
        } catch (error) {
            console.error("Error generating PDF", error)
            toast.error("Ocurrió un error al generar el PDF")
        }
    }

    if (!isPremium) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" onClick={handleExport} className="gap-2 border-dashed border-cyan-500/50 text-cyan-700 hover:text-cyan-800 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:text-cyan-300 dark:hover:bg-cyan-950/30">
                            <Lock className="h-4 w-4" />
                            <span className="hidden sm:inline">Exportar a PDF</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Solo disponible en Plan Premium</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return (
        <Button onClick={handleExport} className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar a PDF</span>
        </Button>
    )
}
