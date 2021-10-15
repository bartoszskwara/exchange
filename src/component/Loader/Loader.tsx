import React, {FunctionComponent} from "react";
import {createUseStyles} from "react-jss";

const useStyles = createUseStyles(() => ({
    root: {
        padding: 20
    }
}), { name: "loader" });

const Loader: FunctionComponent = () => {
    const classes = useStyles();
    return <div className={classes.root}>Loading...</div>
};

export default Loader;