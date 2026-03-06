export interface MoneyValue {
    currency: string
    units: string
    nano: number
}

export interface Quotation {
    units: string
    nano: number
}

export interface PortfolioPosition {
    figi: string
    instrumentType: string
    quantity: Quotation
    averagePositionPrice: MoneyValue
    expectedYield: Quotation
    currentPrice: MoneyValue
    averagePositionPriceFifo: MoneyValue
    quantityLots: Quotation
    blocked: boolean
    positionUid: string
    instrumentUid: string
    expectedYieldFifo: Quotation
    dailyYield: MoneyValue
    ticker: string
    classCode: string
}

export interface PortfolioResponse {
    totalAmountShares: MoneyValue
    totalAmountBonds: MoneyValue
    totalAmountEtf: MoneyValue
    totalAmountCurrencies: MoneyValue
    totalAmountFutures: MoneyValue
    totalAmountPortfolio: MoneyValue
    expectedYield: Quotation
    dailyYield: MoneyValue
    dailyYieldRelative: Quotation
    positions: PortfolioPosition[]
    accountId: string
}

/** Convert Tinkoff MoneyValue / Quotation to number */
export function toNumber(v: MoneyValue | Quotation): number {
    return Number(v.units) + v.nano / 1_000_000_000
}
