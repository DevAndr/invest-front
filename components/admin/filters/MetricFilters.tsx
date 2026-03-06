import {Button} from "@/components/ui/button";
import {FC} from "react";
import {MetricKey, METRICS} from "@/components/admin/filters/Metrics/constants";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

interface Props {
    currentMetric: MetricKey;
    oncClickMetric: (key: MetricKey) => void;
}

export const MetricFilters: FC<Props> = ({currentMetric, oncClickMetric}) => {
    return <div className="flex flex-wrap gap-1.5">
        {METRICS.map((m) => (
            <Tooltip key={m.key}>
                <TooltipTrigger>
                    <Button
                        key={m.key}
                        variant={currentMetric === m.key ? "default" : "outline"}
                        size="xs"
                        onClick={() => oncClickMetric(m.key)}
                    >
                        {m.label}
                    </Button>
                </TooltipTrigger>
                {
                    m.tooltip && <TooltipContent>
                        <p>{m.tooltip}</p>
                    </TooltipContent>
                }
            </Tooltip>

        ))}
    </div>
}
