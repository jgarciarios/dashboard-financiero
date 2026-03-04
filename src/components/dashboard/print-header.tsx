"use client"

import { Logo } from "@/components/ui/logo"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function PrintHeader() {
    const today = format(new Date(), "dd 'de' MMMM, yyyy", { locale: es })

    return (
        <div className="hidden print:flex flex-col mb-8 pb-4 border-b border-zinc-200 text-black">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Logo className="h-8 w-8 text-[#00D1FF]" />
                    <span className="text-2xl font-bold tracking-tight text-black">FinanzApp</span>
                </div>
                <div className="text-right text-sm text-zinc-500">
                    <p>Fecha de emisión:</p>
                    <p className="font-semibold text-black">{today}</p>
                </div>
            </div>
            <h1 className="text-3xl font-extrabold text-black">Resumen de Salud Financiera</h1>
            <p className="text-zinc-500 mt-1">Reporte consolidado de cuentas, inversiones y flujo de caja.</p>
        </div>
    )
}
