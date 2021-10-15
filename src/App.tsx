import React, {FunctionComponent, useCallback, useEffect, useMemo, useState} from 'react';
import './App.css';
import Layout from "./component/layout/Layout";
import {IAppContext} from "./types/IAppContext";
import {IAccount} from "./types/IAccount";
import SampleAccounts from "./mock/SampleAccounts";
import {CurrencyType} from "./types/ICurrency";
import {ThemeProvider} from "react-jss";
import theme, {ThemeType} from "./theme";

const initialContext: IAppContext = {
    accounts: [],
    setAccountBalance: () => {},
    toggleAppTheme: () => {}
};

export const AppContext = React.createContext<IAppContext>(initialContext);

const App: FunctionComponent = () => {
    const [accounts, setAccounts] = useState<IAccount[]>([]);
    const [appTheme, setAppTheme] = useState<ThemeType>(ThemeType.light);

    useEffect(() => {
        //set initial accounts data after App is mounted
        //imitate loading data from server
        const timeout = setTimeout(() => {
            const savedAccounts = localStorage.getItem("accounts");
            const acc = savedAccounts ? JSON.parse(savedAccounts) as IAccount[] : SampleAccounts;
            setAccounts(acc);
        }, 1000);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if(accounts && accounts.length) {
            localStorage.setItem("accounts", JSON.stringify(accounts));
        }
    }, [accounts]);

    const setAccountBalance = useCallback(({ accountCurrency, newBalance } : {accountCurrency: CurrencyType, newBalance: number}): void => {
        setAccounts(prevAccounts => prevAccounts.map(acc => {
            if (acc.currency.name === accountCurrency) {
                return {
                    ...acc,
                    balance: newBalance
                }
            }
            return {...acc};
        }));
    }, []);

    const toggleAppTheme = useCallback(() => setAppTheme(appTheme === ThemeType.light ? ThemeType.dark : ThemeType.light), [appTheme]);

    const context: IAppContext = useMemo(() => ({
        accounts,
        setAccountBalance,
        toggleAppTheme
    }), [accounts, setAccountBalance, toggleAppTheme]);

    return (
        <ThemeProvider theme={appTheme === ThemeType.light ? theme.light : theme.dark}>
            <AppContext.Provider value={context}>
                <div className="App">
                    <Layout />
                </div>
            </AppContext.Provider>
        </ThemeProvider>
    );
}

export default App;
