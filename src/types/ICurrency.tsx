export enum CurrencyType {
    EUR = "EUR",
    GBP = "GBP",
    USD = "USD"
}

export type ICurrency = {
    name: CurrencyType,
    description: string,
    symbol: string
}