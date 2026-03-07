import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PieChart, ShieldCheck, Laptop, CheckCircle2, ArrowRight } from "lucide-react"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { Logo } from "@/components/ui/logo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/utils/supabase/server"

export default async function LandingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300 overflow-hidden">
            {/* Background Blob Effects */}
            <div className="fixed top-0 inset-x-0 h-[600px] w-full -z-10 bg-background pointer-events-none flex justify-center">
                <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen dark:mix-blend-lighten" />
                <div className="absolute top-40 right-1/4 w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[100px] mix-blend-screen dark:mix-blend-lighten" />
            </div>

            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/60 backdrop-blur-xl">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                    <div className="flex items-center gap-3">
                        <Logo className="h-8 w-8" />
                        <span className="text-xl font-bold tracking-tight">FinanzApp</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link href={user ? "/dashboard" : "/login"}>
                            <Button variant="outline" className="font-semibold rounded-full px-6">
                                {user ? "Ir a mi Panel" : "Iniciar Sesión"}
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative w-full pt-32 pb-24 md:pt-40 md:pb-32 lg:pt-48 lg:pb-40">
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
                            <Badge variant="outline" className="mb-6 py-1.5 px-4 text-sm rounded-full bg-muted/50 border-cyan-500/30 text-cyan-700 dark:text-cyan-400 font-medium">
                                <span className="flex h-2 w-2 rounded-full bg-cyan-500 mr-2 animate-pulse"></span>
                                El futuro de tu Agencia Digital está acá
                            </Badge>

                            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl text-balance mb-6">
                                Control total para tu <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 pb-2">
                                    Agencia Digital.
                                </span>
                            </h1>

                            <p className="mt-4 text-xl md:text-2xl text-muted-foreground max-w-3xl text-balance font-medium leading-relaxed">
                                Toma decisiones inteligentes basadas en datos. Monitorea tu MRR, rentabilidad por cliente, control de horas y costos de servidores y pauta en tiempo real.
                            </p>

                            <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center">
                                <Link href={user ? "/dashboard" : "/login"} className="w-full sm:w-auto hover:scale-105 transition-transform">
                                    <Button size="lg" className="w-full bg-foreground text-background hover:bg-foreground/90 h-14 px-8 text-lg font-bold rounded-full shadow-xl shadow-foreground/10">
                                        {user ? "Ver Panel de Rentabilidad" : "Gestionar mi Agencia"} <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                {!user && (
                                    <p className="text-sm text-muted-foreground mt-4 sm:mt-0 sm:ml-4 font-medium">
                                        No requiere tarjeta de crédito
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Bento Grid */}
                <section className="w-full py-24 border-t bg-muted/10 relative">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-balance mb-4">Herramientas diseñadas para agencias</h2>
                            <p className="text-lg text-muted-foreground text-balance">
                                Construimos todo lo que necesitas para gestionar clientes, retainers y proyectos de manera rentable y sin fricción.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {/* Feature 1 */}
                            <Card className="md:col-span-2 border-border/50 bg-background/50 backdrop-blur-sm shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1 transition-all overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                <CardHeader>
                                    <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4">
                                        <PieChart className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
                                    </div>
                                    <CardTitle className="text-3xl font-bold">Métricas de Agencia</CardTitle>
                                    <CardDescription className="text-lg mt-2 font-medium">
                                        Tus métricas clave, MRR, rentabilidad por proyecto y cash flow actualizados al instante, para que tomes el control.
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            {/* Feature 2 */}
                            <Card className="border-border/50 bg-background/50 backdrop-blur-sm shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                <CardHeader className="h-full flex flex-col justify-end">
                                    <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
                                        <ShieldCheck className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold">Control de Accesos RBAC</CardTitle>
                                    <CardDescription className="text-base mt-2 font-medium">
                                        Roles de equipo seguros. Permisos granulares para admins y staff.
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            {/* Feature 3 */}
                            <Card className="md:col-span-3 border-border/50 bg-background/50 backdrop-blur-sm shadow-xl hover:-translate-y-1 transition-all overflow-hidden relative">
                                <CardHeader className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                    <div className="max-w-xl">
                                        <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                                            <Laptop className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <CardTitle className="text-3xl font-bold">Control Multi-dispositivo</CardTitle>
                                        <CardDescription className="text-lg mt-2 font-medium">
                                            Una experiencia impecable en web, tablet o smartphone. La rentabilidad de tu agencia siempre al alcance de tu mano, estés donde estés.
                                        </CardDescription>
                                    </div>
                                    {/* Abstract UI representation */}
                                    <div className="hidden md:flex flex-1 items-center justify-end w-full">
                                        <div className="flex gap-4 p-6 bg-muted/40 rounded-2xl border border-dashed border-border w-full max-w-sm">
                                            <div className="space-y-3 w-full">
                                                <div className="h-4 w-1/3 bg-muted rounded animate-pulse"></div>
                                                <div className="h-8 w-2/3 bg-muted rounded animate-pulse"></div>
                                                <div className="flex gap-2 mt-4">
                                                    <div className="h-20 w-1/2 bg-muted/80 rounded block"></div>
                                                    <div className="h-20 w-1/2 bg-muted/80 rounded block"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="w-full py-24 border-t relative">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-16 max-w-2xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-balance mb-4">Inversión transparente</h2>
                            <p className="text-lg text-muted-foreground text-balance">
                                Un modelo de precios directo, sin cargos ocultos ni sorpresas de fin de mes.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Básico */}
                            <Card className="border-border/50 bg-background/50 backdrop-blur-sm shadow-xl flex flex-col h-full hover:border-foreground/20 transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold">Plan Básico</CardTitle>
                                    <CardDescription className="text-base">Para freelancers y pruebas de concepto.</CardDescription>
                                    <div className="mt-6 flex items-baseline gap-1">
                                        <span className="text-5xl font-extrabold">$0</span>
                                        <span className="text-lg text-muted-foreground font-medium">/mes</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 mt-4">
                                    <ul className="space-y-4">
                                        <li className="flex gap-3 items-center">
                                            <CheckCircle2 className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                            <span className="font-medium">2 Clientes Activos</span>
                                        </li>
                                        <li className="flex gap-3 items-center">
                                            <CheckCircle2 className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                            <span className="font-medium">Gestión de 5 Proyectos</span>
                                        </li>
                                        <li className="flex gap-3 items-center">
                                            <CheckCircle2 className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                            <span className="font-medium">Analítica estándar</span>
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Link href={user ? "/dashboard" : "/login"} className="w-full">
                                        <Button variant="outline" className="w-full h-12 text-base font-semibold rounded-xl">
                                            Comenzar Gratis
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>

                            {/* Premium */}
                            <Card className="relative border-cyan-500 bg-background/80 backdrop-blur-sm shadow-2xl flex flex-col h-full ring-2 ring-cyan-500 scale-100 md:scale-105 z-10 overflow-hidden">
                                <div className="absolute top-0 right-1/2 translate-x-1/2 bg-cyan-500 text-white px-8 py-1.5 rounded-b-xl text-xs font-bold uppercase tracking-widest shadow-lg">
                                    Más Popular
                                </div>
                                <div className="absolute -z-10 top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-500/5 to-transparent"></div>
                                <CardHeader className="pt-10">
                                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                        Plan Premium
                                    </CardTitle>
                                    <CardDescription className="text-base text-cyan-700 dark:text-cyan-400">Para startups y pymes escalando.</CardDescription>
                                    <div className="mt-6 flex items-baseline gap-1">
                                        <span className="text-5xl font-extrabold">$12.000</span>
                                        <span className="text-lg text-muted-foreground font-medium text-cyan-800 dark:text-cyan-300"> ARS/mes</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 mt-4">
                                    <ul className="space-y-4">
                                        <li className="flex gap-3 items-center">
                                            <CheckCircle2 className="h-5 w-5 text-cyan-600 flex-shrink-0" />
                                            <span className="font-medium">Clientes ilimitados</span>
                                        </li>
                                        <li className="flex gap-3 items-center">
                                            <CheckCircle2 className="h-5 w-5 text-cyan-600 flex-shrink-0" />
                                            <span className="font-medium">Retainers y proyectos ilimitados</span>
                                        </li>
                                        <li className="flex gap-3 items-center">
                                            <CheckCircle2 className="h-5 w-5 text-cyan-600 flex-shrink-0" />
                                            <span className="font-medium">Gestor de Presupuestos Avanzado</span>
                                        </li>
                                        <li className="flex gap-3 items-center">
                                            <CheckCircle2 className="h-5 w-5 text-cyan-600 flex-shrink-0" />
                                            <span className="font-medium font-bold text-foreground">Soporte Prioritario 24/7</span>
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Link href={user ? "/dashboard" : "/login"} className="w-full">
                                        <Button className="w-full h-12 text-base font-bold rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white shadow-xl shadow-cyan-600/20">
                                            Adquirir Premium
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer Minimalista */}
            <footer className="w-full py-8 border-t bg-muted/20">
                <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 opacity-80">
                        <Logo className="h-5 w-5 grayscale" />
                        <span className="text-sm font-semibold tracking-tight text-muted-foreground">
                            © 2026 FinanzApp. Todos los derechos reservados.
                        </span>
                    </div>
                    <nav className="flex gap-8">
                        <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Términos
                        </Link>
                        <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Privacidad
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    )
}
