"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function createBudget(formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error("No estás autenticado. Por favor, inicia sesión.")
    }

    const category = formData.get("category")?.toString()
    const amountLimitRaw = formData.get("amount_limit")?.toString()

    if (!category || !amountLimitRaw) {
        throw new Error("Faltan campos obligatorios.")
    }

    const amount_limit = parseFloat(amountLimitRaw)

    if (isNaN(amount_limit) || amount_limit <= 0) {
        throw new Error("El monto debe ser un número positivo.")
    }

    const { error: insertError } = await supabase
        .from("budgets")
        .insert({
            user_id: user.id,
            category,
            amount_limit,
        })

    if (insertError) {
        console.error("Error inserting budget:", insertError)
        // Handle common errors like unique constraint violation (only 1 budget per category)
        if (insertError.code === "23505") {
            throw new Error("Ya existe un presupuesto para esta categoría.")
        }
        throw new Error("Error al crear el presupuesto.")
    }

    revalidatePath("/dashboard/presupuestos")
}
