import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ProfileContent } from "@/components/dashboard/profile-content"
import { createClient } from "@/utils/supabase/server"
import { SeedButton } from "@/components/dashboard/seed-button"
import { ResetButton } from "@/components/dashboard/reset-button"

export default async function ProfilePage() {
    const supabase = await createClient()

    // 1. Fetch user gracefully to feed initial data
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null // Middleware will bounce them anyway
    }

    // 2. Fetch user role from profiles table
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const role = profile?.role || 'free'

    const name = user.user_metadata?.full_name || user.user_metadata?.name || "Usuario"
    const initials = name !== "Usuario" ? name.substring(0, 2).toUpperCase() : "US"

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <DashboardSidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <DashboardHeader />

                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="mx-auto flex max-w-4xl flex-col gap-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
                            <p className="text-muted-foreground mt-1">
                                Gestioná la configuración de tu cuenta y preferencias
                            </p>
                        </div>

                        <ProfileContent
                            user={{
                                id: user.id,
                                email: user.email || "",
                                name,
                                initials,
                                role,
                            }}
                        />

                        {/* Zona de Desarrollador */}
                        <div className="mt-8 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/10 p-6">
                            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Zona de Desarrollador</h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                Llená tu cuenta con datos ficticios para explorar todas las métricas del dashboard. Recomendado para demostraciones. O inicialo desde cero.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <SeedButton />
                                <ResetButton />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
