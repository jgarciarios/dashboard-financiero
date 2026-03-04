import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Bitcoin, Wallet } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { NewInvestmentModal } from "@/components/dashboard/new-investment-modal"
import { CurrencyDisplay } from "@/components/dashboard/currency-display"

export default async function InversionesPage() {
    const supabase = await createClient()

    // 1. Fetch user to ensure we only get their data
    const { data: { user } } = await supabase.auth.getUser()

    let investments: any[] = []

    if (user) {
        // 2. Fetch investments
        const { data: investmentsData } = await supabase
            .from("investments")
            .select("*")
            .order("created_at", { ascending: false })

        investments = investmentsData || []
    }

    const getIconForType = (type: string) => {
        switch (type) {
            case "Fondo Común de Inversión":
                return <Wallet className="h-4 w-4" />
            case "CEDEARs":
                return <DollarSign className="h-4 w-4" />
            case "Cripto / USDT":
                return <Bitcoin className="h-4 w-4" />
            default:
                return <Wallet className="h-4 w-4" />
        }
    }

    const getIconWrapperClass = (type: string) => {
        switch (type) {
            case "Fondo Común de Inversión":
                return "bg-primary/10 text-primary"
            case "CEDEARs":
                return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
            case "Cripto / USDT":
                return "bg-orange-500/10 text-orange-600 dark:text-orange-400"
            default:
                return "bg-primary/10 text-primary"
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
                                <h1 className="text-3xl font-bold tracking-tight">Portafolio de Inversiones</h1>
                                <p className="text-muted-foreground mt-1">
                                    Monitoreá el rendimiento de tus activos y el capital de trabajo
                                </p>
                            </div>
                            <NewInvestmentModal />
                        </div>

                        {investments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg border-dashed bg-muted/30">
                                <h3 className="text-lg font-semibold mb-2">Aún no tenés inversiones registradas</h3>
                                <p className="text-muted-foreground max-w-md">
                                    Añadí tu primer activo al portafolio para empezar a seguir su rendimiento en tiempo real y tener un control claro de tu capital.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {investments.map((inv) => {
                                    const invested_amount = Number(inv.invested_amount)
                                    const current_value = Number(inv.current_value)
                                    const performanceValue = current_value - invested_amount
                                    const performancePercentage = ((performanceValue) / invested_amount) * 100

                                    const isPositive = performancePercentage >= 0

                                    return (
                                        <Card key={inv.id} className="hover:shadow-md transition-shadow">
                                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                                <div>
                                                    <CardTitle className="text-base font-semibold">{inv.name}</CardTitle>
                                                    <CardDescription>{inv.type}</CardDescription>
                                                </div>
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getIconWrapperClass(inv.type)}`}>
                                                    {getIconForType(inv.type)}
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="mt-4 space-y-2">
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-sm font-medium text-muted-foreground">Capital Invertido</span>
                                                        <span className="text-sm font-semibold">
                                                            <CurrencyDisplay amount={invested_amount} />
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-end border-t pt-2 mt-2">
                                                        <span className="text-sm font-medium text-muted-foreground">Valor Actual</span>
                                                        <span className="text-2xl font-bold tracking-tight">
                                                            <CurrencyDisplay amount={current_value} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="pt-0">
                                                <div className="w-full flex items-center justify-between mt-4">
                                                    <span className="text-sm text-muted-foreground">Rendimiento</span>
                                                    <Badge
                                                        variant={isPositive ? "default" : "destructive"}
                                                        className={isPositive
                                                            ? "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-400"
                                                            : "bg-red-500/15 text-red-700 hover:bg-red-500/25 dark:text-red-400"
                                                        }
                                                    >
                                                        {isPositive ? (
                                                            <TrendingUp className="mr-1 h-3 w-3" />
                                                        ) : (
                                                            <TrendingDown className="mr-1 h-3 w-3" />
                                                        )}
                                                        {isPositive ? '+' : ''}{performancePercentage.toFixed(2)}%
                                                    </Badge>
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
