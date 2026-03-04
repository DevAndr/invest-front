import {FC} from "react";
import {Plus, StickyNote} from "lucide-react";
import {Company} from "@/app/api/companies/types";
import {SelectedCompany} from "@/app/(dashboard)/companies/page";

interface Props {
    isSelected: boolean;
    company: Company;
    selectedEntry: SelectedCompany | undefined
    isProfitsLoading: boolean;
    toggleCompany: (company: Company) => void;
    onSetActiveCompanyForNotes: (company: { id: string, name: string }) => void;
}

export const CompanyCard: FC<Props> = ({
                                           company,
                                           toggleCompany,
                                           isSelected,
                                           selectedEntry,
                                           isProfitsLoading,
                                           onSetActiveCompanyForNotes
                                       }) => {

    return <div
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
}