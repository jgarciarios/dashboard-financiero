import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Landmark, Banknote, CreditCard } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { NewAccountModal } from "@/components/dashboard/new-account-modal"
import { CurrencyDisplay } from "@/components/dashboard/currency-display"

export default async function BilleteraPage() {
    const supabase = await createClient()

    // 1. Fetch user to ensure we only get their data
    const { data: { user } } = await supabase.auth.getUser()

    let accounts: any[] = []

    if (user) {
        // 2. Fetch accounts
        const { data: accountsData } = await supabase
            .from("accounts")
            .select("*")
            .order("created_at", { ascending: true })

        accounts = accountsData || []
    }

    const getIconForType = (type: string) => {
        switch (type) {
            case "Banco":
                return <Landmark className="h-4 w-4" />
            case "Efectivo":
                return <Banknote className="h-4 w-4" />
            case "Tarjeta de Crédito":
                return <CreditCard className="h-4 w-4" />
            default:
                return <Landmark className="h-4 w-4" />
        }
    }

    const getIconWrapperClass = (type: string) => {
        switch (type) {
            case "Banco":
                return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
            case "Efectivo":
                return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            case "Tarjeta de Crédito":
                return "bg-red-500/10 text-red-600 dark:text-red-400"
            default:
                return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
        }
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <DashboardSidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <DashboardHeader />

                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="mx-auto flex max-w-7xl flex-col gap-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Billetera y Cuentas</h1>
                                <p className="text-muted-foreground mt-1">
                                    Gestioná el saldo de tus cuentas bancarias, tarjetas y efectivo
                                </p>
                            </div>
                            <NewAccountModal />
                        </div>

                        {accounts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg border-dashed bg-muted/30">
                                <h3 className="text-lg font-semibold mb-2">Aún no tenés cuentas registradas</h3>
                                <p className="text-muted-foreground max-w-md">
                                    Añadí tu primera cuenta o tarjeta para empezar a organizar tu dinero y ver tu saldo total disponible.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {accounts.map((acc) => {
                                    const balance = Number(acc.balance)
                                    const isCreditCard = acc.type === "Tarjeta de Crédito"

                                    // Determinar si debemos mostrarlo como deuda en rojo
                                    const displayBalance = isCreditCard && balance > 0 ? -balance : balance;
                                    const balanceColorClass = isCreditCard
                                        ? "text-red-600 dark:text-red-400"
                                        : ""
                                    const cardBorderClass = isCreditCard
                                        ? "border-red-200 dark:border-red-900/50"
                                        : ""

                                    return (
                                        <Card key={acc.id} className={`hover:shadow-md transition-shadow ${cardBorderClass}`}>
                                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                                <div>
                                                    <CardTitle className="text-base font-semibold">{acc.name}</CardTitle>
                                                    <CardDescription>{acc.type}</CardDescription>
                                                </div>
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getIconWrapperClass(acc.type)}`}>
                                                    {getIconForType(acc.type)}
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="mt-4">
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        {isCreditCard ? "Deuda Total" : "Saldo Disponible"}
                                                    </span>
                                                    <div className={`text-3xl font-bold tracking-tight mt-1 ${balanceColorClass}`}>
                                                        <CurrencyDisplay amount={displayBalance} />
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="pt-0">
                                                <div className="w-full flex items-center justify-between mt-2 text-sm">
                                                    <span className="text-muted-foreground">
                                                        {isCreditCard ? "Por pagar" : (acc.currency || "ARS")}
                                                    </span>
                                                    <span className={`font-medium px-2 py-1 rounded-md ${isCreditCard
                                                        ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                        }`}>
                                                        {isCreditCard ? "Pendiente" : "Operativo"}
                                                    </span>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
