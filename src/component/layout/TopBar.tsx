import React, {FunctionComponent, useContext} from "react";
import {createUseStyles, useTheme} from "react-jss";
import {Theme} from "../../theme";
import {AppContext} from "../../App";

const useStyles = createUseStyles((theme: Theme) => ({
    root: {
        padding: 20,
        backgroundColor: theme.background.accent,
        textAlign: "center",
        fontWeight: 700,
        display: "flex",
        justifyContent: "space-between",
        color: theme.fontColor.primary
    },
    toggle: {
        cursor: "pointer"
    }
}), { name: "top-bar" });

const TopBar: FunctionComponent = () => {
    const classes = useStyles({ theme: useTheme<Theme>() });
    const { toggleAppTheme } = useContext(AppContext);

    return <div className={classes.root}>
        <div>Money Exchange App</div>
        <div className={classes.toggle} onClick={toggleAppTheme}>TOGGLE THEME</div>
    </div>
};

export default TopBar;