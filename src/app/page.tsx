import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { FinancialChart } from "@/components/dashboard/financial-chart"
import { TransactionForm } from "@/components/dashboard/transaction-form"
import { TransactionsTable } from "@/components/dashboard/transactions-table"

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <SummaryCards />

            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
              <FinancialChart />
              <TransactionForm />
            </div>

            <TransactionsTable />
          </div>
        </main>
      </div>
    </div>
  )
}
