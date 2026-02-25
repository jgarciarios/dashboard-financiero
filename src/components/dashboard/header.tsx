"use client"

import { Bell, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function DashboardHeader() {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
            {/* Left: Mobile menu + Search */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                </Button>

                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar transacciones..."
                        className="w-64 pl-9"
                    />
                </div>
            </div>

            {/* Right: Notifications + Profile */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]">
                        3
                    </Badge>
                </Button>

                <Separator orientation="vertical" className="h-8" />

                <div className="flex items-center gap-3">
                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-medium leading-none">Juan García</p>
                        <p className="text-xs text-muted-foreground">Plan Premium</p>
                    </div>
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatar.png" alt="Juan García" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            JG
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    )
}
