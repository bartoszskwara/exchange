import React, {FunctionComponent, useState} from "react";
import {createUseStyles, useTheme} from "react-jss";
import {IAccount} from "../../types/IAccount";
import {getCurrencyFormatted} from "./currencyHelper";
import CurrencyInput from 'react-currency-input-field';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import AccountList from "./AccountList";
import {Theme} from "../../theme";

const useStyles = createUseStyles((theme: Theme) => ({
    root: {
        background: theme.background.primary,
        padding: 12,
        borderRadius: 10
    },
    row: {
        display: "flex",
        justifyContent: "space-between"
    },
    account: {
        fontSize: 18,
        fontWeight: 700,
        cursor: "pointer"
    },
    inputWrapper: {
        fontWeight: 700
    },
    input: {
        fontSize: 18,
        fontWeight: 700,
        textAlign: "right",
        border: 0,
        backgroundColor: "transparent",
        color: theme.fontColor.primary,
        "&:focus-visible": {
            outline: 0
        }
    },
    balance: {
        fontSize: 12,
        color: theme.fontColor.secondary,
        marginTop: 5
    },
    warning: {
        fontSize: 14,
        color: theme.fontColor.warning
    },
    error: {
        background: theme.background.warning
    },
    expandIcon: {
        marginLeft: 5
    }
}), { name: "account" });

type Props = {
    value: string,
    account: IAccount,
    setAccount: (account: IAccount) => void,
    onInputChange: (value: string|undefined) => void,
    inputDisabled: boolean,
    error: boolean,
    prefix: string,
    maxLength?: number
}

const Account: FunctionComponent<Props> = ({ value, account, setAccount, onInputChange, inputDisabled, error, prefix, maxLength }) => {
    const classes = useStyles({ theme: useTheme<Theme>() });
    const [accountDropdownOpen, setAccountDropdownOpen] = useState<boolean>(false);
    const locale = navigator.language ? navigator.language : "en-US";
    return <div className={`${classes.root} ${error ? classes.error : ""}`}>
        {accountDropdownOpen && <AccountList setAccount={setAccount} onExit={() => setAccountDropdownOpen(false)}/>}
        <div className={classes.row}>
            <div className={classes.account} onClick={() => setAccountDropdownOpen(true)} data-testid={`account-root-${account.currency.name}`} >
                {account.currency.name}
                <FontAwesomeIcon className={classes.expandIcon} icon={faAngleDown} />
            </div>
            <div className={classes.inputWrapper}>
                <CurrencyInput
                    id={`account-${account.currency.name}`}
                    name={`account-${account.currency.name}`}
                    data-testid={`account-${account.currency.name}`}
                    className={classes.input}
                    value={value}
                    prefix={prefix}
                    placeholder="0"
                    decimalsLimit={2}
                    decimalScale={2}
                    disabled={inputDisabled}
                    onValueChange={(value, name) => onInputChange(value)}
                    maxLength={maxLength}
                    intlConfig={{
                        locale,
                        currency: account.currency.name
                    }}
                    allowNegativeValue={false}
                />
            </div>
        </div>
        <div className={classes.row}>
            <div className={classes.balance}>Balance: {getCurrencyFormatted({ val: account.balance, maximumFractionDigits: 2, currency: account.currency.name, locale })}</div>
            <div className={classes.warning}>{error && "exceeds balance"}</div>
        </div>
    </div>
};

export default Account;