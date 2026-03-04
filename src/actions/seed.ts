"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function seedDemoData() {
    const supabase = await createClient()

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error("No estás autenticado. Por favor, inicia sesión.")
    }

    // 1. Insert Accounts
    const { data: accounts, error: accountsError } = await supabase
        .from("accounts")
        .insert([
            { user_id: user.id, name: 'Mercado Pago', type: 'Banco', balance: 250000, currency: 'ARS' },
            { user_id: user.id, name: 'Banco Galicia', type: 'Banco', balance: 800000, currency: 'ARS' },
            { user_id: user.id, name: 'Ahorros USD', type: 'Efectivo', balance: 1500, currency: 'USD' }
        ])
        .select()

    if (accountsError) {
        console.error("Error inserting accounts:", accountsError)
        throw new Error("Error al crear cuentas de demostración.")
    }

    // 2. Insert Budgets
    const { error: budgetsError } = await supabase
        .from("budgets")
        .insert([
            { user_id: user.id, category: 'Software', amount_limit: 50000 },
            { user_id: user.id, category: 'Comida', amount_limit: 150000 }
        ])

    if (budgetsError) {
        console.error("Error inserting budgets:", budgetsError)
        // Ignoring if already exists or throw
    }

    // 3. Generate Transactions
    const accountIds = accounts?.map(a => a.id) || [];
    const mpId = accountIds[0] || null;
    const galiciaId = accountIds[1] || null;
    const usdId = accountIds[2] || null;

    const today = new Date();

    // Helper to get date X days ago
    const getDateAgo = (days: number) => {
        const d = new Date(today);
        d.setDate(d.getDate() - days);
        return d.toISOString();
    }

    const demoTransactions = [
        { user_id: user.id, description: 'Desarrollo Freelance', amount: 450000, type: 'Ingreso', category: 'Ventas', date: getDateAgo(2), account_id: galiciaId },
        { user_id: user.id, description: 'Servidor AWS', amount: 15000, type: 'Gasto', category: 'Software', date: getDateAgo(3), account_id: mpId },
        { user_id: user.id, description: 'Supermercado', amount: 85000, type: 'Gasto', category: 'Comida', date: getDateAgo(5), account_id: galiciaId },
        { user_id: user.id, description: 'Suscripción GPT-4', amount: 20000, type: 'Gasto', category: 'Software', date: getDateAgo(7), account_id: mpId },
        { user_id: user.id, description: 'Cliente Exterior', amount: 1500, type: 'Ingreso', category: 'Ventas', date: getDateAgo(10), account_id: usdId },
        { user_id: user.id, description: 'Restaurante', amount: 35000, type: 'Gasto', category: 'Comida', date: getDateAgo(12), account_id: galiciaId },
        { user_id: user.id, description: 'Compra de Monitor', amount: 250000, type: 'Gasto', category: 'Software', date: getDateAgo(15), account_id: mpId },
        { user_id: user.id, description: 'Ahorro a USD', amount: 1000, type: 'Gasto', category: 'Otros', date: getDateAgo(18), account_id: usdId },
        { user_id: user.id, description: 'Publicidad FB', amount: 45000, type: 'Gasto', category: 'Marketing', date: getDateAgo(20), account_id: mpId },
        { user_id: user.id, description: 'Venta Curso', amount: 120000, type: 'Ingreso', category: 'Ventas', date: getDateAgo(22), account_id: mpId },
        { user_id: user.id, description: 'Uber', amount: 8000, type: 'Gasto', category: 'Otros', date: getDateAgo(25), account_id: mpId },
        { user_id: user.id, description: 'Pago Inicial Proyecto', amount: 300000, type: 'Ingreso', category: 'Ventas', date: getDateAgo(28), account_id: galiciaId },
    ];

    const { error: txError } = await supabase
        .from("transactions")
        .insert(demoTransactions)

    if (txError) {
        console.error("Error inserting transactions:", txError)
        throw new Error("Error al crear transacciones de demostración.")
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/transacciones")
    revalidatePath("/dashboard/billetera")
    revalidatePath("/dashboard/presupuestos")

    return { success: true }
}

export async function resetDemoData() {
    const supabase = await createClient()

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error("No estás autenticado. Por favor, inicia sesión.")
    }

    // 1. Delete transactions
    const { error: txError } = await supabase
        .from("transactions")
        .delete()
        .eq("user_id", user.id)

    if (txError) throw new Error("Error eliminando transacciones.")

    // 2. Delete budgets
    const { error: bgError } = await supabase
        .from("budgets")
        .delete()
        .eq("user_id", user.id)

    if (bgError) throw new Error("Error eliminando presupuestos.")

    // 3. Delete accounts
    const { error: accError } = await supabase
        .from("accounts")
        .delete()
        .eq("user_id", user.id)

    if (accError) throw new Error("Error eliminando cuentas.")

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/transacciones")
    revalidatePath("/dashboard/billetera")
    revalidatePath("/dashboard/presupuestos")

    return { success: true }
}
