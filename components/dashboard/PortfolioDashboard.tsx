"use client"

import {useState} from "react"
import {useGetPortfolio} from "@/app/api/tinkoff/useGetPortfolio"
import {toNumber} from "@/app/api/tinkoff/types"
import type {PortfolioResponse} from "@/app/api/tinkoff/types"
import {Spinner} from "@/components/ui/spinner"
import {
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    PieChart as PieChartIcon,
    BarChart3,
    Coins,
} from "lucide-react"
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts"

const fmt = (v: number) =>
    v.toLocaleString("ru-RU", {maximumFractionDigits: 2, minimumFractionDigits: 2})

const ASSET_COLORS: Record<string, string> = {
    "Акции": "#3b82f6",
    "Облигации": "#22c55e",
    "Фонды": "#f59e0b",
    "Валюта": "#8b5cf6",
    "Фьючерсы": "#ef4444",
}

const CURRENCY_COLORS: Record<string, string> = {
    rub: "#3b82f6",
    usd: "#22c55e",
    eur: "#f59e0b",
    cny: "#ef4444",
    hkd: "#8b5cf6",
}

const CURRENCY_LABELS: Record<string, string> = {
    rub: "RUB ₽",
    usd: "USD $",
    eur: "EUR €",
    cny: "CNY ¥",
    hkd: "HKD $",
}

const HOLDING_COLORS = [
    "#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6",
    "#ec4899", "#06b6d4", "#f97316", "#84cc16", "#6366f1",
]

type Tab = "overview" | "allocation" | "currency"

function buildAssetAllocation(data: PortfolioResponse) {
    const items = [
        {name: "Акции", value: toNumber(data.totalAmountShares)},
        {name: "Облигации", value: toNumber(data.totalAmountBonds)},
        {name: "Фонды", value: toNumber(data.totalAmountEtf)},
        {name: "Валюта", value: toNumber(data.totalAmountCurrencies)},
        {name: "Фьючерсы", value: toNumber(data.totalAmountFutures)},
    ]
    return items.filter((i) => i.value > 0)
}

function buildCurrencyAllocation(data: PortfolioResponse) {
    const map = new Map<string, number>()
    for (const p of data.positions) {
        const currency = p.currentPrice.currency.toLowerCase()
        const qty = toNumber(p.quantity)
        const price = toNumber(p.currentPrice)
        const value = qty * price
        map.set(currency, (map.get(currency) ?? 0) + value)
    }
    return Array.from(map.entries())
        .map(([currency, value]) => ({
            name: CURRENCY_LABELS[currency] ?? currency.toUpperCase(),
            value,
            key: currency,
        }))
        .filter((i) => i.value > 0)
        .sort((a, b) => b.value - a.value)
}

function buildTopHoldings(data: PortfolioResponse) {
    const positions = data.positions
        .filter((p) => p.instrumentType === "share")
        .map((p) => ({
            name: p.ticker,
            value: toNumber(p.quantity) * toNumber(p.currentPrice),
        }))
        .sort((a, b) => b.value - a.value)

    if (positions.length <= 8) return positions

    const top = positions.slice(0, 7)
    const rest = positions.slice(7).reduce((sum, p) => sum + p.value, 0)
    return [...top, {name: "Другие", value: rest}]
}

