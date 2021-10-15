import {IAccount} from "../../../types/IAccount";
import {useEffect, useRef} from "react";
import {AccountOrder} from "../AccountOrder";

type Props = {
    secondaryInputValue: string,
    primaryAccount: IAccount,
    secondaryAccount: IAccount,
    primaryInputValue: string
}

export const useLastTouchedAccount = ({ primaryAccount, primaryInputValue, secondaryAccount, secondaryInputValue } : Props) => {
    const lastTouchedAccount = useRef<AccountOrder|undefined>(undefined);

    useEffect(() => {
        lastTouchedAccount.current = AccountOrder.primary;
    }, [primaryAccount, primaryInputValue]);

    useEffect(() => {
        lastTouchedAccount.current = AccountOrder.secondary;
    }, [secondaryAccount, secondaryInputValue]);

    return lastTouchedAccount;
};