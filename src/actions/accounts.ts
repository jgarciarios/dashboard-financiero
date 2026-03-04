"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function createInitialAccount(name: string, balance: number) {
    const supabase = await createClient()

    // 1. Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error("Usuario no autenticado.")
    }

    // 2. Insert account
    const { data: account, error: insertError } = await supabase
        .from("accounts")
        .insert({
            user_id: user.id,
            name: name,
            type: "bank",    // default type for initial account
            balance: balance
        })
        .select()
        .single()

    if (insertError) {
        console.error("Error creating initial account:", insertError)
        throw new Error("No se pudo crear la cuenta inicial.")
    }

    // 3. Revalidate dashboard path to remove onboarding
    revalidatePath("/dashboard")

    return { success: true, account }
}
