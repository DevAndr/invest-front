import {Button} from "@/components/ui/button";
import {FC} from "react";
import {MetricKey, METRICS} from "@/components/admin/filters/Metrics/constants";

interface Props {
    currentMetric: MetricKey;
    oncClickMetric: (key: MetricKey) => void;
}

export const MetricFilters: FC<Props> = ({currentMetric, oncClickMetric}) => {
    return <div className="flex flex-wrap gap-1.5">
        {METRICS.map((m) => (
            <Button
                key={m.key}
                variant={currentMetric === m.key ? "default" : "outline"}
                size="xs"
                onClick={() => oncClickMetric(m.key)}
            >
                {m.label}
            </Button>
        ))}
    </div>
}
