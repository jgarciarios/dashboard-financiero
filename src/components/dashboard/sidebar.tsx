"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import {
    LayoutDashboard,
    ArrowRightLeft,
    PieChart,
    Wallet,
    Settings,
    HelpCircle,
    LogOut,
    TrendingUp,
    Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Logo } from "@/components/ui/logo"
import { logout } from "@/app/login/actions"

export const mainNav = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Transacciones", href: "/dashboard/transacciones", icon: ArrowRightLeft },
    { label: "Presupuestos", href: "/dashboard/presupuestos", icon: PieChart },
    { label: "Inversiones", href: "/dashboard/inversiones", icon: TrendingUp },
    { label: "Billetera", href: "/dashboard/billetera", icon: Wallet },
]

export const bottomNav = [
    { label: "Configuración", href: "/dashboard/configuracion", icon: Settings },
    { label: "Ayuda", href: "/dashboard/ayuda", icon: HelpCircle },
]

export function DashboardSidebar() {
    const pathname = usePathname()
    const [role, setRole] = useState<string | null>(null)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        async function fetchRole() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", user.id)
                    .single()

                if (profile) {
                    setRole(profile.role)
                }
            }
        }
        fetchRole()
    }, [supabase])

    async function handleLogout() {
        setIsLoggingOut(true)
        await logout()
    }

    return (
        <aside className="hidden w-64 flex-col border-r bg-card md:flex print:hidden">
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 px-6">
                <Logo className="h-8 w-8 drop-shadow-sm" />
                <span className="text-lg font-bold tracking-tight">FinanzApp</span>
            </div>

            <Separator />

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-4">
                <nav className="flex flex-col gap-1">
                    {mainNav.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3",
                                        isActive && "font-semibold"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Button>
                            </Link>
                        )
                    })}

                    {role === "admin" && (
                        <>
                            <Separator className="my-2" />
                            <Link href="/dashboard/admin">
                                <Button
                                    variant={pathname === "/dashboard/admin" ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3",
                                        pathname === "/dashboard/admin" && "font-semibold"
                                    )}
                                >
                                    <Shield className="h-4 w-4" />
                                    Panel Admin
                                </Button>
                            </Link>
                        </>
                    )}
                </nav>
            </ScrollArea>

            {/* Bottom section */}
            <div className="px-3 pb-4">
                <Separator className="mb-4" />
                <nav className="flex flex-col gap-1">
                    {bottomNav.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <Button variant="ghost" className="w-full justify-start gap-3">
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Button>
                        </Link>
                    ))}
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-destructive hover:text-destructive"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        <LogOut className="h-4 w-4" />
                        {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
                    </Button>
                </nav>
            </div>
        </aside>
    )
}
