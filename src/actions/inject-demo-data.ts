"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

const generateRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const INGRESO_DESCRIPTIONS = [
    'Suscripción Anual Leads Smart',
    'Retainer Mensual - Cliente A',
    'Retainer Mensual - Cliente B',
    'Setup Fee Consultoría SEO',
    'Desarrollo Web One-off',
    'Consultoría Growth'
]

const GASTO_DESCRIPTIONS = [
    'AWS Hosting',
    'Pauta Google Ads',
    'Suscripción Vercel Pro',
    'Licencias GitHub/Figma',
    'Freelancer Diseño',
    'Herramientas SaaS (Notion, Slack)',
    'Meta Ads'
]

const CATEGORIES_INGRESO = ['Suscripciones', 'Servicios', 'Consultoría', 'Desarrollo']
const CATEGORIES_GASTO = ['Infraestructura', 'Marketing', 'Software', 'Honorarios']

export async function injectDemoData() {
    const supabase = await createClient()

    // Verify authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        throw new Error("No autenticado")
    }

    const numTransactions = Math.floor(Math.random() * 11) + 30 // 30 to 40
    
    const transactions = []
    const now = new Date()
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    for (let i = 0; i < numTransactions; i++) {
        const isIngreso = Math.random() > 0.4 // 60% chance of income
        
        let description = ''
        let amount = 0
        let category = ''
        const type = isIngreso ? 'Ingreso' : 'Gasto'
        
        if (isIngreso) {
            description = INGRESO_DESCRIPTIONS[Math.floor(Math.random() * INGRESO_DESCRIPTIONS.length)]
            amount = Math.floor(Math.random() * (1500000 - 300000 + 1)) + 300000
            category = CATEGORIES_INGRESO[Math.floor(Math.random() * CATEGORIES_INGRESO.length)]
        } else {
            description = GASTO_DESCRIPTIONS[Math.floor(Math.random() * GASTO_DESCRIPTIONS.length)]
            amount = Math.floor(Math.random() * (400000 - 15000 + 1)) + 15000
            category = CATEGORIES_GASTO[Math.floor(Math.random() * CATEGORIES_GASTO.length)]
        }

        const date = generateRandomDate(sixMonthsAgo, now).toISOString()

        transactions.push({
            user_id: user.id,
            description,
            amount,
            type,
            category,
            date,
        })
    }

    // Insert all into Supabase
    const { error } = await supabase
        .from("transactions")
        .insert(transactions)

    if (error) {
        console.error("Error injectando data de prueba:", error.message, error.details, error.hint)
        throw new Error(`Error de base de datos: ${error.message}`)
    }

    // Revalidate paths to update the dashboard
    revalidatePath('/')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/transacciones')

    return { success: true }
}
