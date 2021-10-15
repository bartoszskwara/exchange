import React, {FunctionComponent, useMemo, useState} from "react";
import TopBar from "./TopBar";
import {createUseStyles, useTheme} from "react-jss";
import {Theme} from "../../theme";
import {IExchangeContext} from "../../types/IExchangeContext";
import ExchangeAccountsManager from "../exchange/ExchangeAccountsManager";

const useStyles = createUseStyles((theme: Theme) => ({
    content: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: theme.background.primary,
        flex: 1
    }
}), { name: "layout" });


const initialExchangeContext: IExchangeContext = {
    currentRate: undefined,
    setCurrentRate: () => {},
};

export const ExchangeContext = React.createContext<IExchangeContext>(initialExchangeContext);

const Layout: FunctionComponent = () => {
    const classes = useStyles({ theme: useTheme<Theme>() });
    const [currentRate, setCurrentRate] = useState<number | undefined>(undefined);
    const context: IExchangeContext = useMemo(() => ({
        currentRate,
        setCurrentRate
    }), [currentRate, setCurrentRate]);

    return <>
        <TopBar />
        <div className={classes.content}>
            <ExchangeContext.Provider value={context}>
                <ExchangeAccountsManager />
            </ExchangeContext.Provider>
        </div>
    </>
};

export default Layout;