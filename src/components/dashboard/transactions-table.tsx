"use client"

import { useEffect, useMemo, useState } from "react"
import {
    ArrowDownLeft,
    ArrowUpRight,
    MoreHorizontal,
    Loader2,
    Trash2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useTransactionStore } from "@/store/transactions-store"

export function TransactionsTable() {
    const transactions = useTransactionStore((s) => s.transactions)
    const loading = useTransactionStore((s) => s.loading)
    const error = useTransactionStore((s) => s.error)
    const fetchTransactions = useTransactionStore((s) => s.fetchTransactions)
    const deleteTransaction = useTransactionStore((s) => s.deleteTransaction)

    const [deletingId, setDeletingId] = useState<string | null>(null)

    useEffect(() => {
        fetchTransactions()
    }, [fetchTransactions])

    const sorted = useMemo(
        () =>
            [...transactions].sort(
                (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
            ),
        [transactions]
    )

    function formatAmount(tx: (typeof sorted)[number]) {
        const sign = tx.tipo === "ingreso" ? "+" : "-"
        return `${sign}$${tx.monto.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`
    }

    function formatDate(iso: string) {
        const d = new Date(iso + "T12:00:00") // avoid timezone shift
        return d.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    }

    async function handleDelete(id: string) {
        setDeletingId(id)
        await deleteTransaction(id)
        setDeletingId(null)
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold">
                    Últimas Transacciones
                </CardTitle>
                <Button variant="outline" size="sm">
                    Ver todas
                </Button>
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Cargando transacciones…
                    </div>
                )}
                {error && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                        Error al cargar transacciones: {error}
                    </div>
                )}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Descripción</TableHead>
                            <TableHead className="hidden sm:table-cell">Categoría</TableHead>
                            <TableHead className="hidden md:table-cell">Fecha</TableHead>
                            <TableHead className="hidden sm:table-cell">Estado</TableHead>
                            <TableHead className="text-right">Monto</TableHead>
                            <TableHead className="w-12 text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sorted.map((tx) => (
                            <TableRow key={tx.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-full ${tx.tipo === "ingreso"
                                                ? "bg-emerald-500/10 text-emerald-500"
                                                : "bg-red-500/10 text-red-500"
                                                }`}
                                        >
                                            {tx.tipo === "ingreso" ? (
                                                <ArrowDownLeft className="h-4 w-4" />
                                            ) : (
                                                <ArrowUpRight className="h-4 w-4" />
                                            )}
                                        </div>
                                        <span className="font-medium">{tx.concepto}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Badge variant="secondary" className="font-normal">
                                        {tx.categoria}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden text-muted-foreground md:table-cell">
                                    {formatDate(tx.fecha)}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Badge
                                        variant={tx.estado === "completada" ? "default" : "outline"}
                                        className="font-normal"
                                    >
                                        {tx.estado === "completada" ? "Completada" : "Pendiente"}
                                    </Badge>
                                </TableCell>
                                <TableCell
                                    className={`text-right font-semibold ${tx.tipo === "ingreso"
                                        ? "text-emerald-500"
                                        : "text-red-500"
                                        }`}
                                >
                                    {formatAmount(tx)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                        onClick={() => handleDelete(tx.id)}
                                        disabled={deletingId === tx.id}
                                    >
                                        {deletingId === tx.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">Eliminar</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
