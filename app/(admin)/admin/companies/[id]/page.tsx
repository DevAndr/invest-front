"use client"

import {use} from "react"
import Link from "next/link"
import {
    ArrowLeft,
} from "lucide-react"
import {Spinner} from "@/components/ui/spinner"
import {useGetCompany} from "@/app/api/companies/useGetCompany"
import {Notes} from "@/components/admin/DeailCompany/Notes/Notes";
import {FinancialTable} from "@/components/admin/DeailCompany/FinancialTable/FinancialTable";
import {FinancialChart} from "@/components/admin/DeailCompany/FinancialChart/FinancialChart";
import {FinancialIndicators} from "@/components/admin/DeailCompany/FinancialIndicators/FinancialIndicators";
import {Header} from "@/components/admin/DeailCompany/Header/Header";

export default function CompanyDetailPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params)
    const {data: company, isLoading: companyLoading} = useGetCompany(id)


    if (companyLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spinner/>
            </div>
        )
    }

    if (!company) {
        return (
            <div className="space-y-4">
                <Link href="/admin/companies"
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4"/>
                    Назад к списку
                </Link>
                <p className="text-muted-foreground">Компания не найдена</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Header company={company}/>
            <FinancialIndicators companyId={id}/>
            <FinancialChart companyId={id}/>
            <FinancialTable companyId={id}/>
            <Notes companyId={id}/>
        </div>
    )
}
