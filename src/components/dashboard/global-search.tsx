"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { useTransactionStore } from "@/store/transactions-store"

export function GlobalSearch() {
    const [open, setOpen] = useState(false)
    const { transactions } = useTransactionStore()
    const router = useRouter()

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const handleSelect = (id: string) => {
        setOpen(false)
        router.push(`/dashboard/transacciones`)
    }

    // Only show the last 20 transactions for quick access
    const recentTransactions = transactions.slice(0, 20)

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-64 lg:w-80"
                onClick={() => setOpen(true)}
            >
                <Search className="mr-2 h-4 w-4" />
                <span className="hidden lg:inline-flex">Buscar transacciones...</span>
                <span className="inline-flex lg:hidden">Buscar...</span>
                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Filtrar por concepto o categoría..." />
                <CommandList>
                    <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                    <CommandGroup heading="Últimas transacciones">
                        {recentTransactions.map((tx) => (
                            <CommandItem
                                key={tx.id}
                                value={`${tx.concepto} ${tx.categoria}`}
                                onSelect={() => handleSelect(tx.id)}
                                className="flex justify-between items-center cursor-pointer"
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium">{tx.concepto}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {tx.categoria} • {new Date(tx.fecha).toLocaleDateString()}
                                    </span>
                                </div>
                                <span className={tx.tipo === "ingreso" ? "text-green-600" : "text-red-600"}>
                                    {tx.tipo === "ingreso" ? "+" : "-"}${tx.monto.toLocaleString()}
                                </span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
