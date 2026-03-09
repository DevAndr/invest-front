"use client"

import {use, useState} from "react"
import Link from "next/link"
import {
    ArrowLeft,
    Building2,
    Globe,
    Tag,
    Calendar,
    TrendingUp,
    TrendingDown,
    Minus,
    MessageSquare,
    Trash2,
    Send,
} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Spinner} from "@/components/ui/spinner"
import {useGetCompany} from "@/app/api/companies/useGetCompany"
import {useGetMetrics} from "@/app/api/profits/useGetMetrics"
import {useGetSummary} from "@/app/api/profits/useGetSummary"
import {useGetNotes} from "@/app/api/notes/useGetNotes"
import {useCreateNote} from "@/app/api/notes/useCreateNote"
import {useDeleteNote} from "@/app/api/notes/useDeleteNote"
import {toast} from "sonner"
import dayjs from "dayjs"
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts"

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

const METRIC_KEYS = Object.keys(METRIC_LABELS)

function formatNumber(n: number | null | undefined): string {
    if (n == null) return "—"
    if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} трлн`
    if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)} млрд`
    return `${n.toFixed(1)} млн`
}

function formatPercent(n: number | null | undefined): string {
    if (n == null) return "—"
    return `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`
}

export default function CompanyDetailPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params)
    const [selectedMetric, setSelectedMetric] = useState("revenue")
    const [noteText, setNoteText] = useState("")

    const {data: company, isLoading: companyLoading} = useGetCompany(id)
    const {data: metrics, isLoading: metricsLoading} = useGetMetrics(id)
    const {data: summary} = useGetSummary(id)
    const {data: notes} = useGetNotes(id)
    const {mutate: createNote, isPending: creatingNote} = useCreateNote()
    const {mutate: deleteNote} = useDeleteNote()

    if (companyLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spinner/>
            </div>
        )
    }

    if (!company) {
        return (
            <div className="space-y-4">
                <Link href="/admin/companies" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4"/>
                    Назад к списку
                </Link>
                <p className="text-muted-foreground">Компания не найдена</p>
            </div>
        )
    }

    const chartData = metrics
        ? metrics.periods.map((period, i) => ({
            period,
            value: metrics.metrics[selectedMetric as keyof typeof metrics.metrics]?.[i] ?? null,
        }))
        : []

    const isRatioMetric = ["margin", "evEbitda", "roe", "pe"].includes(selectedMetric)

    const handleCreateNote = () => {
        if (!noteText.trim()) return
        createNote(
            {companyId: id, content: noteText.trim()},
            {
                onSuccess: () => {
                    setNoteText("")
                    toast.success("Заметка добавлена")
                },
            }
        )
    }

    const handleDeleteNote = (noteId: string) => {
        deleteNote(
            {companyId: id, noteId},
            {onSuccess: () => toast.success("Заметка удалена")}
        )
    }

    const TrendIcon = summary?.trend === "growing" ? TrendingUp : summary?.trend === "declining" ? TrendingDown : Minus
    const trendColor = summary?.trend === "growing" ? "text-green-500" : summary?.trend === "declining" ? "text-red-500" : "text-muted-foreground"

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/companies">
                    <Button variant="ghost" size="icon-xs">
                        <ArrowLeft className="size-4"/>
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-muted">
                        <Building2 className="size-5 text-muted-foreground"/>
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{company.name}</h1>
                        <div className="flex items-center gap-3 mt-0.5">
                            {company.ticker && (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Tag className="size-3"/>
                                    {company.ticker}
                                </span>
                            )}
                            {company.industry && (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Building2 className="size-3"/>
                                    {company.industry}
                                </span>
                            )}
                            {company.country && (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Globe className="size-3"/>
                                    {company.country}
                                </span>
                            )}
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="size-3"/>
                                {dayjs(company.createdAt).format("DD.MM.YYYY")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary cards */}
            {summary && (
                <div className="grid grid-cols-4 gap-4">
                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-xs text-muted-foreground">Рост выручки (YoY)</p>
                        <p className={`text-lg font-semibold mt-1 ${summary.growth.revenueYoY >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {formatPercent(summary.growth.revenueYoY)}
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-xs text-muted-foreground">Рост прибыли (YoY)</p>
                        <p className={`text-lg font-semibold mt-1 ${summary.growth.profitYoY >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {formatPercent(summary.growth.profitYoY)}
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-xs text-muted-foreground">Средняя маржа</p>
                        <p className="text-lg font-semibold mt-1">
                            {`${summary.averageMargin.toFixed(1)}%`}
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-xs text-muted-foreground">Тренд</p>
                        <div className="flex items-center gap-2 mt-1">
                            <TrendIcon className={`size-5 ${trendColor}`}/>
                            <span className={`text-lg font-semibold ${trendColor}`}>
                                {summary.trend === "growing" ? "Рост" : summary.trend === "declining" ? "Снижение" : "Стабильно"}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Chart */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium">Динамика показателей</h2>
                    <div className="flex flex-wrap gap-1">
                        {METRIC_KEYS.map((key) => (
                            <button
                                key={key}
                                onClick={() => setSelectedMetric(key)}
                                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                                    selectedMetric === key
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {METRIC_LABELS[key]}
                            </button>
                        ))}
                    </div>
                </div>

                {metricsLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Spinner/>
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                        Нет данных
                    </div>
                ) : (
                    <div style={{width: "100%", height: 300}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border"/>
                                <XAxis
                                    dataKey="period"
                                    tick={{fontSize: 11}}
                                    tickLine={false}
                                    axisLine={false}
                                    className="fill-muted-foreground"
                                />
                                <YAxis
                                    tick={{fontSize: 11}}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(v) => isRatioMetric ? `${v}` : formatNumber(v)}
                                    className="fill-muted-foreground"
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                    }}
                                    formatter={(value: number) => [
                                        isRatioMetric ? value?.toFixed(2) : formatNumber(value),
                                        METRIC_LABELS[selectedMetric],
                                    ]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#6366f1"
                                    fill="url(#colorValue)"
                                    strokeWidth={2}
                                    connectNulls
                                    isAnimationActive={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Financial data table */}
            {metrics && metrics.periods.length > 0 && (
                <div className="rounded-xl border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-border bg-muted/50">
                            <th className="text-left font-medium text-muted-foreground px-4 py-3">Показатель</th>
                            {metrics.periods.map((p) => (
                                <th key={p} className="text-right font-medium text-muted-foreground px-4 py-3">
                                    {p}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {METRIC_KEYS.map((key) => {
                            const values = metrics.metrics[key as keyof typeof metrics.metrics]
                            return (
                                <tr key={key} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-2.5 font-medium">{METRIC_LABELS[key]}</td>
                                    {values?.map((v, i) => (
                                        <td key={i} className="px-4 py-2.5 text-right tabular-nums">
                                            {v != null
                                                ? ["margin", "roe"].includes(key)
                                                    ? `${v.toFixed(1)}%`
                                                    : ["evEbitda", "pe"].includes(key)
                                                        ? v.toFixed(2)
                                                        : formatNumber(v)
                                                : "—"}
                                        </td>
                                    ))}
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Notes */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                <div className="flex items-center gap-2">
                    <MessageSquare className="size-4 text-muted-foreground"/>
                    <h2 className="text-sm font-medium">Заметки</h2>
                    {notes && notes.length > 0 && (
                        <span className="text-xs text-muted-foreground">({notes.length})</span>
                    )}
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreateNote()}
                        placeholder="Добавить заметку..."
                        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <Button size="sm" onClick={handleCreateNote} disabled={creatingNote || !noteText.trim()}>
                        {creatingNote ? <Spinner data-icon="inline-start"/> : <Send className="size-4"/>}
                    </Button>
                </div>

                {notes && notes.length > 0 ? (
                    <div className="space-y-2">
                        {notes.map((note) => (
                            <div key={note.id} className="flex items-start gap-3 rounded-lg bg-muted/30 px-3 py-2.5">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm">{note.content}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {note.user?.name ?? "Пользователь"} &middot; {dayjs(note.createdAt).format("DD.MM.YYYY HH:mm")}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => handleDeleteNote(note.id)}
                                    className="text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 className="size-3.5"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-muted-foreground">Нет заметок</p>
                )}
            </div>
        </div>
    )
}
