"use client"

import { useState } from "react"
import {
    ArrowDownLeft,
    ArrowUpRight,
    Loader2,
    Trash2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteTransaction } from "@/app/dashboard/transacciones/actions"
import { EditTransactionModal } from "@/components/dashboard/edit-transaction-modal"
import { CurrencyDisplay } from "./currency-display"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
interface Transaction {
    id: string
    description: string
    category: string
    date: string
    type: string
    amount: number
    status?: string
}

interface TransactionsTableProps {
    transactions: Transaction[]
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null)

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
        try {
            await deleteTransaction(id)
        } catch (error) {
            console.error(error)
        } finally {
            setDeletingId(null)
        }
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
                {transactions.length === 0 && (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                        No hay transacciones todavía. Crea una para comenzar.
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
                        {transactions.map((tx) => (
                            <TableRow key={tx.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-full ${tx.type === "Ingreso" || tx.type === "ingreso"
                                                ? "bg-emerald-500/10 text-emerald-500"
                                                : "bg-red-500/10 text-red-500"
                                                }`}
                                        >
                                            {tx.type === "Ingreso" || tx.type === "ingreso" ? (
                                                <ArrowDownLeft className="h-4 w-4" />
                                            ) : (
                                                <ArrowUpRight className="h-4 w-4" />
                                            )}
                                        </div>
                                        <span className="font-medium">{tx.description}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Badge variant="secondary" className="font-normal">
                                        {tx.category}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden text-muted-foreground md:table-cell">
                                    {formatDate(tx.date)}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Badge
                                        variant={tx.status === "completada" ? "default" : "outline"}
                                        className="font-normal"
                                    >
                                        Completada
                                    </Badge>
                                </TableCell>
                                <TableCell
                                    className={`text-right font-semibold ${tx.type === "Ingreso" || tx.type === "ingreso"
                                        ? "text-emerald-500"
                                        : "text-red-500"
                                        }`}
                                >
                                    <CurrencyDisplay amount={tx.type === "Ingreso" || tx.type === "ingreso" ? tx.amount : -tx.amount} showSign />
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <EditTransactionModal transaction={tx} />
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                                    disabled={deletingId === tx.id}
                                                >
                                                    {deletingId === tx.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                    <span className="sr-only">Eliminar</span>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta acción no se puede deshacer. Esto borrará permanentemente la transacción
                                                        "{tx.description}" por <CurrencyDisplay amount={tx.amount} />.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(tx.id)}
                                                        className="bg-red-600 hover:bg-red-700 text-white"
                                                    >
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
