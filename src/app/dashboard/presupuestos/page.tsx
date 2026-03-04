import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/utils/supabase/server"
import { NewBudgetModal } from "@/components/dashboard/new-budget-modal"
import { MonthYearFilter } from "@/components/dashboard/month-year-filter"
import { CurrencyDisplay } from "@/components/dashboard/currency-display"

interface SearchParams {
    mes?: string
    anio?: string
}

export default async function PresupuestosPage(props: { searchParams: Promise<SearchParams> }) {
    const searchParams = await props.searchParams
    const supabase = await createClient()

    // 1. Fetch user to ensure we only get their data
    const { data: { user } } = await supabase.auth.getUser()

    let budgets: any[] = []
    let spentPerCategory: Record<string, number> = {}

    if (user) {
        // 2. Fetch budgets
        const { data: budgetsData } = await supabase
            .from("budgets")
            .select("*")
            .order("created_at", { ascending: false })

        budgets = budgetsData || []

        // 3. Fetch transactions for the selected month to calculate spent amount
        const today = new Date()
        const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0")
        const currentYear = today.getFullYear().toString()

        const mes = searchParams.mes || currentMonth
        const anio = searchParams.anio || currentYear

        const startDate = `${anio}-${mes}-01T00:00:00.000Z`
        const lastDay = new Date(Number(anio), Number(mes), 0).getDate()
        const endDate = `${anio}-${mes}-${lastDay}T23:59:59.999Z`

        const { data: transactionsData } = await supabase
            .from("transactions")
            .select("amount, category, type")
            .gte("date", startDate)
            .lte("date", endDate)

        const transactions = transactionsData || []

        // 4. Calculate total spent per category for 'Gasto' (or 'egreso')
        transactions.forEach((tx: any) => {
            if (tx.type === "Gasto" || tx.type === "egreso") {
                const amount = Number(tx.amount)
                if (!spentPerCategory[tx.category]) {
                    spentPerCategory[tx.category] = 0
                }
                spentPerCategory[tx.category] += amount
            }
        })
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
                                <h1 className="text-3xl font-bold tracking-tight">Control de Presupuestos</h1>
                                <p className="text-muted-foreground mt-1">
                                    Gestioná y asigná límites de gasto por categoría
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <MonthYearFilter />
                                <NewBudgetModal />
                            </div>
                        </div>

                        {budgets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg border-dashed">
                                <h3 className="text-lg font-semibold mb-2">Aún no tenés presupuestos</h3>
                                <p className="text-muted-foreground max-w-sm">
                                    Crea tu primer presupuesto para empezar a llevar un control de tus gastos mensuales por categoría.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {budgets.map((budget) => {
                                    const amount_limit = Number(budget.amount_limit)
                                    const spent = spentPerCategory[budget.category] || 0
                                    const percentage = Math.min((spent / amount_limit) * 100, 100)
                                    const remaining = amount_limit - spent
                                    const isOverBudget = remaining < 0

                                    // Determine progress bar color based on percentage
                                    let progressColorClass = "bg-green-500 dark:bg-green-400"
                                    let statusLabel = "Saludable"

                                    if (percentage > 85) {
                                        progressColorClass = "bg-red-500 dark:bg-red-400"
                                        statusLabel = "Límite Excedido"
                                    } else if (percentage >= 50) {
                                        progressColorClass = "bg-yellow-500 dark:bg-yellow-400"
                                        statusLabel = "En Observación"
                                    }

                                    return (
                                        <Card key={budget.id} className="hover:shadow-md transition-shadow">
                                            <CardHeader className="pb-2">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-base font-semibold">{budget.category}</CardTitle>
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${percentage > 85
                                                        ? 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                                                        : percentage >= 50
                                                            ? 'text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30'
                                                            : 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
                                                        }`}>
                                                        {statusLabel}
                                                    </span>
                                                </div>
                                                <CardDescription>Presupuesto Mensual</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="mt-2 flex items-baseline gap-2">
                                                    <span className="text-3xl font-bold tracking-tight">
                                                        <CurrencyDisplay amount={spent} />
                                                    </span>
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        de <CurrencyDisplay amount={amount_limit} />
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={percentage}
                                                    className={`mt-4 h-2 [&>div]:${progressColorClass}`}
                                                />
                                            </CardContent>
                                            <CardFooter className="pt-0">
                                                <div className="text-sm text-muted-foreground mt-2 w-full flex justify-between items-center">
                                                    <span className="font-medium">Gastado: {percentage.toFixed(1)}%</span>
                                                    <span className={`font-medium px-2 py-1 rounded-md flex items-center gap-1 ${isOverBudget
                                                        ? 'text-red-600 dark:text-red-400 bg-red-500/10'
                                                        : percentage > 85
                                                            ? 'text-red-600 dark:text-red-400 bg-red-500/10'
                                                            : percentage >= 50
                                                                ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10'
                                                                : 'text-green-600 dark:text-green-400 bg-green-500/10'
                                                        }`}>
                                                        {isOverBudget ? 'Excedido: ' : 'Restante: '}
                                                        <CurrencyDisplay amount={Math.abs(remaining)} />
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
