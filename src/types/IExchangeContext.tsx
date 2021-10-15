export type IExchangeContext = {
    currentRate: number | undefined,
    setCurrentRate: (currentRate: number) => void
}