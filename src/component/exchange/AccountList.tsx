import React, {FunctionComponent, useContext, useState} from "react";
import {createUseStyles, useTheme} from "react-jss";
import {IAccount} from "../../types/IAccount";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import {AppContext} from "../../App";
import AccountItem from "./AccountItem";
import {Theme} from "../../theme";

const useStyles = createUseStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.background.primary,
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 1
    },
    top: {
        display: "flex",
        alignItems: "center",
        padding: 15
    },
    searchInput: {
        border: 0,
        backgroundColor: "transparent",
        "&:focus-visible": {
            outline: 0
        },
        marginLeft: 20,
        padding: 5,
        fontSize: 18,
        "&::placeholder": {
            fontWeight: 700,
            color: theme.fontColor.primary,
        },
        "&:focus-visible::placeholder": {
            color: "transparent"
        }
    },
    icon: {
        cursor: "pointer"
    }
}), { name: "account-list" });

type Props = {
    setAccount: (account: IAccount) => void,
    onExit: () => void,
}

const AccountList: FunctionComponent<Props> = ({ setAccount, onExit }) => {
    const classes = useStyles({ theme: useTheme<Theme>() });
    const { accounts } = useContext(AppContext);
    const [searchKeyword, setSearchKeyword] = useState<string>("");

    return <div data-testid="account-list" className={classes.root}>
        <div className={classes.top}>
            <div data-testid="account-list-back" onClick={onExit}>
                <FontAwesomeIcon className={classes.icon} icon={faArrowLeft} onClick={onExit} />
            </div>
            <input
                autoFocus
                className={classes.searchInput}
                value={searchKeyword}
                onChange={({ target: { value } }) => setSearchKeyword(value)}
                placeholder={"Choose source"}
            />
        </div>
        {accounts && <>
            {accounts
                .filter(acc => !searchKeyword || (`${acc.currency.name}${acc.currency.description}`).toLowerCase().includes(searchKeyword.toLowerCase()))
                .map(acc => <AccountItem
                    key={acc.currency.name}
                    account={acc}
                    onClick={() => {
                        setAccount(acc);
                        onExit();
                    }}
                />)}
        </>}
    </div>
};

export default AccountList;