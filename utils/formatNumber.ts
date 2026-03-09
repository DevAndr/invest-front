export function formatNumber(n: number | null | undefined): string {
    if (n == null) return "—"
    if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} трлн`
    if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)} млрд`
    return `${n.toFixed(1)} млн`
}