"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateUserRole(targetUserId: string, newRole: 'free' | 'pro' | 'admin') {
    const supabase = await createClient()

    // Verify the current user is an admin
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("No estás autenticado.")
    }

    const { data: currentUserProfile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

    if (profileError || !currentUserProfile) {
        throw new Error("No tienes permisos suficientes.")
    }

    // Allow user to self-upgrade for the demo 'Smoke Test'
    const isSelfUpgrade = targetUserId === user.id && newRole === 'pro'

    if (currentUserProfile.role !== "admin" && !isSelfUpgrade) {
        throw new Error("No tienes permisos suficientes.")
    }

    // Update target user's role
    const { error: updateError } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", targetUserId)

    if (updateError) {
        console.error("Error updating role:", updateError)
        throw new Error("Hubo un error al actualizar el rol.")
    }

    // Revalidate admin page
    revalidatePath('/dashboard/admin')
    revalidatePath('/dashboard', 'layout')

    return { success: true }
}
