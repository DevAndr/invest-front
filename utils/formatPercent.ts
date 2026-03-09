export function formatPercent(n: number | null | undefined): string {
    if (n == null) return "—"
    return `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`
}