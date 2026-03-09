"use client"

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    type TooltipProps,
} from "recharts"
import dayjs from "dayjs";

interface ProfitChartProps {
    data: Record<string, string | number | null>[]
    companies: {ticker: string; color: string}[]
}

function CustomTooltip({active, payload, label}: TooltipProps<number, string>) {
    if (!active || !payload?.length) return null

    return (
        <div className="rounded-lg border border-border bg-popover px-3 py-2.5 shadow-lg">
            <p className="text-xs font-semibold text-popover-foreground mb-1.5">
                {dayjs(label).format("DD.MM.YYYY")}
            </p>
            <div className="space-y-1">
                {payload.map((entry) => {
                    if (entry.value == null) return null
                    return (
                        <div key={entry.dataKey} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-1.5">
                                <span
                                    className="size-2 rounded-full"
                                    style={{backgroundColor: entry.color}}
                                />
                                <span className="text-xs text-muted-foreground">{entry.dataKey}</span>
                            </div>
                            <span className="text-xs font-medium text-popover-foreground tabular-nums">
                                {Number(entry.value).toLocaleString("ru-RU")}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export function ProfitChart({data, companies}: ProfitChartProps) {
    return (
        <div className="h-[600px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{top: 5, right: 10, left: 10, bottom: 40}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5}/>
                    <XAxis
                        dataKey="quarter"
                        tick={{fontSize: 11, fill: "var(--muted-foreground)"}}
                        axisLine={{stroke: "var(--border)"}}
                        tickLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval={0}
                        tickFormatter={(value: string) => dayjs(value).format("DD.MM.YYYY")}
                    />
                    <YAxis
                        tick={{fontSize: 12, fill: "var(--muted-foreground)"}}
                        axisLine={{stroke: "var(--border)"}}
                        tickLine={false}
                        width={45}
                    />
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{fontSize: "13px"}}
                    />
                    {companies.map((company) => (
                        <Line
                            key={company.ticker}
                            type="monotone"
                            dataKey={company.ticker}
                            stroke={company.color}
                            strokeWidth={2}
                            dot={{r: 4, fill: company.color}}
                            activeDot={{r: 6}}
                            connectNulls={true}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
