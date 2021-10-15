import React, {FunctionComponent, useContext, useEffect, useMemo, useState} from "react";
import {createUseStyles, useTheme} from "react-jss";
import {ICurrency} from "../../types/ICurrency";
import Loader from "../Loader/Loader";
import {Api, apiCall, IApiBaseResponse} from "../../api/Api";
import {IRates} from "../../types/IRates";
import {getCurrencyFormatted} from "./currencyHelper";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'
import {Theme} from "../../theme";
import {ExchangeContext} from "../layout/Layout";


const useStyles = createUseStyles((theme: Theme) => ({
    root: {
        fontSize: 12,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        padding: "10px 0",
        color: theme.fontColor.info,
    },
    icon: {
        height: 12,
        marginRight: 5,
        paddingTop: 2
    }
}), { name: "exchange-rate" });

type Props = {
    primary: ICurrency,
    secondary: ICurrency
}

interface RatesResponse extends IApiBaseResponse {
    rates?: IRates
}

const ExchangeRate: FunctionComponent<Props> = ({ primary, secondary }) => {
    const classes = useStyles({ theme: useTheme<Theme>() });
    const { currentRate, setCurrentRate } = useContext(ExchangeContext);
    const [rates, setRates] = useState<IRates | undefined>(undefined);

    useEffect(() => {
        const fetchRates = async () => {
            //using base: "USD" parameter because of free API limitations
            const data: RatesResponse = await apiCall<RatesResponse>(Api.getRates, { base: "USD" });
            if(!data.error && data.rates) {
                setRates(data.rates);
            }
        };
        fetchRates();
        const timeout = setInterval(() => {
            fetchRates();
        }, 10000);
        return () => clearInterval(timeout);
    }, []);

    useEffect(() => {
        if(!primary || !secondary) {
            return;
        }
        if(rates && rates[primary.name] && rates[secondary.name]) {
            //current rate is calculated using dollar rate due to free API limitations
            const primaryRateInDollar = 1 / rates[primary.name];
            setCurrentRate(primaryRateInDollar * rates[secondary.name]);
        }
    }, [rates, primary, secondary, setCurrentRate]);

    const loading = !primary || !secondary || !rates || !rates[primary.name] || !rates[secondary.name];

    const currentRateString = useMemo(() => getCurrencyFormatted({ val: currentRate, currency: secondary.name }), [currentRate, secondary]);
    const primaryString = useMemo(() => getCurrencyFormatted({ val: 1, currency: primary.name }), [primary]);

    return <>
        {loading && <Loader />}
        {(!loading && currentRate) &&
            <div className={classes.root}>
                <FontAwesomeIcon className={classes.icon} icon={faChartLine} />
                <div>{`${primaryString} = ${currentRateString}`}</div>
            </div>
        }
    </>
};

export default ExchangeRate;