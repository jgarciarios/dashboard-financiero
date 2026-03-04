"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { updateUserRole } from "@/actions/admin"

interface UserProfile {
    id: string;
    role: string;
    created_at: string;
}

export function UsersTable({ users }: { users: UserProfile[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null)

    function getRoleBadge(role: string) {
        if (role === "admin") {
            return (
                <Badge className="bg-red-900 text-red-100 hover:bg-red-900/80 dark:bg-red-900/80 dark:text-red-100">
                    Administrador
                </Badge>
            )
        }
        if (role === "pro") {
            return (
                <Badge className="bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-600 dark:text-white">
                    Plan Premium
                </Badge>
            )
        }
        return (
            <Badge className="bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700">
                Plan Básico
            </Badge>
        )
    }

    function formatDate(isoDate: string) {
        const d = new Date(isoDate)
        return d.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    }

    async function handleRoleChange(userId: string, newRole: 'free' | 'pro' | 'admin') {
        setLoadingId(userId)
        const toastId = toast.loading("Actualizando rol...")

        try {
            await updateUserRole(userId, newRole)
            toast.success("Rol actualizado correctamente", { id: toastId })
        } catch (error: any) {
            toast.error(error.message || "Ocurrió un error al actualizar el rol.", { id: toastId })
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID de Usuario</TableHead>
                    <TableHead>Fecha de Registro</TableHead>
                    <TableHead>Plan/Rol</TableHead>
                    <TableHead className="w-[100px] text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((p) => (
                    <TableRow key={p.id}>
                        <TableCell className="font-medium text-xs text-muted-foreground p-3">
                            {p.id}
                        </TableCell>
                        <TableCell>
                            {formatDate(p.created_at)}
                        </TableCell>
                        <TableCell>
                            {getRoleBadge(p.role)}
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={loadingId === p.id}>
                                        <span className="sr-only">Abrir menú</span>
                                        {loadingId === p.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <MoreHorizontal className="h-4 w-4" />
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => handleRoleChange(p.id, 'pro')}
                                        disabled={p.role === 'pro'}
                                    >
                                        Hacer Premium (Pro)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleRoleChange(p.id, 'free')}
                                        disabled={p.role === 'free'}
                                    >
                                        Hacer Básico (Free)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleRoleChange(p.id, 'admin')}
                                        disabled={p.role === 'admin'}
                                        className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                                    >
                                        Hacer Administrador
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
                {users.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                            No se encontraron usuarios.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}
