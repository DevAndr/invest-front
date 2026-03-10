import {FC} from "react";
import {GitCompareArrows, Plus, Star, StickyNote} from "lucide-react";
import {Company} from "@/app/api/companies/types";
import {SelectedCompany} from "@/app/(dashboard)/companies/page";
import {useFavoritesStore} from "@/stores/favoritesStore";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface Props {
    isSelected: boolean;
    company: Company;
    selectedEntry: SelectedCompany | undefined
    isProfitsLoading: boolean;
    toggleCompany: (company: Company) => void;
    onSetActiveCompanyForNotes: (company: { id: string, name: string }) => void;
    onCompareByIndustry: (industry: string) => void;
}

export const CompanyCard: FC<Props> = ({
                                           company,
                                           toggleCompany,
                                           isSelected,
                                           selectedEntry,
                                           isProfitsLoading,
                                           onSetActiveCompanyForNotes,
                                           onCompareByIndustry
                                       }) => {
    const isFavorite = useFavoritesStore((s) => s.ids.includes(company.id))
    const toggleFavorite = useFavoritesStore((s) => s.toggle)

    return <ContextMenu>
        <ContextMenuTrigger asChild>
            <div
                key={company.id}
                onClick={() => toggleCompany(company)}
                style={{pointerEvents: isProfitsLoading ? 'none' : 'initial'}}
                className={`group/company w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors border-b border-border last:border-0 disabled:opacity-50 cursor-pointer ${
                    isSelected
                        ? "bg-accent/50"
                        : "hover:bg-muted/30"
                }`}
            >
                <div
                    className="size-3 rounded-full shrink-0 border-2"
                    style={{
                        backgroundColor: isSelected ? selectedEntry?.color : "transparent",
                        borderColor: isSelected ? selectedEntry?.color : "var(--border)",
                    }}
                />
                <div className="flex-1 min-w-0">
                    <span className="font-medium">{company.name}</span>
                    <span
                        className="text-muted-foreground ml-2 text-xs font-mono">{company.ticker}</span>
                </div>
                <span className="text-xs text-muted-foreground">{company.industry}</span>
                <button onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(company.id)
                }}
                        className={`p-1 rounded hover:bg-muted cursor-pointer transition-opacity ${
                            isFavorite ? "opacity-100" : "opacity-0 group-hover/company:opacity-100"
                        }`}
                >
                    <Star className={`size-4 ${isFavorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}/>
                </button>
                <button onClick={(e) => {
                    e.stopPropagation()
                    onSetActiveCompanyForNotes({id: company.id, name: company.name})
                }}
                        className="opacity-0 group-hover/company:opacity-100 transition-opacity p-1 rounded hover:bg-muted cursor-pointer"
                >
                    <StickyNote className="size-4 text-muted-foreground"/>
                </button>
                {!isSelected && (
                    <Plus className="size-4 text-muted-foreground"/>
                )}
            </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
            <ContextMenuItem onClick={() => toggleFavorite(company.id)}>
                <Star className={`size-4 ${isFavorite ? "fill-amber-400 text-amber-400" : ""}`}/>
                {isFavorite ? "Убрать из избранного" : "В избранное"}
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onCompareByIndustry(company.industry)}>
                <GitCompareArrows className="size-4"/>
                Сравнить все в «{company.industry}»
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onSetActiveCompanyForNotes({id: company.id, name: company.name})}>
                <StickyNote className="size-4"/>
                Заметки
            </ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>
}
