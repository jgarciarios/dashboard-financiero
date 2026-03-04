"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface Transaction {
    id: string
    date: string
    description: string
    category: string
    type: string
    amount: number
}

interface ExportCSVButtonProps {
    transactions: Transaction[]
}

export function ExportCSVButton({ transactions }: ExportCSVButtonProps) {
    const handleExport = () => {
        if (!transactions || transactions.length === 0) {
            alert("No hay transacciones para exportar.")
            return
        }

        // 1. Create CSV headers
        const headers = ["Fecha", "Descripción", "Categoría", "Tipo", "Monto"]

        // 2. Convert each transaction to a CSV row string
        const csvRows = transactions.map(tx => {
            // Escape possible commas or quotes in string fields
            const safeDescription = `"${tx.description.replace(/"/g, '""')}"`
            const safeCategory = `"${tx.category.replace(/"/g, '""')}"`

            return [
                tx.date,
                safeDescription,
                safeCategory,
                tx.type,
                tx.amount
            ].join(",")
        })

        // 3. Combine headers and rows
        const csvContent = [headers.join(","), ...csvRows].join("\n")

        // 4. Create a Blob from the CSV string, defining the correct MIME type
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

        // 5. Generate a temporary URL for the Blob
        const url = URL.createObjectURL(blob)

        // 6. Create a temporary anchor element to trigger the download
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", "transacciones.csv")

        // 7. Append link to body, trigger click, and clean up
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Free up the URL memory
        URL.revokeObjectURL(url)
    }

    return (
        <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
        </Button>
    )
}
