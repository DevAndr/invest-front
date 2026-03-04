"use client"

import {useMemo} from "react"
import {LineChart, Line, XAxis, YAxis, CartesianGrid} from "recharts"
import dayjs from "dayjs"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from "@/components/ui/chart"

interface ShadcnProfitChartProps {
    data: Record<string, string | number | null>[]
    companies: { ticker: string; color: string }[]
}

export function ShadcnProfitChart({data, companies}: ShadcnProfitChartProps) {
    const chartConfig = useMemo<ChartConfig>(() => {
        const config: ChartConfig = {}
        companies.forEach((c) => {
            config[c.ticker] = {
                label: c.ticker,
                color: c.color,
            }
        })
        return config
    }, [companies])

    return (
        <ChartContainer config={chartConfig} className="h-[600px] w-full">
            <LineChart data={data} margin={{top: 5, right: 10, left: 10, bottom: 40}}>
                <CartesianGrid vertical={false}/>
                <XAxis
                    dataKey="quarter"
                    tickLine={false}
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                    tickFormatter={(value: string) => dayjs(value).format("DD.MM.YYYY")}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={50}
                    tickFormatter={(value: number) => value.toLocaleString("ru-RU")}
                />
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            labelFormatter={(value) => dayjs(value).format("DD.MM.YYYY")}
                            formatter={(value, name) => (
                                <div className="flex items-center justify-between gap-4 w-full">
                                    <div className="flex items-center gap-1.5">
                                        <span
                                            className="size-2.5 rounded-[2px] shrink-0"
                                            style={{backgroundColor: chartConfig[name as string]?.color}}
                                        />
                                        <span className="text-muted-foreground">
                                            {chartConfig[name as string]?.label ?? name}
                                        </span>
                                    </div>
                                    <span className="font-mono font-medium tabular-nums">
                                        {Number(value).toLocaleString("ru-RU")}
                                    </span>
                                </div>
                            )}
                        />
                    }
                />
                <ChartLegend content={<ChartLegendContent/>}/>
                {companies.map((company) => (
                    <Line
                        key={company.ticker}
                        type="monotone"
                        dataKey={company.ticker}
                        stroke={`var(--color-${company.ticker})`}
                        strokeWidth={2}
                        dot={{r: 4, fill: `var(--color-${company.ticker})`}}
                        activeDot={{r: 6}}
                        connectNulls={true}
                    />
                ))}
            </LineChart>
        </ChartContainer>
    )
}
