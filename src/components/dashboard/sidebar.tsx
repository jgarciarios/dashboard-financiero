"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    ArrowRightLeft,
    PieChart,
    Wallet,
    Settings,
    HelpCircle,
    LogOut,
    TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

const mainNav = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Transacciones", href: "/transacciones", icon: ArrowRightLeft },
    { label: "Presupuestos", href: "/presupuestos", icon: PieChart },
    { label: "Inversiones", href: "/inversiones", icon: TrendingUp },
    { label: "Billetera", href: "/billetera", icon: Wallet },
]

const bottomNav = [
    { label: "Configuración", href: "/configuracion", icon: Settings },
    { label: "Ayuda", href: "/ayuda", icon: HelpCircle },
]

export function DashboardSidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden w-64 flex-col border-r bg-card lg:flex">
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 px-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <TrendingUp className="h-4 w-4 text-primary-foreground" />
                </div>
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
                    >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                    </Button>
                </nav>
            </div>
        </aside>
    )
}
