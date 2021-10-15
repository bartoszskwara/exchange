import {CurrencyType} from "./ICurrency";

export type IRates = {
    [key in CurrencyType]: number
}