import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import {CurrencyType, ICurrency} from "../../../types/ICurrency";
import theme from "../../../theme";
import {ThemeProvider} from "react-jss";
import ExchangeRate from "../ExchangeRate";
import {ExchangeContext} from "../../layout/Layout";

const ratesData = { rates: { EUR: 1, USD: 2.5676232, GBP: 3 } };
jest.mock("../../../api/Api.tsx", () => ({
    Api: { getRates: "getRates" },
    apiCall: () => (ratesData)
}));

describe("<ExchangeRate />", () => {
    const renderComponent = (primary: ICurrency, secondary: ICurrency, currentRate: number|undefined) =>
        <ThemeProvider theme={theme.light}>
            <ExchangeContext.Provider value={{ currentRate, setCurrentRate: () => {} }}>
                <ExchangeRate primary={primary} secondary={secondary} />
            </ExchangeContext.Provider>
        </ThemeProvider>;

    test("Should display rate data correctly", async () => {
        const eur: ICurrency = {
            name: CurrencyType.EUR,
            description: "Euro",
            symbol: "€"
        };
        const usd: ICurrency = {
            name: CurrencyType.USD,
            description: "US Dollar",
            symbol: "$"
        };

        const {rerender} = render(renderComponent(eur, usd, undefined));
        rerender(renderComponent(eur, usd, 2.5676232));
        await waitFor(() => expect(screen.getByText("€1 = $2.5676")).toBeInTheDocument());
    });
})