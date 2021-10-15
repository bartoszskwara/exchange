import React, {FunctionComponent} from "react";
import {createUseStyles, useTheme} from "react-jss";
import {IAccount} from "../../types/IAccount";
import {getCurrencyFormatted} from "./currencyHelper";
import {Theme} from "../../theme";

const useStyles = createUseStyles((theme: Theme) => ({
    root: {
        display: "flex",
        alignItems: "center",
        padding: "5px 15px",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: theme.background.secondary,
            borderRadius: 4
        }
    },
    symbol: {
        background: theme.background.secondary700,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        color: theme.fontColor.accent,
        marginRight: 10,
        width: 40,
        height: 40
    },
    details: {
        padding: 5
    },
    heading: {
        fontWeight: 700,
        fontSize: 16
    },
    description: {
        fontSize: 12,
        color: theme.fontColor.secondary
    }
}), { name: "account-item" });

type Props = {
    account: IAccount,
    onClick: () => void
}

const AccountItem: FunctionComponent<Props> = ({ account, onClick }) => {
    const classes = useStyles({ theme: useTheme<Theme>() });
    return <div className={classes.root} onClick={onClick} data-testid={`account-item-${account.currency.name}`}>
        <div className={classes.symbol} >{account.currency.symbol}</div>
        <div className={classes.details}>
            <div className={classes.heading} data-testid={`account-item-name-${account.currency.name}`}>
                {account.currency.name}&nbsp;&bull;&nbsp;{getCurrencyFormatted({ val: account.balance, maximumFractionDigits: 2, currency: account.currency.name })}
            </div>
            <div className={classes.description}>{account.currency.description}</div>
        </div>
    </div>
}

export default AccountItem;