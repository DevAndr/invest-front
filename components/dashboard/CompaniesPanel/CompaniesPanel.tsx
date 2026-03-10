'use client'

import {FC, useState, useMemo} from "react";
import {Search, Star, List} from "lucide-react";
import {Company} from "@/app/api/companies/types";
import {SelectedCompany} from "@/app/(dashboard)/companies/page";
import {useFavoriteIds} from "@/stores/favoritesStore";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {Spinner} from "@/components/ui/spinner";
import {CompanyCard} from "@/components/dashboard/CompaniesPanel/CompanyCard";


interface Props {
    search: string;
    isLoading: boolean;
    isProfitsLoading: boolean;
    companies: Company[];
    selectedIds: string[];
    selected: SelectedCompany[];
    onSearch: (value: string) => void
    toggleCompany: (company: Company) => void;
    onSetActiveCompanyForNotes: (company: { id: string, name: string }) => void;
    onCompareByIndustry: (industry: string) => void;
}

export const CompaniesPanel: FC<Props> = ({
                                              search,
                                              companies,
                                              isLoading,
                                              selectedIds,
                                              selected,
                                              onSearch,
                                              isProfitsLoading,
                                              toggleCompany,
                                              onSetActiveCompanyForNotes,
                                              onCompareByIndustry
                                          }) => {
    const [tab, setTab] = useState<"all" | "favorites">("all")
    const favoriteIds = useFavoriteIds()

    const displayedCompanies = useMemo(() => {
        if (tab === "favorites") {
            return companies.filter((c) => favoriteIds.includes(c.id))
        }
        return companies
    }, [tab, companies, favoriteIds])

    return <div className="space-y-4">
        <div className="relative">
            <InputGroup className="w-full">
                <InputGroupInput placeholder="Поиск компании..."
                                 value={search}
                                 onChange={(e) => onSearch(e.target.value)}
                />
                <InputGroupAddon>
                    <Search/>
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">найдено {displayedCompanies.length}</InputGroupAddon>
            </InputGroup>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg border border-border bg-muted/30 p-0.5">
            <button
                onClick={() => setTab("all")}
                className={`flex items-center gap-1.5 flex-1 justify-center rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    tab === "all"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                }`}
            >
                <List className="size-3.5"/>
                Все
            </button>
            <button
                onClick={() => setTab("favorites")}
                className={`flex items-center gap-1.5 flex-1 justify-center rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    tab === "favorites"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                }`}
            >
                <Star className={`size-3.5 ${tab === "favorites" ? "fill-amber-400 text-amber-400" : ""}`}/>
                Избранное
                {favoriteIds.length > 0 && (
                    <span className="ml-0.5 rounded-full bg-amber-400/15 text-amber-500 px-1.5 text-[10px] font-semibold tabular-nums">
                        {favoriteIds.length}
                    </span>
                )}
            </button>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Spinner/>
                    </div>
                ) : displayedCompanies.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                        {tab === "favorites" ? "Нет избранных компаний" : "Ничего не найдено"}
                    </div>
                ) : (
                    displayedCompanies.map((company) => {
                        const isSelected = selectedIds.includes(company.id)
                        const selectedEntry = selected.find((s) => s.company.id === company.id)
                        return (
                            <CompanyCard
                                key={company.id}
                                isSelected={isSelected}
                                company={company}
                                selectedEntry={selectedEntry}
                                isProfitsLoading={isProfitsLoading}
                                toggleCompany={toggleCompany}
                                onSetActiveCompanyForNotes={onSetActiveCompanyForNotes}
                                onCompareByIndustry={onCompareByIndustry}/>
                        )
                    })
                )}
            </div>
        </div>
    </div>
}