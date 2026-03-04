import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { FinancialChart } from "@/components/dashboard/financial-chart"
import { AssetAllocationChart } from "@/components/dashboard/asset-allocation-chart"
import { TransactionForm } from "@/components/dashboard/transaction-form"
import { TransactionsTable } from "@/components/dashboard/transactions-table"
import { createClient } from "@/utils/supabase/server"
import { ExportReportButton } from "@/components/dashboard/export-report-button"
import { PrintHeader } from "@/components/dashboard/print-header"
import { MonthYearFilter } from "@/components/dashboard/month-year-filter"
import { TrendingUp } from "lucide-react"

interface SearchParams {
  mes?: string
  anio?: string
}

export default async function DashboardPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const today = new Date()
  const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0")
  const currentYear = today.getFullYear().toString()

  const mes = searchParams.mes || currentMonth
  const anio = searchParams.anio || currentYear

  // Construct start/end dates for the selected month to filter transactions
  const startDate = `${anio}-${mes}-01T00:00:00.000Z`
  const lastDay = new Date(Number(anio), Number(mes), 0).getDate()
  const endDate = `${anio}-${mes}-${lastDay}T23:59:59.999Z`

  let transactions: any[] = []
  let accounts: any[] = []
  let investments: any[] = []

  if (user) {
    const [txResponse, accResponse, invResponse] = await Promise.all([
      supabase.from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: false }),
      supabase.from("accounts").select("*").eq("user_id", user.id),
      supabase.from("investments").select("*").eq("user_id", user.id)
    ])

    transactions = txResponse.data || []
    accounts = accResponse.data || []
    investments = invResponse.data || []
  }

  // Calculation for Net Worth
  let liquidez = 0
  accounts.forEach((acc) => {
    const balance = Number(acc.balance) || 0
    if (acc.type === "Tarjeta de Crédito" && balance > 0) {
      liquidez -= balance // Debt
    } else {
      liquidez += balance
    }
  })

  let activos = 0
  investments.forEach((inv) => {
    activos += Number(inv.current_value) || 0
  })

  const patrimonioNeto = liquidez + activos

  let ingresos = 0
  let gastos = 0

  transactions.forEach((tx) => {
    const amount = Number(tx.amount) || 0
    if (tx.type === "Ingreso" || tx.type === "ingreso") {
      ingresos += amount
    } else {
      gastos += amount
    }
  })

  const flujoNeto = ingresos - gastos
  const latestTransactions = transactions.slice(0, 5)
  return (
    <div className="flex h-screen overflow-hidden bg-background print:h-auto print:bg-white print:text-black">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col overflow-hidden print:overflow-visible">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6 print:overflow-visible print:px-0 print:py-4">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <PrintHeader />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard General</h2>
              <div className="flex items-center gap-2">
                <MonthYearFilter />
                <ExportReportButton />
              </div>
            </div>

            <SummaryCards
              ingresos={ingresos}
              gastos={gastos}
              flujoNeto={flujoNeto}
              patrimonioNeto={patrimonioNeto}
            />

            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 mt-6 border border-dashed rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Sin movimientos</h3>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-6">
                  No hay registros en {mes}/{anio}. Cargá tu primera transacción para comenzar a medir tu rendimiento en este periodo.
                </p>
                <div className="print:hidden">
                  <TransactionForm />
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <FinancialChart transactions={transactions} />
                  </div>
                  <div className="lg:col-span-1">
                    <AssetAllocationChart accounts={accounts} investments={investments} />
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3 print:hidden mt-6">
                  <div className="lg:col-span-3">
                    <TransactionForm />
                  </div>
                </div>

                <div className="print:hidden">
                  <TransactionsTable transactions={latestTransactions} />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
