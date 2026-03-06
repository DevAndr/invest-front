"use client"

import {useGetPortfolio} from "@/app/api/tinkoff/useGetPortfolio"
import {toNumber} from "@/app/api/tinkoff/types"
import {Spinner} from "@/components/ui/spinner"
import {Wallet, ArrowUpRight, ArrowDownRight} from "lucide-react"

const fmt = (v: number) =>
    v.toLocaleString("ru-RU", {maximumFractionDigits: 2, minimumFractionDigits: 2})

export function PortfolioWidget() {
    const {data, isLoading} = useGetPortfolio()

    if (isLoading) {
        return (
            <div className="rounded-xl border border-border bg-card p-5 flex items-center justify-center py-8">
                <Spinner/>
            </div>
        )
    }

    if (!data) return null

    const totalPortfolio = toNumber(data.totalAmountPortfolio)
    const totalShares = toNumber(data.totalAmountShares)
    const dailyYield = toNumber(data.dailyYield)
    const dailyYieldRel = toNumber(data.dailyYieldRelative)
    const expectedYield = toNumber(data.expectedYield)

    const positions = data.positions
        .filter((p) => p.instrumentType === "share")
        .map((p) => {
            const qty = toNumber(p.quantity)
            const price = toNumber(p.currentPrice)
            const avgPrice = toNumber(p.averagePositionPrice)
            const yield_ = toNumber(p.expectedYield)
            const daily = toNumber(p.dailyYield)
            const totalValue = qty * price
            const yieldPct = avgPrice > 0 ? ((price - avgPrice) / avgPrice) * 100 : 0

            return {
                ticker: p.ticker,
                qty,
                price,
                avgPrice,
                yield: yield_,
                yieldPct,
                daily,
                totalValue,
            }
        })
        .sort((a, b) => b.totalValue - a.totalValue)

    const isDailyUp = dailyYield >= 0
    const isYieldUp = expectedYield >= 0

    return (
        <div className="rounded-xl border border-border bg-card p-5 space-y-5">
            <div className="flex items-center gap-2">
                <Wallet className="size-5 text-muted-foreground"/>
                <h3 className="text-sm font-semibold">Портфель</h3>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <SummaryCard label="Портфель" value={`${fmt(totalPortfolio)} ₽`}/>
                <SummaryCard label="Акции" value={`${fmt(totalShares)} ₽`}/>
                <SummaryCard
                    label="За день"
                    value={`${isDailyUp ? "+" : ""}${fmt(dailyYield)} ₽`}
                    sub={`${isDailyUp ? "+" : ""}${dailyYieldRel.toFixed(2)}%`}
                    positive={isDailyUp}
                />
                <SummaryCard
                    label="Общая доходность"
                    value={`${isYieldUp ? "+" : ""}${fmt(expectedYield)} %`}
                    positive={isYieldUp}
                />
            </div>

            {/* Positions table */}
            <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                        <th className="text-left font-medium px-3 py-2">Тикер</th>
                        <th className="text-right font-medium px-3 py-2">Кол-во</th>
                        <th className="text-right font-medium px-3 py-2">Цена</th>
                        <th className="text-right font-medium px-3 py-2">Ср. цена</th>
                        <th className="text-right font-medium px-3 py-2">Доходность</th>
                        <th className="text-right font-medium px-3 py-2">За день</th>
                    </tr>
                    </thead>
                    <tbody>
                    {positions.map((p) => {
                        const isUp = p.yield >= 0
                        const isDayUp = p.daily >= 0
                        return (
                            <tr key={p.ticker}
                                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                <td className="px-3 py-2">
                                    <span className="font-mono font-medium text-xs">{p.ticker}</span>
                                </td>
                                <td className="px-3 py-2 text-right tabular-nums">{p.qty}</td>
                                <td className="px-3 py-2 text-right tabular-nums">{fmt(p.price)}</td>
                                <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{fmt(p.avgPrice)}</td>
                                <td className="px-3 py-2 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {isUp
                                            ? <ArrowUpRight className="size-3 text-emerald-500"/>
                                            : <ArrowDownRight className="size-3 text-red-500"/>
                                        }
                                        <span
                                            className={`tabular-nums text-xs font-medium ${isUp ? "text-emerald-500" : "text-red-500"}`}>
                                            {isUp ? "+" : ""}{fmt(p.yield)} ₽
                                            <span
                                                className="ml-1 opacity-70">({isUp ? "+" : ""}{p.yieldPct.toFixed(1)}%)</span>
                                        </span>
                                    </div>
                                </td>
                                <td className={`px-3 py-2 text-right tabular-nums text-xs font-medium ${isDayUp ? "text-emerald-500" : "text-red-500"}`}>
                                    {isDayUp ? "+" : ""}{fmt(p.daily)} ₽
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function SummaryCard({label, value, sub, positive}: {
    label: string
    value: string
    sub?: string
    positive?: boolean
}) {
    return (
        <div className="rounded-lg border border-border p-3 space-y-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={`text-sm font-semibold tabular-nums ${positive !== undefined ? (positive ? "text-emerald-500" : "text-red-500") : ""}`}>
                {value}
            </p>
            {sub && (
                <p className={`text-xs tabular-nums ${positive ? "text-emerald-500" : "text-red-500"}`}>
                    {sub}
                </p>
            )}
        </div>
    )
}
