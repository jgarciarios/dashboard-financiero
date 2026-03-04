import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Currency = 'ARS' | 'USD'

interface CurrencyState {
    currency: Currency
    mepRate: number | null
    isLoadingRate: boolean
    setCurrency: (c: Currency) => void
    fetchMepRate: () => Promise<void>
}

export const useCurrencyStore = create<CurrencyState>()(
    persist(
        (set, get) => ({
            currency: 'ARS',
            mepRate: null,
            isLoadingRate: false,
            setCurrency: (currency) => set({ currency }),
            fetchMepRate: async () => {
                // If we already have the rate for this session, we might skip or not depending on freshness reqs.
                // Let's re-fetch to ensure we have the latest.
                set({ isLoadingRate: true })
                try {
                    const response = await fetch('https://dolarapi.com/v1/dolares/mep')
                    const data = await response.json()
                    // Use standard sale ('venta') price for MEP
                    if (data && data.venta) {
                        set({ mepRate: data.venta, isLoadingRate: false })
                    } else {
                        set({ isLoadingRate: false })
                    }
                } catch (error) {
                    console.error("Failed to fetch MEP rate:", error)
                    set({ isLoadingRate: false })
                }
            },
        }),
        {
            name: 'currency-storage',
            // Only persist currency preference, exclude mep rate so it always fetches fresh data on full reload if needed.
            partialize: (state) => ({ currency: state.currency }),
        }
    )
)
