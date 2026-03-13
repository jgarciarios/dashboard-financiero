"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import jsPDF from "jspdf"
import { toPng } from "html-to-image"

export function ExportPDFButton() {
    const [isLoading, setIsLoading] = useState(false)

    const handleExport = async () => {
        setIsLoading(true)

        try {
            // Buscamos el reporte o el main entero si no lo encuentra
            const element = document.getElementById("dashboard-report") || document.querySelector("main")

            if (!element) {
                console.error("No se encontró el contenedor del dashboard")
                return
            }

            // Sacamos la foto con la nueva cámara
            const imgData = await toPng(element as HTMLElement, {
                backgroundColor: "#09090b", // Fondo oscuro corporativo
                pixelRatio: 2, // Alta calidad
                filter: (node) => {
                    // Verificamos si es un elemento HTML (nodeType === 1)
                    if (node.nodeType === 1) {
                        const htmlNode = node as HTMLElement
                        // Retornamos false si tiene la clase o el atributo para ignorarlos
                        if (
                            htmlNode.classList?.contains("print:hidden") ||
                            htmlNode.hasAttribute("data-html2canvas-ignore")
                        ) {
                            return false
                        }
                    }
                    // En caso contrario, lo incluimos
                    return true
                }
            })

            // Armamos el PDF A4
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            })

            const pdfWidth = pdf.internal.pageSize.getWidth()
            const htmlElement = element as HTMLElement
            // Calculamos la proporción perfecta para que no se estire
            const pdfHeight = (htmlElement.offsetHeight * pdfWidth) / htmlElement.offsetWidth

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
            pdf.save("Balance-Rentabilidad-Agencia.pdf")

        } catch (error) {
            console.error("Error al exportar el PDF:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            onClick={handleExport}
            disabled={isLoading}
            className="border-cyan-500/30 hover:bg-cyan-500/10"
        >
            <Download className="mr-2 h-4 w-4" />
            {isLoading ? "Generando..." : "Descargar Balance (PDF)"}
        </Button>
    )
}