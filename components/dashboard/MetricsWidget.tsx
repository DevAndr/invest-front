"use client"

import {useGetMetrics} from "@/app/api/profits/useGetMetrics"
import {MetricsData} from "@/app/api/profits/types"
import {ResponsiveContainer, AreaChart, Area} from "recharts"
import {Loader2} from "lucide-react"
import {Spinner} from "@/components/ui/spinner";

const METRIC_LABELS: Record<keyof MetricsData, string> = {
    revenue: "Выручка",
    netProfit: "Чистая прибыль",
    grossProfit: "Валовая прибыль",
    ebitda: "EBITDA",
    margin: "Маржа, %",
    evEbitda: "EV/EBITDA",
    roe: "ROE, %",
    pe: "P/E",
}

function getLastTwo(values: (number | null)[]): { last: number | null; prev: number | null } {
    const valid = values.filter((v): v is number => v !== null && v !== 0)
    const last = valid.length > 0 ? valid[valid.length - 1] : null
    const prev = valid.length > 1 ? valid[valid.length - 2] : null
    return {last, prev}
}

function SparkLine({values}: { values: (number | null)[] }) {
    const {last, prev} = getLastTwo(values)
    const isUp = last !== null && prev !== null && last >= prev
    const color = isUp ? "#22c55e" : "#ef4444"

    const data = values.map((v, i) => ({i, v}))

    return (
        <ResponsiveContainer width="100%" height={40}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.3}/>
                        <stop offset="100%" stopColor={color} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <Area
                    type="monotone"
                    dataKey="v"
                    stroke={color}
                    strokeWidth={1.5}
                    fill={`url(#grad-${color})`}
                    dot={false}
                    connectNulls
                    isAnimationActive={false}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}

interface MetricsWidgetProps {
    companyId: string | null
}

export function MetricsWidget({companyId}: MetricsWidgetProps) {
    const {data, isLoading} = useGetMetrics(companyId)

    if (!companyId) return null

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Spinner />
            </div>
        )
    }

    if (!data) return null

    const metricKeys = Object.keys(METRIC_LABELS) as (keyof MetricsData)[]

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {metricKeys.map((key) => {
                const values = data.metrics[key]
                const {last, prev} = getLastTwo(values)
                const isUp = last !== null && prev !== null && last >= prev
                const diff = last !== null && prev !== null && prev !== 0
                    ? (((last - prev) / Math.abs(prev)) * 100).toFixed(1)
                    : null

                return (
                    <div
                        key={key}
                        className="rounded-xl border border-border bg-card p-3 space-y-1"
                    >
                        <p className="text-xs text-muted-foreground truncate">{METRIC_LABELS[key]}</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-semibold tabular-nums">
                                {last !== null ? last.toLocaleString("ru-RU") : "—"}
                            </span>
                            {diff !== null && (
                                <span className={`text-xs font-medium ${isUp ? "text-emerald-500" : "text-red-500"}`}>
                                    {isUp ? "+" : ""}{diff}%
                                </span>
                            )}
                        </div>
                        <SparkLine values={values}/>
                    </div>
                )
            })}
        </div>
    )
}
