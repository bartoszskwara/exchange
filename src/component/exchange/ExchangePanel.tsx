import React, {FunctionComponent, useContext, useEffect, useState} from "react";
import {createUseStyles, useTheme} from "react-jss";
import {AppContext} from "../../App";
import {IAccount} from "../../types/IAccount";
import ExchangeRate from "./ExchangeRate";
import Account from "./Account";
import {ExchangeType} from "../../types/ExchangeType";
import ToggleExchange from "./ToggleExchange";
import {Theme} from "../../theme";
import {ExchangeContext} from "../layout/Layout";
import {AccountOrder} from "./AccountOrder";
import {useLastTouchedAccount} from "./hook/useLastTouchedAccount";

const useStyles = createUseStyles((theme: Theme) => ({
    root: {
        margin: 50,
        padding: 30,
        borderRadius: 10,
        border: `1px solid ${theme.border.primary}`,
        minWidth: 300,
        position: "relative",
        backgroundColor: theme.background.secondary,
        color: theme.fontColor.primary
    },
    heading: {
        fontSize: 22,
        fontWeight: 700,
    },
    exchangeButton: {
        backgroundColor: theme.background.accent,
        color: theme.fontColor.accent,
        border: 0,
        borderRadius: 10,
        padding: 10,
        width: "100%",
        marginTop: 50,
        fontWeight: 700,
        fontSize: 12,
        cursor: "pointer"
    },
    buttonDisabled: {
        composes: "$exchangeButton",
        opacity: 0.3,
        cursor: "default"
    }
}), { name: "exchange-panel" });

type Props = {
    primaryAccount: IAccount,
    secondaryAccount: IAccount,
    changeAccount: (selectedAccount: AccountOrder) => (newAccount: IAccount) => void
}

const ExchangePanel: FunctionComponent<Props> = ({ primaryAccount, secondaryAccount, changeAccount }) => {
    const classes = useStyles({ theme: useTheme<Theme>() });
    const { setAccountBalance } = useContext(AppContext);
    const { currentRate } = useContext(ExchangeContext);
    const [exchangeType, setExchangeType] = useState<ExchangeType>(ExchangeType.sell);
    const [primaryInputValue, setPrimaryInputValue] = useState<string>("");
    const [secondaryInputValue, setSecondaryInputValue] = useState<string>("");
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
    const [error, setError] = useState<{ primary: boolean, secondary: boolean}>({ primary: false, secondary: false });
    const lastTouchedAccount = useLastTouchedAccount({ primaryAccount, secondaryAccount, secondaryInputValue, primaryInputValue });

    useEffect(() => {
        if(lastTouchedAccount.current === AccountOrder.primary) {
            setSecondaryInputValue(primaryInputValue ? `${Math.round(((Number(primaryInputValue) * Number(currentRate)) + Number.EPSILON) * 100) / 100}` : "");
        } else {
            setPrimaryInputValue(secondaryInputValue ? `${Math.round(((Number(secondaryInputValue) / Number(currentRate)) + Number.EPSILON) * 100) / 100}` : "");
        }
    }, [currentRate]);

    useEffect(() => {
        setError(prevError => ({
            ...prevError,
            primary: !!Number(primaryInputValue) && Number(primaryInputValue) > primaryAccount.balance && exchangeType === ExchangeType.sell
        }));
        setError(prevError => ({
            ...prevError,
            secondary: !!Number(secondaryInputValue) && Number(secondaryInputValue) > secondaryAccount.balance && exchangeType === ExchangeType.buy
        }));
    }, [primaryInputValue, secondaryInputValue, exchangeType, primaryAccount, secondaryAccount]);

    useEffect(() => {
        if(primaryInputValue && secondaryInputValue && !error.primary && !error.secondary) {
            setSubmitDisabled(false);
        } else {
            setSubmitDisabled(true);
        }
    }, [error, primaryInputValue, secondaryInputValue]);

    const toggleExchangeType = () => setExchangeType(prevType => prevType === ExchangeType.sell ? ExchangeType.buy : ExchangeType.sell);
    const makeExchange = () => {
        const primaryAccountBalance = exchangeType === ExchangeType.sell ? (primaryAccount.balance || 0) - Number(primaryInputValue) : (primaryAccount.balance || 0) + Number(primaryInputValue);
        const secondaryAccountBalance = exchangeType === ExchangeType.sell ? (secondaryAccount.balance || 0) + Number(secondaryInputValue) : (secondaryAccount.balance || 0) - Number(secondaryInputValue);
        setAccountBalance({ accountCurrency: primaryAccount.currency.name, newBalance: primaryAccountBalance });
        setAccountBalance({ accountCurrency: secondaryAccount.currency.name, newBalance: secondaryAccountBalance });
        setPrimaryInputValue("");
        setSecondaryInputValue("");
    };

    return <>
        {(primaryAccount && secondaryAccount) &&
            <div className={classes.root}>
                <div className={classes.heading} data-testid="exchange-title">{exchangeType === ExchangeType.sell ? "Sell" : "Buy"} {primaryAccount.currency.name}</div>
                <ExchangeRate primary={primaryAccount.currency} secondary={secondaryAccount.currency}/>
                <Account
                    value={primaryInputValue}
                    account={primaryAccount}
                    setAccount={changeAccount(AccountOrder.primary)}
                    onInputChange={(value: string|undefined) => {
                        setPrimaryInputValue(value || "");
                        setSecondaryInputValue(value ? `${Math.round(((Number(value) * Number(currentRate)) + Number.EPSILON) * 100) / 100}` : "");
                    }}
                    inputDisabled={!currentRate}
                    error={error.primary}
                    prefix={!Number.isNaN(Number(primaryInputValue)) && exchangeType === ExchangeType.sell ? "-" : "+"}
                    maxLength={12}
                />
                <ToggleExchange
                    exchangeType={exchangeType}
                    onClick={toggleExchangeType}
                />
                <Account
                    value={secondaryInputValue}
                    account={secondaryAccount}
                    setAccount={changeAccount(AccountOrder.secondary)}
                    onInputChange={(value: string|undefined) => {
                        setSecondaryInputValue(value || "");
                        setPrimaryInputValue(value ? `${Math.round(((Number(value) / Number(currentRate)) + Number.EPSILON) * 100) / 100}` : "");
                    }}
                    inputDisabled={!currentRate}
                    error={error.secondary}
                    prefix={!Number.isNaN(Number(secondaryInputValue)) && exchangeType === ExchangeType.sell ? "+" : "-"}
                />
                <button
                    className={`${submitDisabled ? classes.buttonDisabled : classes.exchangeButton}`}
                    onClick={makeExchange}
                    disabled={submitDisabled}
                >
                    {exchangeType === ExchangeType.sell ?
                        `Sell ${primaryAccount.currency.name} for ${secondaryAccount.currency.name}` :
                        `Buy ${primaryAccount.currency.name} with ${secondaryAccount.currency.name}`}
                </button>
            </div>
        }
    </>
};

export default ExchangePanel;