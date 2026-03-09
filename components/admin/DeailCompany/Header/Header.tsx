import {FC} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowLeft, Building2, Calendar, Globe, Tag} from "lucide-react";
import dayjs from "dayjs";
import {Company} from "@/app/api/companies/types";

interface Props {
    company: Company
}

export const Header: FC<Props> = ({company}) => {


    return (
        <div className="flex items-center gap-4">
            <Link href="/admin/companies">
                <Button variant="ghost" size="icon-xs">
                    <ArrowLeft className="size-4"/>
                </Button>
            </Link>
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-lg bg-muted">
                    <Building2 className="size-5 text-muted-foreground"/>
                </div>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">{company.name}</h1>
                    <div className="flex items-center gap-3 mt-0.5">
                        {company.ticker && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Tag className="size-3"/>
                                {company.ticker}
                                </span>
                        )}
                        {company.industry && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Building2 className="size-3"/>
                                {company.industry}
                                </span>
                        )}
                        {company.country && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Globe className="size-3"/>
                                {company.country}
                                </span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="size-3"/>
                            {dayjs(company.createdAt).format("DD.MM.YYYY")}
                            </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
