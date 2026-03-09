import {FC} from "react";
import {useGetMetrics} from "@/app/api/profits/useGetMetrics";
import {formatNumber} from "@/utils/formatNumber";
import {Spinner} from "@/components/ui/spinner";
import {METRIC_KEYS, METRIC_LABELS} from "@/consts/detail-company.consts";

interface Props {
    companyId: string;
}

export const FinancialTable: FC<Props> = ({companyId}) => {
    const {data: metrics, isLoading: metricsLoading} = useGetMetrics(companyId)

    if (metricsLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spinner/>
            </div>
        )
    }

    return metrics && metrics.periods.length > 0 && (
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
    )
}