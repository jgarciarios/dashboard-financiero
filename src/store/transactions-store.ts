"use client"

import { create } from "zustand"
import { supabase } from "@/lib/supabase"

export type Transaction = {
    id: string
    fecha: string       // ISO date string, e.g. "2026-02-22"
    concepto: string
    monto: number       // always positive; sign determined by tipo
    tipo: "ingreso" | "egreso"
    estado: "completada" | "pendiente"
    categoria: string
}

type TransactionsState = {
    transactions: Transaction[]
    loading: boolean
    error: string | null
    fetchTransactions: () => Promise<void>
    addTransaction: (tx: Transaction) => Promise<boolean>
    deleteTransaction: (id: string) => Promise<boolean>
}

export const useTransactionStore = create<TransactionsState>((set) => ({
    transactions: [],
    loading: false,
    error: null,

    fetchTransactions: async () => {
        set({ loading: true, error: null })
        const { data, error } = await supabase
            .from("transactions")
            .select("*")
            .order("fecha", { ascending: false })

        if (error) {
            set({ loading: false, error: error.message })
            console.error("Error fetching transactions:", error.message)
            return
        }

        set({
            transactions: (data ?? []) as Transaction[],
            loading: false,
        })
    },

    addTransaction: async (tx) => {
        // Validate logged-in user to append the user_id for RLS policies
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            console.error("Error inserting transaction: No authenticated user found.")
            return false
        }

        const { error } = await supabase
            .from("transactions")
            .insert({
                user_id: user.id, // Mandatory column
                id: tx.id,
                fecha: tx.fecha,
                concepto: tx.concepto,
                monto: tx.monto,
                tipo: tx.tipo,
                estado: tx.estado,
                categoria: tx.categoria,
            })

        if (error) {
            console.error("Error inserting transaction:", error.message)
            return false
        }

        // Insert succeeded — update local state
        set((state) => ({
            transactions: [tx, ...state.transactions],
        }))
        return true
    },

    deleteTransaction: async (id) => {
        const { error } = await supabase
            .from("transactions")
            .delete()
            .eq("id", id)

        if (error) {
            console.error("Error deleting transaction:", error.message)
            return false
        }

        // Delete succeeded — update local state
        set((state) => ({
            transactions: state.transactions.filter((tx) => tx.id !== id),
        }))
        return true
    },
}))
