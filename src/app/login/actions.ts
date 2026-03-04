'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Faltan credenciales' }
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const companyName = formData.get('companyName') as string

    if (!email || !password || !fullName || !companyName) {
        return { error: 'Por favor, completa todos los campos' }
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                company_name: companyName,
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    // Si Supabase requiere confirmación de email, el usuario no estará logueado aún
    // Redirigiremos de todos modos (o mostraremos mensaje en el UI)
    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
}

export async function logout() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/login')
}
