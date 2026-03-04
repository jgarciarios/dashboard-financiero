"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function createInvestment(formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error("No estás autenticado. Por favor, inicia sesión.")
    }

    const name = formData.get("name")?.toString()
    const type = formData.get("type")?.toString()
    const investedAmountRaw = formData.get("invested_amount")?.toString()
    const currentValueRaw = formData.get("current_value")?.toString()

    if (!name || !type || !investedAmountRaw || !currentValueRaw) {
        throw new Error("Faltan campos obligatorios.")
    }

    const invested_amount = parseFloat(investedAmountRaw)
    const current_value = parseFloat(currentValueRaw)

    if (isNaN(invested_amount) || invested_amount <= 0 || isNaN(current_value) || current_value < 0) {
        throw new Error("Los montos ingresados no son válidos.")
    }

    const { error: insertError } = await supabase
        .from("investments")
        .insert({
            user_id: user.id,
            name,
            type,
            invested_amount,
            current_value
        })

    if (insertError) {
        console.error("Error inserting investment:", insertError)
        throw new Error("Error al crear la inversión.")
    }

    revalidatePath("/dashboard/inversiones")
}
