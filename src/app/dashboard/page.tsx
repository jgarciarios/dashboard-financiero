import Link from "next/link"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardMetricsWrapper } from "@/components/dashboard/dashboard-metrics-wrapper"
import { AssetAllocationChart } from "@/components/dashboard/asset-allocation-chart"
import { TransactionForm } from "@/components/dashboard/transaction-form"
import { TransactionsTable } from "@/components/dashboard/transactions-table"
import { createClient } from "@/utils/supabase/server"
import { ExportReportButton } from "@/components/dashboard/export-report-button"
import { PrintHeader } from "@/components/dashboard/print-header"
import { MonthYearFilter } from "@/components/dashboard/month-year-filter"
import { TrendingUp } from "lucide-react"
import { ExportPDFButton } from "@/components/dashboard/export-pdf-button"
import { DemoDataButton } from "@/components/dashboard/demo-data-button"

// 1. Agregamos el parámetro 'rango' a la interfaz
interface SearchParams {
  mes?: string
  anio?: string
  rango?: string
}

export default async function DashboardPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const today = new Date()
  let startDate: string
  let endDate: string = today.toISOString()

  // 2. LA MAGIA MATEMÁTICA: Calculamos la fecha según el botón que tocaste
  if (searchParams.rango === "todo") {
    startDate = "2000-01-01T00:00:00.000Z" // Desde el principio de los tiempos
  } else if (searchParams.rango === "1a") {
    const lastYear = new Date()
    lastYear.setFullYear(today.getFullYear() - 1)
    startDate = lastYear.toISOString()
  } else if (searchParams.rango === "6m") {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(today.getMonth() - 6)
    startDate = sixMonthsAgo.toISOString()
  } else {
    // Si no tocaste ningún botón de rango, funciona normal por mes
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0")
    const currentYear = today.getFullYear().toString()
    const mes = searchParams.mes || currentMonth
    const anio = searchParams.anio || currentYear

    startDate = `${anio}-${mes}-01T00:00:00.000Z`
    const lastDay = new Date(Number(anio), Number(mes), 0).getDate()
    endDate = `${anio}-${mes}-${lastDay}T23:59:59.999Z`
  }

  let transactions: any[] = []
  let accounts: any[] = []
  let investments: any[] = []

  if (user) {
    // 3. Supabase ahora SÍ va a buscar los datos del rango completo
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

  let liquidez = 0
  accounts.forEach((acc) => {
    const balance = Number(acc.balance) || 0
    if (acc.type === "Tarjeta de Crédito" && balance > 0) {
      liquidez -= balance
    } else {
      liquidez += balance
    }
  })

  let activos = 0
  investments.forEach((inv) => {
    activos += Number(inv.current_value) || 0
  })

  const patrimonioNeto = liquidez + activos
  const latestTransactions = transactions.slice(0, 5)

  return (
    <div className="flex h-screen overflow-hidden bg-background print:h-auto print:bg-white print:text-black">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col overflow-hidden print:overflow-visible">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6 print:overflow-visible print:px-0 print:py-4">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <PrintHeader />

            {/* Cabecera y Botones */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard General</h2>
              <div className="flex items-center gap-2">

                {/* 4. LOS BOTONES MAESTROS QUE CONTROLAN TODO */}
                <div className="flex bg-muted rounded-lg p-1 mr-2 border border-border/50">
                  <Link href="?rango=6m" className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${searchParams.rango === '6m' ? 'bg-background shadow-sm text-cyan-500' : 'text-muted-foreground hover:bg-background/50'}`}>
                    6M
                  </Link>
                  <Link href="?rango=1a" className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${searchParams.rango === '1a' ? 'bg-background shadow-sm text-cyan-500' : 'text-muted-foreground hover:bg-background/50'}`}>
                    1A
                  </Link>
                  <Link href="?rango=todo" className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${searchParams.rango === 'todo' ? 'bg-background shadow-sm text-cyan-500' : 'text-muted-foreground hover:bg-background/50'}`}>
                    Todo
                  </Link>
                </div>

                <MonthYearFilter />
                <DemoDataButton />
                <ExportPDFButton />
              </div>
            </div>

            <div id="dashboard-report" className="flex flex-col gap-6 bg-background">
              <DashboardMetricsWrapper
                transactions={transactions}
                patrimonioNeto={patrimonioNeto}
              />

              {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 mt-6 border border-dashed rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-center" data-html2canvas-ignore="true">
                  <div className="h-12 w-12 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Sin movimientos</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-6">
                    No hay registros en este periodo.
                  </p>
                  <div className="print:hidden">
                    <TransactionForm />
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-3">
                      <AssetAllocationChart accounts={accounts} investments={investments} />
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-3 print:hidden mt-6" data-html2canvas-ignore="true">
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
          </div>
        </main>
      </div>
    </div>
  )
}