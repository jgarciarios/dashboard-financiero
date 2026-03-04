import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
    // Isotipo: The Growth Loop ('F' con flecha ascendente)
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00D1FF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("text-[#00D1FF]", className)}
        >
            {/* Tallo y curva superior de la F proyectándose hacia arriba a la derecha */}
            <path d="M7 21 V7 C7 5 8 4 10 4 L18 2" />
            {/* Punta de la flecha (Growth) */}
            <path d="M13 2 H18 V7" />
            {/* Barra media de la F */}
            <path d="M7 12 H14" />
        </svg>
    )
}
