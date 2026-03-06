type Company = {
    id: string;
    name: string;
}

type ImportResult = {
    company: Company;
    imported: number;
    skipped: number;
    errors: Array<string>;
}