"use client"

import {useState, useCallback} from "react"
import {Search, X, Plus, TrendingUp, Loader2} from "lucide-react"
import {Button} from "@/components/ui/button"
import {ProfitChart} from "@/components/dashboard/ProfitChart"
import {useGetCompanies} from "@/app/api/companies/useGetCompanies"
import {useGetProfitsByCompanyMutation} from "@/app/api/profits/useGetProfitsByCompany"
import type {Company} from "@/app/api/companies/types"
import type {FinancialData} from "@/app/api/profits/types"

const COMPANY_COLORS = [
    "#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6",
    "#ec4899", "#06b6d4", "#f97316",
]

interface SelectedCompany {
    company: Company
    profits: FinancialData[]
    color: string
}

function buildChartData(selected: SelectedCompany[]) {
    if (selected.length === 0) return []

    const periodsSet = new Set<string>()
    selected.forEach(({profits}) => {
        profits.forEach((p) => periodsSet.add(p.period))
    })

    const periods = Array.from(periodsSet).sort()

    return periods.map((period) => {
        const point: Record<string, string | number> = {quarter: period}
        selected.forEach(({company, profits}) => {
            const entry = profits.find((p) => p.period === period)
            if (entry) {
                point[company.ticker] = entry.netProfit
            }
        })
        return point
    })
}

export default function CompaniesPage() {
    const [search, setSearch] = useState("")
    const {data: companiesData, isLoading} = useGetCompanies({search: search || undefined})
    const {mutateAsync: getProfits, isPending: isProfitsLoading} = useGetProfitsByCompanyMutation()

    const [selected, setSelected] = useState<SelectedCompany[]>([])

    const companies = companiesData?.data ?? []

    const selectedIds = selected.map((s) => s.company.id)

    const toggleCompany = useCallback(async (company: Company) => {
        if (selectedIds.includes(company.id)) {
            setSelected((prev) => prev.filter((s) => s.company.id !== company.id))
            return
        }

        try {
            const profits = await getProfits({id: company.id})
            setSelected((prev) => [
                ...prev,
                {
                    company,
                    profits,
                    color: COMPANY_COLORS[prev.length % COMPANY_COLORS.length],
                },
            ])
        } catch (e) {
            console.error("Не удалось загрузить данные прибыли:", e)
        }
    }, [selectedIds, getProfits])

    const removeCompany = useCallback((id: string) => {
        setSelected((prev) => {
            const filtered = prev.filter((s) => s.company.id !== id)
            return filtered.map((s, i) => ({
                ...s,
                color: COMPANY_COLORS[i % COMPANY_COLORS.length],
            }))
        })
    }, [])

    const clearAll = useCallback(() => setSelected([]), [])

    const chartData = buildChartData(selected)

    console.log({companies, companiesData})

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Сравнение компаний</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Выберите компании для сравнения доходности и прибыли
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
                {/* Левая панель — выбор компаний */}
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Поиск компании..."
                            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div className="rounded-xl border border-border overflow-hidden">
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="size-5 animate-spin text-muted-foreground"/>
                                </div>
                            ) : companies.length === 0 ? (
                                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                                    Ничего не найдено
                                </div>
                            ) : (
                                companies.map((company) => {
                                    const isSelected = selectedIds.includes(company.id)
                                    const selectedEntry = selected.find((s) => s.company.id === company.id)
                                    return (
                                        <button
                                            key={company.id}
                                            onClick={() => toggleCompany(company)}
                                            disabled={isProfitsLoading}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors border-b border-border last:border-0 disabled:opacity-50 ${
                                                isSelected
                                                    ? "bg-accent/50"
                                                    : "hover:bg-muted/30"
                                            }`}
                                        >
                                            <div
                                                className="size-3 rounded-full shrink-0 border-2"
                                                style={{
                                                    backgroundColor: isSelected ? selectedEntry?.color : "transparent",
                                                    borderColor: isSelected ? selectedEntry?.color : "var(--border)",
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <span className="font-medium">{company.name}</span>
                                                <span className="text-muted-foreground ml-2 text-xs font-mono">{company.ticker}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{company.industry}</span>
                                            {!isSelected && (
                                                <Plus className="size-4 text-muted-foreground"/>
                                            )}
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Правая панель — график */}
                <div className="space-y-4">
                    {/* Выбранные компании */}
                    {selected.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {selected.map((s) => (
                                <span
                                    key={s.company.id}
                                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-2.5 py-1 text-xs font-medium"
                                >
                                    <span
                                        className="size-2 rounded-full"
                                        style={{backgroundColor: s.color}}
                                    />
                                    {s.company.ticker}
                                    <button
                                        onClick={() => removeCompany(s.company.id)}
                                        className="ml-0.5 hover:text-foreground text-muted-foreground"
                                    >
                                        <X className="size-3"/>
                                    </button>
                                </span>
                            ))}
                            <Button
                                variant="ghost"
                                size="xs"
                                onClick={clearAll}
                                className="text-muted-foreground"
                            >
                                Очистить
                            </Button>
                        </div>
                    )}

                    {/* График */}
                    <div className="rounded-xl border border-border bg-card p-5">
                        {selected.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                <TrendingUp className="size-10 mb-3 opacity-30"/>
                                <p className="text-sm">Выберите компании для сравнения</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <h2 className="text-sm font-medium text-muted-foreground">
                                    Чистая прибыль по периодам
                                </h2>
                                <ProfitChart
                                    data={chartData}
                                    companies={selected.map((s) => ({
                                        ticker: s.company.ticker,
                                        color: s.color,
                                    }))}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
