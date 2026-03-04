import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { NewTransactionModal } from "@/components/dashboard/new-transaction-modal"
import { ExportCSVButton } from "@/components/dashboard/export-csv-button"
import { ExportPDFButton } from "@/components/dashboard/export-pdf-button"
import { createClient } from "@/utils/supabase/server"

export default async function TransaccionesPage() {
    const supabase = await createClient()

    // 1. Get user
    const { data: { user } } = await supabase.auth.getUser()

    // 2. Fetch role
    let role = 'free'
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
        if (profile) role = profile.role
    }

    const { data: transactions } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false })

    const displayTransactions = transactions || []
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <DashboardSidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <DashboardHeader />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mx-auto flex max-w-7xl flex-col gap-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                            <h1 className="text-3xl font-bold tracking-tight">Historial de Transacciones</h1>
                            <div className="flex items-center space-x-2 w-full sm:w-auto">
                                <ExportPDFButton transactions={displayTransactions} role={role} />
                                <ExportCSVButton transactions={displayTransactions} />
                                <NewTransactionModal />
                            </div>
                        </div>

                        <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Descripción</TableHead>
                                        <TableHead>Categoría</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead className="text-right">Monto</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {displayTransactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                                No hay transacciones todavía. Crea una para comenzar.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        displayTransactions.map((tx) => (
                                            <TableRow key={tx.id}>
                                                <TableCell className="font-medium">{tx.date}</TableCell>
                                                <TableCell>{tx.description}</TableCell>
                                                <TableCell>{tx.category}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={tx.type === "Ingreso" ? "default" : "destructive"}
                                                        className={tx.type === "Ingreso" ? "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-400" : "bg-red-500/15 text-red-700 hover:bg-red-500/25 dark:text-red-400"}
                                                    >
                                                        {tx.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {tx.type === "Ingreso" ? "+" : "-"}${tx.amount.toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
