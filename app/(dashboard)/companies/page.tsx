"use client"

import {useState, useCallback, useMemo} from "react"
import {X, TrendingUp} from "lucide-react"
import {Button} from "@/components/ui/button"
import {useGetCompanies} from "@/app/api/companies/useGetCompanies"
import {useGetProfitsByCompanyMutation} from "@/app/api/profits/useGetProfitsByCompany"
import type {Company} from "@/app/api/companies/types"
import type {FinancialData} from "@/app/api/profits/types"
import {MetricFilters} from "@/components/admin/filters/MetricFilters";
import {MetricKey, METRICS} from "@/components/admin/filters/Metrics/constants";
import {NotesPanel} from "@/components/dashboard/NotesPanel";
import {CompaniesPanel} from "@/components/dashboard/CompaniesPanel/CompaniesPanel";
import {MetricsWidget} from "@/components/dashboard/MetricsWidget";
import {AnalysisWidget} from "@/components/dashboard/AnalysisWidget";
import {PortfolioDashboard} from "@/components/dashboard/PortfolioDashboard";
import Link from "next/link";
import {ProfitChart} from "@/components/dashboard/ProfitChart";

const COMPANY_COLORS = [
    "#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6",
    "#ec4899", "#06b6d4", "#f97316",
]

export interface SelectedCompany {
    company: Company
    profits: FinancialData[]
    color: string
}

function buildChartData(selected: SelectedCompany[], metric: MetricKey) {
    if (selected.length === 0) return []

    const periodsSet = new Set<string>()
    selected.forEach(({profits}) => {
        profits.forEach((p) => periodsSet.add(p.period))
    })

    const periods = Array.from(periodsSet).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
    )

    return periods.map((period) => {
        const point: Record<string, string | number | null> = {quarter: period}
        selected.forEach(({company, profits}) => {
            const entry = profits.find((p) => p.period === period)
            point[company.ticker] = entry ? entry[metric] : null
        })
        return point
    })
}

export default function CompaniesPage() {
    const [search, setSearch] = useState("")
    const {data: companiesData, isLoading} = useGetCompanies({search: search || undefined})
    const {mutateAsync: getProfits, isPending: isProfitsLoading} = useGetProfitsByCompanyMutation()

    const [selected, setSelected] = useState<SelectedCompany[]>([])
    const [metric, setMetric] = useState<MetricKey>("netProfit")
    const [activeCompanyForNotes, setActiveCompanyForNotes] = useState<{ id: string, name: string } | null>(null)
    const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null)

    const companies = companiesData?.data ?? []

    const selectedIds = selected.map((s) => s.company.id)

    const toggleCompany = useCallback(async (company: Company) => {
        if (selectedIds.includes(company.id)) {
            setSelected((prev) => prev.filter((s) => s.company.id !== company.id))
            return
        }

        try {
            const profits = await getProfits({id: company.id})
            setActiveAnalysisId(company.id)
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

    const clearAll = useCallback(() => {
        setSelected([]);
        setActiveAnalysisId(null);
    }, [])

    const compareByIndustry = useCallback(async (industry: string) => {
        const sameIndustry = companies.filter(
            (c) => c.industry === industry && !selectedIds.includes(c.id)
        )
        for (const company of sameIndustry) {
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
                console.error("Не удалось загрузить данные:", e)
            }
        }
    }, [companies, selectedIds, getProfits])

    const chartData = useMemo(() => buildChartData(selected, metric), [selected, metric])

    const activeMetricLabel = METRICS.find((m) => m.key === metric)?.label ?? ""

    return (
        <div className="space-y-6">
            <div className='flex justify-between'>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Сравнение компаний</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Выберите компании для сравнения доходности и прибыли
                    </p>
                </div>
                <div>
                    <Link href='/admin/companies' className='bg-gray-200 text-black rounded-sm py-1 px-2'>В админку</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
                {/* Левая панель — выбор компаний */}
                <CompaniesPanel
                    companies={companies}
                    toggleCompany={toggleCompany}
                    isProfitsLoading={isProfitsLoading}
                    isLoading={isLoading}
                    search={search}
                    selectedIds={selectedIds}
                    selected={selected}
                    onSearch={setSearch}
                    onSetActiveCompanyForNotes={(value) => setActiveCompanyForNotes(value)}
                    onCompareByIndustry={compareByIndustry}/>

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
                    <MetricFilters currentMetric={metric} oncClickMetric={(key) => setMetric(key)}/>
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
                                    {activeMetricLabel} по периодам
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

                    <MetricsWidget companyId={activeAnalysisId}/>
                    <AnalysisWidget companyId={activeAnalysisId}/>
                    <PortfolioDashboard/>
                </div>
            </div>

            <NotesPanel
                companyId={activeCompanyForNotes?.id ?? null}
                companyName={activeCompanyForNotes?.name ?? ""}
                open={!!activeCompanyForNotes}
                onClose={() => setActiveCompanyForNotes(null)}
            />
        </div>
    )
}
