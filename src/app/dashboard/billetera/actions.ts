"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function createAccount(formData: FormData) {
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
    const balanceRaw = formData.get("balance")?.toString()

    if (!name || !type || !balanceRaw) {
        throw new Error("Faltan campos obligatorios.")
    }

    const balance = parseFloat(balanceRaw)

    if (isNaN(balance)) {
        throw new Error("El saldo ingresado no es válido.")
    }

    const { error: insertError } = await supabase
        .from("accounts")
        .insert({
            user_id: user.id,
            name,
            type,
            balance
        })

    if (insertError) {
        console.error("Error inserting account:", insertError)
        throw new Error("Error al crear la cuenta.")
    }

    revalidatePath("/dashboard/billetera")
}