export function PortfolioDashboard() {
    const {data, isLoading} = useGetPortfolio()
    const [tab, setTab] = useState<Tab>("overview")

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

    const isDailyUp = dailyYield >= 0
    const isYieldUp = expectedYield >= 0

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

    const tabs: {key: Tab; label: string; icon: React.ReactNode}[] = [
        {key: "overview", label: "Обзор", icon: <Wallet className="size-4"/>},
        {key: "allocation", label: "Аллокация", icon: <PieChartIcon className="size-4"/>},
        {key: "currency", label: "Валюты", icon: <Coins className="size-4"/>},
    ]

    return (
        <div className="rounded-xl border border-border bg-card p-5 space-y-5">
            {/* Header with tabs */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BarChart3 className="size-5 text-muted-foreground"/>
                    <h3 className="text-sm font-semibold">Дашборд портфеля</h3>
                </div>
                <div className="flex gap-1 rounded-lg border border-border bg-muted/30 p-0.5">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                                tab === t.key
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {t.icon}
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary cards — always visible */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <SummaryCard label="Портфель" value={`${fmt(totalPortfolio)} ₽`}/>
                <SummaryCard label="Акции" value={`${fmt(totalShares)} ₽`}/>
                <SummaryCard
                    label="За день PnL"
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

            {/* Tab content */}
            {tab === "overview" && (
                <OverviewTab positions={positions}/>
            )}
            {tab === "allocation" && (
                <AllocationTab data={data} totalPortfolio={totalPortfolio}/>
            )}
            {tab === "currency" && (
                <CurrencyTab data={data}/>
            )}
        </div>
    )
}

/* ─── Overview Tab (positions table) ──────────────────── */

function OverviewTab({positions}: {
    positions: {
        ticker: string
        qty: number
        price: number
        avgPrice: number
        yield: number
        yieldPct: number
        daily: number
        totalValue: number
    }[]
}) {
    return (
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
    )
}

/* ─── Allocation Tab (asset type pie + top holdings pie) ── */

function AllocationTab({data, totalPortfolio}: {data: PortfolioResponse; totalPortfolio: number}) {
    const assetData = buildAssetAllocation(data)
    const holdingsData = buildTopHoldings(data)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Asset type pie */}
            <div className="space-y-3">
                <h4 className="text-xs font-medium text-muted-foreground">По типу актива</h4>
                <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={assetData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {assetData.map((entry) => (
                                    <Cell
                                        key={entry.name}
                                        fill={ASSET_COLORS[entry.name] ?? "#94a3b8"}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<PieTooltip total={totalPortfolio}/>}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
                    {assetData.map((item) => (
                        <LegendItem
                            key={item.name}
                            color={ASSET_COLORS[item.name] ?? "#94a3b8"}
                            label={item.name}
                            value={fmt(item.value)}
                            pct={((item.value / totalPortfolio) * 100).toFixed(1)}
                        />
                    ))}
                </div>
            </div>

            {/* Top holdings pie */}
            <div className="space-y-3">
                <h4 className="text-xs font-medium text-muted-foreground">Топ позиции</h4>
                <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={holdingsData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {holdingsData.map((entry, i) => (
                                    <Cell
                                        key={entry.name}
                                        fill={HOLDING_COLORS[i % HOLDING_COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<PieTooltip total={totalPortfolio}/>}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
                    {holdingsData.map((item, i) => (
                        <LegendItem
                            key={item.name}
                            color={HOLDING_COLORS[i % HOLDING_COLORS.length]}
                            label={item.name}
                            value={fmt(item.value)}
                            pct={((item.value / totalPortfolio) * 100).toFixed(1)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

/* ─── Currency Tab ────────────────────────────────────── */

function CurrencyTab({data}: {data: PortfolioResponse}) {
    const currencyData = buildCurrencyAllocation(data)
    const total = currencyData.reduce((s, i) => s + i.value, 0)

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5 items-center">
                {/* Pie chart */}
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={currencyData}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={75}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {currencyData.map((entry) => (
                                    <Cell
                                        key={entry.key}
                                        fill={CURRENCY_COLORS[entry.key] ?? "#94a3b8"}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<PieTooltip total={total}/>}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Currency bars */}
                <div className="space-y-3">
                    {currencyData.map((item) => {
                        const pct = total > 0 ? (item.value / total) * 100 : 0
                        return (
                            <div key={item.key} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-medium">{item.name}</span>
                                    <span className="tabular-nums text-muted-foreground">
                                        {fmt(item.value)} ₽ · {pct.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${pct}%`,
                                            backgroundColor: CURRENCY_COLORS[item.key] ?? "#94a3b8",
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

/* ─── Shared sub-components ───────────────────────────── */

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

function LegendItem({color, label, value, pct}: {
    color: string
    label: string
    value: string
    pct: string
}) {
    return (
        <div className="flex items-center gap-1.5 text-xs">
            <span className="size-2 rounded-full shrink-0" style={{backgroundColor: color}}/>
            <span className="font-medium">{label}</span>
            <span className="text-muted-foreground tabular-nums">{pct}%</span>
        </div>
    )
}

function PieTooltip({active, payload, total}: {active?: boolean; payload?: Array<{name: string; value: number}>; total: number}) {
    if (!active || !payload?.length) return null
    const item = payload[0]
    const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0"
    return (
        <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
            <p className="text-xs font-medium">{item.name}</p>
            <p className="text-xs tabular-nums text-muted-foreground">
                {fmt(item.value)} ₽ · {pct}%
            </p>
        </div>
    )
}
