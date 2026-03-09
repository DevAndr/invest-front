import {FC, useState} from "react";
import {Spinner} from "@/components/ui/spinner";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {formatNumber} from "@/utils/formatNumber";
import {useGetMetrics} from "@/app/api/profits/useGetMetrics";
import {METRIC_KEYS, METRIC_LABELS} from "@/consts/detail-company.consts";

interface Props {
    companyId: string
}

export const FinancialChart: FC<Props> = ({companyId}) => {
    const [selectedMetric, setSelectedMetric] = useState("revenue")
    const {data: metrics, isLoading: metricsLoading} = useGetMetrics(companyId)

    const chartData = metrics
        ? metrics.periods.map((period, i) => ({
            period,
            value: metrics.metrics[selectedMetric as keyof typeof metrics.metrics]?.[i] ?? null,
        }))
        : []

    const isRatioMetric = ["margin", "evEbitda", "roe", "pe"].includes(selectedMetric)

    return <div className="rounded-xl border border-border bg-card p-4 space-y-4">
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
                                backgroundColor: '#000000'
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
}