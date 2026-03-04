"use client"

import { Bell, Search, Menu, LogOut, Loader2, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { logout } from "@/app/login/actions"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { mainNav, bottomNav } from "./sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GlobalSearch } from "./global-search"
import { ThemeToggle } from "./theme-toggle"
import { CurrencyToggle } from "./currency-toggle"
import { Logo } from "@/components/ui/logo"

export function DashboardHeader() {
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [userName, setUserName] = useState<string>("Cargando...")
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        async function fetchUser() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "Usuario"
                setUserName(name)
            } else {
                setUserName("Usuario")
            }
        }
        fetchUser()
    }, [])

    async function handleLogout() {
        setIsLoggingOut(true)
        await logout()
    }

    return (
        <header className="flex h-16 items-center justify-between border-b bg-card px-6 print:hidden">
            {/* Left: Mobile menu + Search */}
            <div className="flex items-center gap-4">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0 flex flex-col">
                        <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
                        <div className="flex h-16 items-center gap-2 px-6 border-b shrink-0">
                            <Logo className="h-8 w-8" />
                            <span className="text-lg font-bold tracking-tight">FinanzApp</span>
                        </div>
                        <ScrollArea className="flex-1 px-3 py-4">
                            <nav className="flex flex-col gap-1">
                                {mainNav.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
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
                            <div className="mt-6 md:mt-auto">
                                <Separator className="mb-4" />
                                <nav className="flex flex-col gap-1">
                                    {bottomNav.map((item) => (
                                        <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start gap-3">
                                                <item.icon className="h-4 w-4" />
                                                {item.label}
                                            </Button>
                                        </Link>
                                    ))}
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                    >
                                        {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                                        Cerrar sesión
                                    </Button>
                                </nav>
                            </div>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>

                <div className="hidden sm:block">
                    <GlobalSearch />
                </div>
            </div>

            {/* Right: ThemeToggle + Notifications + Profile */}
            <div className="flex items-center gap-3">
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]">
                        3
                    </Badge>
                </Button>

                <Separator orientation="vertical" className="h-8" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-auto flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-muted/50 border border-transparent hover:border-border transition-all">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/avatar.png" alt={userName} />
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                    {userName ? userName.substring(0, 2).toUpperCase() : "US"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden text-left sm:block">
                                <p className="text-sm font-medium leading-none">{userName}</p>
                                <p className="text-xs text-muted-foreground mt-1">Plan Premium</p>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{userName}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    Administrador
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/profile" className="w-full cursor-pointer">
                                Mi Perfil
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            Configuración de la Agencia
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 cursor-pointer"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                            <span>Cerrar sesión</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
