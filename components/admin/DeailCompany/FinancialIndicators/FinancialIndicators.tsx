import {FC} from "react";
import {Minus, TrendingDown, TrendingUp} from "lucide-react";
import {useGetSummary} from "@/app/api/profits/useGetSummary";
import {formatPercent} from "@/utils/formatPercent";
import {isDefined} from "@/utils/isDefined";

interface Props {
    companyId: string
}

export const FinancialIndicators: FC<Props> = ({companyId}) => {
    const {data: summary} = useGetSummary(companyId)

    if (!isDefined(summary)) return null;

    const TrendIcon = summary?.trend === "growing" ? TrendingUp : summary?.trend === "declining" ? TrendingDown : Minus
    const trendColor = summary?.trend === "growing" ? "text-green-500" : summary?.trend === "declining" ? "text-red-500" : "text-muted-foreground"

    return <div className="grid grid-cols-4 gap-4">
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
}