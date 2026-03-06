"use client"

import {useGetAnalysis} from "@/app/api/profits/useGetAnalysis"
import type {MetricAnalysis, MetricStatus} from "@/app/api/profits/types"
import {Spinner} from "@/components/ui/spinner"
import {
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    MinusCircle,
    ArrowUpCircle,
} from "lucide-react"
import Image from "next/image";
import {isDefined} from "@/utils/isDefined";

const METRIC_LABELS: Record<string, string> = {
    revenue: "Выручка",
    netProfit: "Чистая прибыль",
    grossProfit: "Валовая прибыль",
    ebitda: "EBITDA",
    margin: "Маржа, %",
    evEbitda: "EV/EBITDA",
    roe: "ROE, %",
    pe: "P/E",
}

const STATUS_CONFIG: Record<MetricStatus, { color: string; bg: string; icon: typeof CheckCircle2; label: string }> = {
    excellent: {color: "text-emerald-500", bg: "bg-emerald-500/10", icon: ArrowUpCircle, label: "Отлично"},
    good: {color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle2, label: "Хорошо"},
    normal: {color: "text-blue-500", bg: "bg-blue-500/10", icon: MinusCircle, label: "Норма"},
    poor: {color: "text-amber-500", bg: "bg-amber-500/10", icon: AlertTriangle, label: "Слабо"},
    critical: {color: "text-red-500", bg: "bg-red-500/10", icon: XCircle, label: "Критично"},
}

function MetricCard({name, metric}: { name: string; metric: MetricAnalysis }) {
    const config = STATUS_CONFIG[metric.status]

    if (!isDefined(config)) {
        return null
    }

    const Icon = config.icon

    return (
        <div className="flex items-start gap-3 rounded-lg border border-border p-3">
            <div className={`mt-0.5 rounded-md p-1.5 ${config.bg}`}>
                <Icon className={`size-4 ${config.color}`}/>
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs text-muted-foreground">{name}</span>
                    <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                </div>
                <p className="text-sm font-semibold tabular-nums">
                    {metric.value.toLocaleString("ru-RU")}
                </p>
                <p className="text-xs text-muted-foreground leading-snug">{metric.description}</p>
            </div>
        </div>
    )
}

interface AnalysisWidgetProps {
    companyId: string | null
}

export function AnalysisWidget({companyId}: AnalysisWidgetProps) {
    const {data, isLoading} = useGetAnalysis()

    if (!companyId) return null

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Spinner/>
            </div>
        )
    }

    const company = data?.find((c) => c.companyId === companyId)
    if (!company) return null;

    const metricKeys = Object.keys(METRIC_LABELS)

    const goodCount = metricKeys.filter(
        (k) => company.metrics[k as keyof typeof company.metrics].status === "excellent" ||
            company.metrics[k as keyof typeof company.metrics].status === "good"
    ).length
    const badCount = metricKeys.filter(
        (k) => company.metrics[k as keyof typeof company.metrics].status === "poor" ||
            company.metrics[k as keyof typeof company.metrics].status === "critical"
    ).length

    return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold flex items-center">
                        {company.logo && <img className='mr-2' src={company.logo} alt={'logo'} width={16} height={16} />}
                        <span>{company.companyName}</span>
                        <span className="ml-2 text-xs font-mono text-muted-foreground">{company.ticker}</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {company.industry} &middot; {company.periodType}
                    </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-emerald-500">
                        <TrendingUp className="size-3.5"/>{goodCount}
                    </span>
                    <span className="flex items-center gap-1 text-red-500">
                        <TrendingDown className="size-3.5"/>{badCount}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {metricKeys.map((key) => (
                    <MetricCard
                        key={key}
                        name={METRIC_LABELS[key]}
                        metric={company.metrics[key as keyof typeof company.metrics]}
                    />
                ))}
            </div>
        </div>
    )
}
