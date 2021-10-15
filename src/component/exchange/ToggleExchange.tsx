import React, {FunctionComponent} from "react";
import {createUseStyles, useTheme} from "react-jss";
import {ExchangeType} from "../../types/ExchangeType";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import {Theme} from "../../theme";

const useStyles = createUseStyles((theme: Theme) => ({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 12
    },
    toggle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.background.primary,
        borderRadius: "50%",
        width: 22,
        height: 22,
        border: `4px solid ${theme.background.secondary}`,
        cursor: "pointer"
    },
    icon: {
        fontSize: 12,
        color: theme.fontColor.info
    }
}), { name: "toggle-exchange" });

type Props = {
    onClick: () => void,
    exchangeType: ExchangeType
}

const ToggleExchange: FunctionComponent<Props> = ({ onClick, exchangeType }) => {
    const classes = useStyles({ theme: useTheme<Theme>() });
    return <div className={classes.container}>
        <div data-testid="toggle-exchange" className={classes.toggle} onClick={onClick}>
            {exchangeType === ExchangeType.sell ?
                <FontAwesomeIcon className={classes.icon} icon={faArrowDown} /> :
                <FontAwesomeIcon className={classes.icon} icon={faArrowUp} />}
        </div>
    </div>
};

export default ToggleExchange;