"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, KeyRound, ArrowRight, ShieldCheck, Mail, CreditCard, Loader2 } from "lucide-react"
import { logout } from "@/app/login/actions"
import { createClient } from "@/utils/supabase/client"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { updateUserRole } from "@/actions/admin"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface ProfileContentProps {
    user: {
        id: string
        email: string
        name: string
        initials: string
        role: string
    }
}

export function ProfileContent({ user }: ProfileContentProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [isResetting, setIsResetting] = useState(false)
    const [isUpgrading, setIsUpgrading] = useState(false)
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState("card")
    const [resetMessage, setResetMessage] = useState("")

    // Credit Card State
    const [provider, setProvider] = useState("visa")
    const [cardNumber, setCardNumber] = useState("")
    const [cardName, setCardName] = useState("")
    const [documentNumber, setDocumentNumber] = useState("")
    const [expiryMonth, setExpiryMonth] = useState("")
    const [expiryYear, setExpiryYear] = useState("")
    const [cvv, setCvv] = useState("")

    const supabase = createClient()
    const router = useRouter()

    async function handleLogout() {
        setIsLoggingOut(true)
        await logout()
        window.location.href = '/'
    }

    async function handlePasswordReset() {
        if (!user.email) return

        setIsResetting(true)
        setResetMessage("")

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                redirectTo: `${window.location.origin}/dashboard/profile/update-password`,
            })

            if (error) throw error
            setResetMessage("Te enviamos un correo con el link para cambiar tu contraseña.")
        } catch (error: any) {
            console.error(error)
            setResetMessage("Hubo un error al intentar enviar el correo. Intenta de nuevo más tarde.")
        } finally {
            setIsResetting(false)
        }
    }

    async function handleSimulatePayment() {
        // Basic Validation
        if (paymentMethod === 'card') {
            if (cardNumber.replace(/\s/g, '').length < 15) {
                toast.error("Número de tarjeta inválido")
                return
            }
            if (!cardName) {
                toast.error("Ingresá el nombre completo")
                return
            }
            if (!documentNumber) {
                toast.error("Ingresá el documento")
                return
            }
            if (!expiryMonth || !expiryYear) {
                toast.error("Seleccioná el vencimiento")
                return
            }
            if (cvv.length < 3) {
                toast.error("CVV inválido")
                return
            }
        }

        setIsUpgrading(true)
        const toastId = toast.loading("Procesando pago...")

        try {
            await new Promise(resolve => setTimeout(resolve, 1500))
            await updateUserRole(user.id, 'pro')

            toast.success('¡Pago exitoso! Bienvenido a Premium', { id: toastId })
            setIsCheckoutOpen(false)
            router.refresh()
            window.location.reload()
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Error al procesar el pago", { id: toastId })
        } finally {
            setIsUpgrading(false)
        }
    }

    const { label: roleLabel, className: roleClassName } = (() => {
        if (user.role === 'admin') {
            return {
                label: 'Administrador',
                className: 'bg-red-900 text-red-100 hover:bg-red-900/80 dark:bg-red-900/80 dark:text-red-100'
            }
        }
        if (user.role === 'pro') {
            return {
                label: 'Plan Premium',
                className: 'bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-600 dark:text-white'
            }
        }
        return {
            label: 'Plan Básico',
            className: 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700'
        }
    })()

    // Input handlers with masking
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "")
        const maxLen = provider === 'amex' ? 15 : 16
        const truncated = val.slice(0, maxLen)

        // Formatting with spaces
        let formatted = ""
        if (provider === 'amex') {
            const match = truncated.match(/^(\d{0,4})(\d{0,6})(\d{0,5})$/)
            if (match) {
                formatted = !match[2] ? match[1] : `${match[1]} ${match[2]}${match[3] ? ` ${match[3]}` : ''}`
            }
        } else {
            const match = truncated.match(/.{1,4}/g)
            formatted = match ? match.join(' ') : ''
        }
        setCardNumber(formatted)
    }

    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 11) // Allow up to 11 digits (CUIT/CUIL)
        setDocumentNumber(val)
    }

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, provider === 'amex' ? 4 : 3)
        setCvv(val)
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <Avatar className="h-20 w-20 border-2 border-border">
                        <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                            {user.initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <CardTitle className="text-2xl">{user.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 text-base">
                            <Mail className="h-4 w-4" />
                            {user.email}
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">Tu Plan Actual</CardTitle>
                            <Badge variant="secondary" className={cn("font-semibold px-3 py-1", roleClassName)}>
                                {roleLabel}
                            </Badge>
                        </div>
                        <CardDescription>
                            {user.role === 'pro'
                                ? 'Estás disfrutando de todas las herramientas avanzadas sin límites.'
                                : user.role === 'admin'
                                    ? 'Tenés acceso total y absoluto a las directivas de la plataforma.'
                                    : 'Estás usando el plan gratuito con funcionalidad limitada.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="space-y-2 text-sm text-muted-foreground mt-2">
                            <li className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                {user.role === 'pro' || user.role === 'admin' ? 'Transacciones ilimitadas' : 'Límite de 50 transacciones por mes'}
                            </li>
                            <li className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                {user.role === 'pro' || user.role === 'admin' ? 'Soporte prioritario' : 'Soporte estándar'}
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        {user.role !== 'pro' && user.role !== 'admin' && (
                            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-md transition-all group"
                                    >
                                        Mejorar a Pro
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-background">
                                    <div className="px-6 pt-6 pb-4 flex flex-col items-center border-b">
                                        <DialogTitle className="text-lg uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                                            Plan Premium
                                        </DialogTitle>
                                        <div className="text-3xl font-bold tracking-tight">
                                            $12.000 <span className="text-sm font-normal text-muted-foreground">ARS</span>
                                        </div>
                                    </div>

                                    <div className="px-6 py-4 grid gap-6">
                                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-3 gap-3">
                                            <div>
                                                <RadioGroupItem value="card" id="card" className="peer sr-only" />
                                                <Label
                                                    htmlFor="card"
                                                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 pb-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:bg-primary/5 cursor-pointer transition-all"
                                                >
                                                    <CreditCard className="mb-2 h-5 w-5" />
                                                    <span className="text-[10px] font-semibold uppercase tracking-wider">Tarjeta</span>
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem value="mercadopago" id="mercadopago" className="peer sr-only" />
                                                <Label
                                                    htmlFor="mercadopago"
                                                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 pb-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:bg-primary/5 cursor-pointer transition-all"
                                                >
                                                    <svg role="img" viewBox="0 0 24 24" className="mb-2 h-5 w-5 fill-current text-[#009ee3]" xmlns="http://www.w3.org/2000/svg"><title>Mercado Pago</title><path d="M12 0C5.373 0 0 5.372 0 12c0 6.627 5.373 12 12 12 6.628 0 12-5.373 12-12C24 5.372 18.628 0 12 0zm0 18.461c-3.158 0-5.717-2.559-5.717-5.72 0-3.16 2.559-5.72 5.717-5.72 3.16 0 5.72 2.56 5.72 5.72 0 3.16-2.56 5.72-5.72 5.72z" /></svg>
                                                    <span className="text-[10px] font-semibold uppercase tracking-wider">Mercado Pago</span>
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
                                                <Label
                                                    htmlFor="paypal"
                                                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 pb-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:bg-primary/5 cursor-pointer transition-all"
                                                >
                                                    <svg role="img" viewBox="0 0 24 24" className="mb-2 h-5 w-5 fill-current text-[#00457C]" xmlns="http://www.w3.org/2000/svg"><title>PayPal</title><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.698 1.815 1.23 1.378 1.48 3.52 1.056 5.952-1.077 6.138-4.385 8.783-9.98 8.783H7.554l-.478 4.787z" /></svg>
                                                    <span className="text-[10px] font-semibold uppercase tracking-wider">PayPal</span>
                                                </Label>
                                            </div>
                                        </RadioGroup>

                                        {paymentMethod === 'card' && (
                                            <div className="grid gap-5">
                                                {/* Visual Credit Card */}
                                                <div className="relative w-full h-[180px] sm:h-[200px] rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 p-6 text-white shadow-xl overflow-hidden flex flex-col justify-between">
                                                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 mix-blend-overlay"></div>
                                                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-white opacity-5 mix-blend-overlay"></div>

                                                    <div className="flex justify-between items-start relative z-10">
                                                        <div className="w-12 h-8 bg-white/20 rounded flex items-center justify-center">
                                                            <div className="w-8 h-5 bg-white/30 rounded-sm"></div>
                                                        </div>
                                                        <div className="text-xl font-bold italic tracking-wider opacity-80">
                                                            {provider === 'visa' && 'VISA'}
                                                            {provider === 'mastercard' && 'Mastercard'}
                                                            {provider === 'amex' && 'AMEX'}
                                                        </div>
                                                    </div>

                                                    <div className="relative z-10 flex flex-col gap-4">
                                                        <div className="text-xl sm:text-2xl tracking-widest font-mono opacity-90 min-h-[32px]">
                                                            {cardNumber || "•••• •••• •••• ••••"}
                                                        </div>
                                                        <div className="flex justify-between items-end">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] uppercase tracking-wider opacity-60 mb-1">Nombre del titular</span>
                                                                <span className="font-medium text-sm sm:text-base tracking-wide truncate max-w-[180px] min-h-[24px]">
                                                                    {cardName.toUpperCase() || "JUAN PEREZ"}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-col items-end">
                                                                <span className="text-[10px] uppercase tracking-wider opacity-60 mb-1">Vencimiento</span>
                                                                <span className="font-medium text-sm sm:text-base tracking-widest min-h-[24px]">
                                                                    {expiryMonth || "MM"}/{expiryYear || "YY"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Form Fields */}
                                                <div className="grid gap-4 mt-2">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="provider" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Operadora</Label>
                                                        <Select value={provider} onValueChange={setProvider} disabled={isUpgrading}>
                                                            <SelectTrigger id="provider" className="h-10">
                                                                <SelectValue placeholder="Seleccionar" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="visa">Visa</SelectItem>
                                                                <SelectItem value="mastercard">Mastercard</SelectItem>
                                                                <SelectItem value="amex">American Express</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="cardNumber" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Número de Tarjeta</Label>
                                                        <Input
                                                            id="cardNumber"
                                                            value={cardNumber}
                                                            onChange={handleCardNumberChange}
                                                            placeholder="0000 0000 0000 0000"
                                                            disabled={isUpgrading}
                                                            className="font-mono h-10 tracking-widest"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="cardName" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Nombre Completo</Label>
                                                            <Input
                                                                id="cardName"
                                                                value={cardName}
                                                                onChange={(e) => setCardName(e.target.value)}
                                                                placeholder="Juan Perez"
                                                                disabled={isUpgrading}
                                                                className="h-10"
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="documentNumber" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Nº de Documento</Label>
                                                            <Input
                                                                id="documentNumber"
                                                                value={documentNumber}
                                                                onChange={handleDocumentChange}
                                                                placeholder="12345678"
                                                                disabled={isUpgrading}
                                                                className="h-10"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-12 gap-4">
                                                        <div className="grid gap-2 col-span-8">
                                                            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Expiración</Label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <Select value={expiryMonth} onValueChange={setExpiryMonth} disabled={isUpgrading}>
                                                                    <SelectTrigger className="h-10">
                                                                        <SelectValue placeholder="Mes" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                                                            <SelectItem key={m} value={m.toString().padStart(2, '0')}>
                                                                                {m.toString().padStart(2, '0')}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <Select value={expiryYear} onValueChange={setExpiryYear} disabled={isUpgrading}>
                                                                    <SelectTrigger className="h-10">
                                                                        <SelectValue placeholder="Año" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() + i).map((y) => (
                                                                            <SelectItem key={y} value={y.toString().slice(2)}>
                                                                                {y.toString().slice(2)}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                        <div className="grid gap-2 col-span-4">
                                                            <Label htmlFor="cvv" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">CVV</Label>
                                                            <Input
                                                                id="cvv"
                                                                value={cvv}
                                                                onChange={handleCvvChange}
                                                                placeholder="123"
                                                                type="password"
                                                                disabled={isUpgrading}
                                                                className="font-mono h-10 tracking-widest text-center"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {paymentMethod !== 'card' && (
                                            <div className="text-center text-sm text-muted-foreground py-12 bg-muted/40 rounded-xl border border-dashed border-muted-foreground/30 flex flex-col items-center justify-center min-h-[460px]">
                                                {paymentMethod === 'mercadopago' ? (
                                                    <svg role="img" viewBox="0 0 24 24" className="mb-4 h-12 w-12 fill-current text-[#009ee3] opacity-80" xmlns="http://www.w3.org/2000/svg"><title>Mercado Pago</title><path d="M12 0C5.373 0 0 5.372 0 12c0 6.627 5.373 12 12 12 6.628 0 12-5.373 12-12C24 5.372 18.628 0 12 0zm0 18.461c-3.158 0-5.717-2.559-5.717-5.72 0-3.16 2.559-5.72 5.717-5.72 3.16 0 5.72 2.56 5.72 5.72 0 3.16-2.56 5.72-5.72 5.72z" /></svg>
                                                ) : (
                                                    <svg role="img" viewBox="0 0 24 24" className="mb-4 h-12 w-12 fill-current text-[#00457C] opacity-80" xmlns="http://www.w3.org/2000/svg"><title>PayPal</title><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.698 1.815 1.23 1.378 1.48 3.52 1.056 5.952-1.077 6.138-4.385 8.783-9.98 8.783H7.554l-.478 4.787z" /></svg>
                                                )}
                                                <p className="max-w-[240px]">
                                                    Serás redirigido de forma segura para completar tu pago.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 pt-2 pb-6 bg-muted/20 border-t">
                                        <Button
                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-lg font-medium text-base shadow-lg shadow-primary/20 transition-all border-0"
                                            onClick={handleSimulatePayment}
                                            disabled={isUpgrading}
                                        >
                                            {isUpgrading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    PROCESANDO...
                                                </>
                                            ) : (
                                                'CONFIRMAR PAGO (DEMO)'
                                            )}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </CardFooter>
                </Card>

                {/* Seguridad */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-xl">Seguridad</CardTitle>
                        <CardDescription>
                            Gestioná las credenciales de tu cuenta
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium">Contraseña</span>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start font-normal"
                                    onClick={handlePasswordReset}
                                    disabled={isResetting}
                                >
                                    <KeyRound className="mr-2 h-4 w-4" />
                                    {isResetting ? 'Solicitando...' : 'Cambiar Contraseña'}
                                </Button>
                                {resetMessage && (
                                    <p className="text-xs text-muted-foreground mt-1">{resetMessage}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="destructive"
                            className="w-full bg-red-500 hover:bg-red-600 shadow-sm"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
