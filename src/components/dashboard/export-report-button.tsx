"use client"

import { FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ExportReportButton() {
    return (
        <Button
            onClick={() => window.print()}
            className="gap-2 print:hidden"
            variant="outline"
        >
            <FileDown className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar Informe</span>
        </Button>
    )
}
