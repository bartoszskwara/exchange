import React, {FunctionComponent, useContext, useEffect, useState} from "react";
import {AppContext} from "../../App";
import Loader from "../Loader/Loader";
import {IAccount} from "../../types/IAccount";
import ExchangePanel from "./ExchangePanel";
import {AccountOrder} from "./AccountOrder";

const ExchangeAccountsManager: FunctionComponent = () => {
    const { accounts } = useContext(AppContext);
    const [primaryAccount, setPrimaryAccount] = useState<IAccount | undefined>(undefined);
    const [secondaryAccount, setSecondaryAccount] = useState<IAccount | undefined>(undefined);

    useEffect(() => {
        if(!accounts || accounts.length < 2) {
            return;
        }
        setPrimaryAccount(prevAccount => {
            if(!prevAccount) {
                return accounts[0];
            }
            return accounts.find(acc => acc.currency.name === prevAccount.currency.name);
        });
        setSecondaryAccount(prevAccount => {
            if(!prevAccount) {
                return accounts[1];
            }
            return accounts.find(acc => acc.currency.name === prevAccount.currency.name);
        });
    }, [accounts]);

    const changeAccount = (selectedAccount: AccountOrder) => (newAccount: IAccount) => {
        if(selectedAccount === AccountOrder.primary) {
            if(secondaryAccount && newAccount.currency.name === secondaryAccount.currency.name) {
                setPrimaryAccount(secondaryAccount);
                setSecondaryAccount(primaryAccount);
                return;
            }
            setPrimaryAccount(newAccount);
        } else {
            if(primaryAccount && newAccount.currency.name === primaryAccount.currency.name) {
                setPrimaryAccount(secondaryAccount);
                setSecondaryAccount(primaryAccount);
                return;
            }
            setSecondaryAccount(newAccount);
        }
    };

    return <>
        {(!primaryAccount || !secondaryAccount) && <Loader />}
        {(primaryAccount && secondaryAccount) &&
            <ExchangePanel
                primaryAccount={primaryAccount}
                secondaryAccount={secondaryAccount}
                changeAccount={changeAccount}
            />
        }
    </>
};

export default ExchangeAccountsManager;
