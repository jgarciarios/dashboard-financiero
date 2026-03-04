'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { login, signup } from './actions'
import { Loader2, ArrowRight } from 'lucide-react'

export default function LoginPage() {
    const [loading, setLoading] = useState<"login" | "signup" | null>(null)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    async function handleAction(formData: FormData, actionFunc: typeof login, actionType: "login" | "signup") {
        setLoading(actionType)
        setErrorMsg(null)

        try {
            const res = await actionFunc(formData)
            if (res?.error) {
                setErrorMsg(res.error)
            }
        } catch (e: any) {
            // Nextjs redirect throws an error to halt execution, we shouldn't catch and display it
            if (e.message && e.message.includes('NEXT_REDIRECT')) {
                throw e;
            }
            setErrorMsg(e.message || "Ocurrió un error inesperado")
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden p-4">
            {/* Subtle background gradients for B2B SaaS premium feel */}
            <div className="absolute top-0 right-0 -m-32 h-[400px] w-[400px] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -m-32 h-[400px] w-[400px] rounded-full bg-indigo-400/10 blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">CFO Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-2 dark:text-slate-400">Plataforma integral de gestión financiera</p>
                </div>

                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
                        <TabsTrigger value="login" className="text-sm font-medium">Iniciar Sesión</TabsTrigger>
                        <TabsTrigger value="signup" className="text-sm font-medium">Crear Cuenta</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-xl">Bienvenido de nuevo</CardTitle>
                                <CardDescription>
                                    Ingresa tus credenciales para acceder a tu cuenta.
                                </CardDescription>
                            </CardHeader>
                            <form>
                                <CardContent className="space-y-4">
                                    {errorMsg && (
                                        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400">
                                            {errorMsg}
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label htmlFor="login-email">Correo electrónico</Label>
                                        <Input
                                            id="login-email"
                                            name="email"
                                            type="email"
                                            placeholder="tu@empresa.com"
                                            required
                                            className="bg-white dark:bg-slate-950"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="login-password">Contraseña</Label>
                                            <Button type="button" variant="link" className="p-0 h-auto text-xs font-normal text-blue-600 dark:text-blue-400 hover:no-underline">¿Olvidaste tu contraseña?</Button>
                                        </div>
                                        <Input
                                            id="login-password"
                                            name="password"
                                            type="password"
                                            required
                                            className="bg-white dark:bg-slate-950"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        type="button"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all"
                                        disabled={loading !== null}
                                        onClick={(e) => handleAction(new FormData(e.currentTarget.form!), login, "login")}
                                    >
                                        {loading === "login" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                                        Iniciar Sesión
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>

                    <TabsContent value="signup">
                        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-xl">Comienza ahora</CardTitle>
                                <CardDescription>
                                    Crea tu cuenta corporativa y optimiza tus finanzas.
                                </CardDescription>
                            </CardHeader>
                            <form>
                                <CardContent className="space-y-4">
                                    {errorMsg && (
                                        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400">
                                            {errorMsg}
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-fullname">Nombre Completo</Label>
                                        <Input
                                            id="signup-fullname"
                                            name="fullName"
                                            type="text"
                                            placeholder="Juan Pérez"
                                            required
                                            className="bg-white dark:bg-slate-950"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-company">Nombre de la Empresa</Label>
                                        <Input
                                            id="signup-company"
                                            name="companyName"
                                            type="text"
                                            placeholder="Acme Corp"
                                            required
                                            className="bg-white dark:bg-slate-950"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email">Correo corporativo</Label>
                                        <Input
                                            id="signup-email"
                                            name="email"
                                            type="email"
                                            placeholder="tu@empresa.com"
                                            required
                                            className="bg-white dark:bg-slate-950"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">Contraseña</Label>
                                        <Input
                                            id="signup-password"
                                            name="password"
                                            type="password"
                                            required
                                            className="bg-white dark:bg-slate-950"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        type="button"
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-all mx-0"
                                        disabled={loading !== null}
                                        onClick={(e) => handleAction(new FormData(e.currentTarget.form!), signup, "signup")}
                                    >
                                        {loading === "signup" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Crear Cuenta
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                </Tabs>

                <p className="text-center text-xs text-slate-500 mt-8">
                    © {new Date().getFullYear()} CFO Dashboard. Todos los derechos reservados.
                </p>
            </div>
        </div>
    )
}
