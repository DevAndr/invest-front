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
} from "recharts"
import dayjs from "dayjs"

interface ProfitChartProps {
    data: Record<string, string | number>[]
    companies: {ticker: string; color: string}[]
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
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "var(--popover)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            fontSize: "13px",
                            color: "var(--popover-foreground)",
                        }}
                        labelStyle={{
                            fontWeight: 600,
                            marginBottom: "4px",
                        }}
                    />
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
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
