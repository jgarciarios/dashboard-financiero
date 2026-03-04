import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <DashboardSidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <DashboardHeader />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mx-auto flex max-w-7xl flex-col gap-6">

                        {/* Header and filters placeholder */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <Skeleton className="h-9 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-9 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                                <Skeleton className="h-9 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="rounded-xl border bg-card text-card-foreground shadow">
                                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                                        <Skeleton className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                                        <Skeleton className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                                    </div>
                                    <div className="p-6 pt-0">
                                        <Skeleton className="h-8 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl mt-2" />
                                        <Skeleton className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-xl mt-2" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Charts Row */}
                        <div className="grid gap-6 lg:grid-cols-3">
                            {/* Financial Chart (Large Left) */}
                            <div className="lg:col-span-2 rounded-xl border bg-card text-card-foreground shadow flex flex-col h-[400px]">
                                <div className="p-6 flex flex-col space-y-1.5 pb-4">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-8 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                                            <Skeleton className="h-8 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                                            <Skeleton className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 pt-0 flex-1 pl-2">
                                    <Skeleton className="h-full w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                                </div>
                            </div>

                            {/* Asset Allocation Chart (Square Right) */}
                            <div className="lg:col-span-1 rounded-xl border bg-card text-card-foreground shadow flex flex-col h-[400px]">
                                <div className="p-6 flex flex-col space-y-1.5 pb-4">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-6 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                                        <Skeleton className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                                    </div>
                                </div>
                                <div className="p-6 pt-0 flex-1 flex flex-col items-center justify-center">
                                    {/* Circle simulation for pie chart */}
                                    <Skeleton className="h-48 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-full mb-4" />
                                    <div className="flex gap-4 w-full justify-center">
                                        <Skeleton className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                                        <Skeleton className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    )
}
