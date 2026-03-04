'use client'

import {FC} from "react";
import {Plus, Search, StickyNote} from "lucide-react";
import {Company} from "@/app/api/companies/types";
import {SelectedCompany} from "@/app/(dashboard)/companies/page";
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
                                              onSetActiveCompanyForNotes
                                          }) => {

    return <div className="space-y-4">
        <div className="relative">
            <InputGroup className="max-w-xs">
                <InputGroupInput placeholder="Поиск компании..."
                                 value={search}
                                 onChange={(e) => onSearch(e.target.value)}
                />
                <InputGroupAddon>
                    <Search/>
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">найдено {companies.length}</InputGroupAddon>
            </InputGroup>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Spinner/>
                    </div>
                ) : companies.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                        Ничего не найдено
                    </div>
                ) : (
                    companies.map((company) => {
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
                                onSetActiveCompanyForNotes={onSetActiveCompanyForNotes}/>
                        )
                    })
                )}
            </div>
        </div>
    </div>
}