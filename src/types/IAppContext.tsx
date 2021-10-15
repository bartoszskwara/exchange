import {IAccount} from "./IAccount";
import {CurrencyType} from "./ICurrency";

export type IAppContext = {
    accounts: IAccount[],
    setAccountBalance: ({accountCurrency, newBalance}: {accountCurrency: CurrencyType, newBalance: number}) => void,
    toggleAppTheme: () => void
}