"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Rocket, ArrowRight, Wallet, Sparkles, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createInitialAccount } from "@/actions/accounts"

export function OnboardingModal() {
    const [name, setName] = useState("")
    const [balance, setBalance] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Formatear input de balance mientras limpia a numeros
    const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        // Permitir solo números y un punto o coma
        if (/^[0-9.,]*$/.test(val)) {
            setBalance(val)
        }
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!name.trim()) {
            toast.error("Por favor ingresa un nombre para tu cuenta")
            return
        }

        const numericBalance = parseFloat(balance.replace(',', '.')) || 0

        setIsLoading(true)
        const toastId = toast.loading("Creando tu primera cuenta...")

        try {
            // Simulamos un delay muy leve para efecto UX
            await new Promise(r => setTimeout(r, 600))

            await createInitialAccount(name, numericBalance)
            toast.success("¡Cuenta creada con éxito! Todo listo 🚀", { id: toastId })

            // Revalidation handles the closing because page will reload and count > 0
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Hubo un error al crear la cuenta", { id: toastId })
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={true} onOpenChange={() => { }}>
            <DialogContent
                className="sm:max-w-[480px] p-0 overflow-hidden bg-background border-border shadow-2xl rounded-2xl"
                showCloseButton={false}
            >
                {/* Header espectacular con gradiente */}
                <div className="relative overflow-hidden px-8 py-10 text-center bg-gradient-to-br from-indigo-500/10 via-cyan-500/10 to-transparent border-b">

                    {/* Efectos decorativos de fondo */}
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-indigo-500/20 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-cyan-500/20 blur-2xl"></div>

                    {/* Ícono central */}
                    <div className="relative z-10 mx-auto w-20 h-20 mb-6 flex items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 shadow-xl shadow-indigo-500/10 rotate-3">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-2xl -m-1 -z-10 blur-sm"></div>
                        <Rocket className="w-10 h-10 text-indigo-600 dark:text-indigo-400 -rotate-12 transition-transform hover:scale-110 hover:-rotate-6" />
                        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-400" />
                    </div>

                    <DialogTitle className="text-3xl font-extrabold tracking-tight mb-3 text-foreground">
                        ¡Hola! Te damos la bienvenida a FinanzApp
                    </DialogTitle>
                    <DialogDescription className="text-base text-muted-foreground max-w-[320px] mx-auto leading-relaxed">
                        Para empezar a tener el control total de tu dinero, creemos tu primera cuenta o billetera.
                    </DialogDescription>
                </div>

                {/* Formulario */}
                <form onSubmit={onSubmit} className="p-8 grid gap-8 bg-card">
                    <div className="grid gap-6">
                        <div className="grid gap-2 relative">
                            <Label htmlFor="accountName" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Wallet className="w-4 h-4 text-cyan-600" />
                                Nombre de la cuenta
                            </Label>
                            <Input
                                id="accountName"
                                placeholder="Efectivo, Mercado Pago, Banco Galicia..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-12 text-lg rounded-xl transition-all focus-visible:ring-indigo-500"
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>

                        <div className="grid gap-2 relative">
                            <Label htmlFor="balance" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-green-100 text-green-700 font-bold text-[10px]">$</span>
                                Saldo Inicial
                            </Label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xl text-muted-foreground font-semibold">
                                    $
                                </div>
                                <Input
                                    id="balance"
                                    placeholder="0.00"
                                    value={balance}
                                    onChange={handleBalanceChange}
                                    className="h-14 pl-8 font-mono text-xl md:text-2xl rounded-xl transition-all focus-visible:ring-indigo-500 font-semibold tracking-wide"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg font-semibold shadow-xl shadow-indigo-600/20 group transition-all"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                Creando cuenta...
                            </>
                        ) : (
                            <>
                                Arrancar con todo
                                <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
