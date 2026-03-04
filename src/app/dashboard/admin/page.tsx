import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Star, UserPlus } from "lucide-react"
import { UsersTable } from "./users-table"

export const metadata = {
    title: "Panel de Administración | FinanzApp",
    description: "Gestión de usuarios y métricas de la plataforma",
}

export default async function AdminPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Verificar rol del usuario actual
    const { data: currentUserProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

    if (!currentUserProfile || currentUserProfile.role !== "admin") {
        redirect("/dashboard")
    }

    // Fetch de todos los usuarios
    const { data: profiles } = await supabase
        .from("profiles")
        .select("id, role, created_at")
        .order("created_at", { ascending: false })

    const allProfiles = profiles || []

    // KPIs
    const totalUsers = allProfiles.length
    const premiumUsers = allProfiles.filter(p => p.role === "pro").length

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const newUsersThisMonth = allProfiles.filter(p => {
        const date = new Date(p.created_at)
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    }).length

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Panel de Administración</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total de Usuarios
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Usuarios Premium
                        </CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{premiumUsers}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Nuevos este mes
                        </CardTitle>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{newUsersThisMonth}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Usuarios Registrados</CardTitle>
                </CardHeader>
                <CardContent>
                    <UsersTable users={allProfiles} />
                </CardContent>
            </Card>
        </div>
    )
}
