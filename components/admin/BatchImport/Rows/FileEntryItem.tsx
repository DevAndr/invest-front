import {FC} from "react";
import {FileIcon, X} from "lucide-react";
import {formatFileSize} from "@/utils/formatFileSize";
import {Button} from "@/components/ui/button";
import {FileEntry} from "@/app/(admin)/admin/import/page";
import type {CompanyInfo} from "@/app/api/upload/useImportBatchCSV";


interface Props {
    index: number
    entry: FileEntry
    removeEntry: (index: number) => void
    updateEntry: (index: number, field: keyof CompanyInfo, value: string) => void
}

export const FileEntryItem: FC<Props> = ({entry, index, removeEntry, updateEntry}) => {
    return (
        <div className="rounded-lg border border-border bg-card p-4"
        >
            <div className="flex items-start gap-3">
                <FileIcon className="size-5 text-muted-foreground shrink-0 mt-0.5"/>
                <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium truncate">
                                {entry.file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatFileSize(entry.file.size)}
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => removeEntry(index)}
                        >
                            <X className="size-4"/>
                        </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <input
                            type="text"
                            value={entry.companyName}
                            onChange={(e) =>
                                updateEntry(index, "companyName", e.target.value)
                            }
                            placeholder="Название компании *"
                            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <input
                            type="text"
                            value={entry.ticker}
                            onChange={(e) =>
                                updateEntry(index, "ticker", e.target.value.toUpperCase())
                            }
                            placeholder="Тикер"
                            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-mono uppercase placeholder:text-muted-foreground placeholder:normal-case placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <input
                            type="text"
                            value={entry.industry}
                            onChange={(e) =>
                                updateEntry(index, "industry", e.target.value)
                            }
                            placeholder="Отрасль"
                            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
