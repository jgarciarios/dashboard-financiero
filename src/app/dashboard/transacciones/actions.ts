"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function createTransaction(formData: FormData) {
    const supabase = await createClient()

    // Verify authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        throw new Error("No autenticado")
    }

    // Extract form data
    const description = formData.get("description") as string
    const amountStr = formData.get("amount") as string
    const type = formData.get("type") as string
    const category = formData.get("category") as string
    const rawDate = formData.get("date") as string

    if (!description || !amountStr || !type || !category || !rawDate) {
        throw new Error("Faltan campos obligatorios")
    }

    const amount = parseFloat(amountStr)

    // Insert into Supabase
    const { error } = await supabase
        .from("transactions")
        .insert([
            {
                user_id: user.id,
                description,
                amount,
                type,
                category,
                date: rawDate,
            },
        ])

    if (error) {
        console.error("Error insertando la transacción:", error.message, error.details, error.hint)
        throw new Error(`Error de base de datos: ${error.message}`)
    }

    // Reload the cache for this route
    revalidatePath('/dashboard/transacciones')

    return { success: true }
}

export async function deleteTransaction(id: string) {
    const supabase = await createClient()

    // Verify authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        throw new Error("No autenticado")
    }

    // Delete from Supabase
    const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id)

    if (error) {
        console.error("Error eliminando la transacción:", error.message, error.details, error.hint)
        throw new Error(`Error de base de datos: ${error.message}`)
    }

    // Reload the cache for this route and the main dashboard
    revalidatePath('/dashboard/transacciones')
    revalidatePath('/')

    return { success: true }
}

export async function updateTransaction(id: string, formData: FormData) {
    const supabase = await createClient()

    // Verify authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        throw new Error("No autenticado")
    }

    // Extract form data
    const description = formData.get("description") as string
    const amountStr = formData.get("amount") as string
    const type = formData.get("type") as string
    const category = formData.get("category") as string
    const rawDate = formData.get("date") as string

    if (!description || !amountStr || !type || !category || !rawDate) {
        throw new Error("Faltan campos obligatorios")
    }

    const amount = parseFloat(amountStr)

    // Update in Supabase
    const { error } = await supabase
        .from("transactions")
        .update({
            description,
            amount,
            type,
            category,
            date: rawDate,
        })
        .eq("id", id)
        .eq("user_id", user.id) // Security check to ensure the user owns the transaction

    if (error) {
        console.error("Error actualizando la transacción:", error.message, error.details, error.hint)
        throw new Error(`Error de base de datos: ${error.message}`)
    }

    // Reload the cache for this route and the main dashboard
    revalidatePath('/dashboard/transacciones')
    revalidatePath('/')

    return { success: true }
}
