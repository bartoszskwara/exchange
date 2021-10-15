import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import {CurrencyType} from "../../../types/ICurrency";
import theme from "../../../theme";
import {ThemeProvider} from "react-jss";
import {ExchangeContext} from "../../layout/Layout";
import ExchangeAccountsManager from "../ExchangeAccountsManager";
import {AppContext} from "../../../App";
import {IAccount} from "../../../types/IAccount";

const ratesData = { rates: { EUR: 1, USD: 2.5676232, GBP: 3 } };
jest.mock("../../../api/Api.tsx", () => ({
    Api: { getRates: "getRates" },
    apiCall: () => (ratesData)
}));
const accounts = [{
    currency: {
        name: CurrencyType.EUR,
        description: "Euro",
        symbol: "€"
    },
    balance: 1500.87127
},
{
    currency: {
        name: CurrencyType.USD,
        description: "US Dollar",
        symbol: "$"
    },
    balance: 2300.6756
}, {
    currency: {
        name: CurrencyType.GBP,
        description: "British Pound",
        symbol: "£"
    },
    balance: 800.234
}];

describe("<ExchangeAccountsManager />", () => {
    const renderComponent = (contextAccounts: IAccount[]) =>
        <ThemeProvider theme={theme.light}>
            <AppContext.Provider value={{ accounts: contextAccounts, setAccountBalance: () => {}, toggleAppTheme: () => {} }}>
                <ExchangeContext.Provider value={{ currentRate: 2.5, setCurrentRate: () => {} }}>
                    <ExchangeAccountsManager />
                </ExchangeContext.Provider>
            </AppContext.Provider>
        </ThemeProvider>;

    beforeEach(() => Object.defineProperty(global.navigator, 'language', {value: 'en-US', configurable: true}));

    test("Should display accounts data correctly in ExchangePanel for default locale en-US", async () => {
        render(renderComponent(accounts));
        expect(await screen.findByText("€1 = $2.5")).toBeInTheDocument();
        expect(await screen.findByText("Balance: €1,500.87")).toBeInTheDocument();
        expect(await screen.findByText("Balance: $2,300.68")).toBeInTheDocument();
        expect(await screen.findByRole("button")).toHaveTextContent("Sell EUR for USD");
    });

    test("Should display balance in proper format for other locale", async () => {
        Object.defineProperty(global.navigator, 'language', {value: 'pl-PL', configurable: true});
        render(renderComponent(accounts));
        expect(await screen.findByText("€1 = $2.5")).toBeInTheDocument();
        expect(await screen.findByText("Balance: 1500,87 €")).toBeInTheDocument();
        expect(await screen.findByText("Balance: 2300,68 USD")).toBeInTheDocument();
        expect(await screen.findByRole("button")).toHaveTextContent("Sell EUR for USD");
        expect(await screen.findByTestId("exchange-title")).toHaveTextContent("Sell EUR");
    });

    test("Should calculate value for secondary account when inserting value for primary account", async () => {
        render(renderComponent(accounts));
        fireEvent.change(screen.getByTestId("account-EUR"), {target: {value: '100'}});
        expect((await screen.findByTestId("account-USD") as HTMLInputElement).value).toBe("+250.00");
        expect((await screen.findByTestId("account-EUR") as HTMLInputElement).value).toBe("-100");
    });

    test("Should calculate value for primary account when inserting value for secondary account", async () => {
        render(renderComponent(accounts));
        fireEvent.change(screen.getByTestId("account-USD"), {target: {value: '100'}});
        expect((await screen.findByTestId("account-EUR") as HTMLInputElement).value).toBe("-40.00");
        expect((await screen.findByTestId("account-USD") as HTMLInputElement).value).toBe("+100");
    });

    test("Should change type from Sell to Buy when toggling exchange direction", async () => {
        render(renderComponent(accounts));
        await expect(screen.getByTestId("exchange-title")).toHaveTextContent("Sell EUR")
        await expect(screen.getByRole("button")).toHaveTextContent("Sell EUR for USD")
        fireEvent.change(screen.getByTestId("account-EUR"), {target: {value: '100'}});
        expect((await screen.findByTestId("account-EUR") as HTMLInputElement).value).toBe("-100");
        expect((await screen.findByTestId("account-USD") as HTMLInputElement).value).toBe("+250.00");
        fireEvent.click(await screen.findByTestId("toggle-exchange"));
        expect((await screen.findByTestId("account-EUR") as HTMLInputElement).value).toBe("+100");
        expect((await screen.findByTestId("account-USD") as HTMLInputElement).value).toBe("-250.00");
        expect(await screen.findByTestId("exchange-title")).toHaveTextContent("Buy EUR");
        expect(await screen.findByRole("button")).toHaveTextContent("Buy EUR with USD")
    });

    test("Should open and close account dropdown after clicking account name", async () => {
        render(renderComponent(accounts));
        fireEvent.click(await screen.findByTestId("account-root-EUR"));
        expect(await screen.findByTestId("account-list")).toBeInTheDocument();
        expect(await screen.findByTestId("account-item-EUR")).toBeInTheDocument();
        expect(await screen.findByTestId("account-item-USD")).toBeInTheDocument();
        expect(await screen.findByTestId("account-item-GBP")).toBeInTheDocument();
        expect(await screen.findByTestId("account-item-name-EUR")).toHaveTextContent("EUR • €1,500.87");
        expect(await screen.findByTestId("account-item-name-USD")).toHaveTextContent("USD • $2,300.68");
        expect(await screen.findByTestId("account-item-name-GBP")).toHaveTextContent("GBP • £800.23");
        fireEvent.click(await screen.findByTestId("account-item-GBP"));
        expect(screen.queryByTestId("account-list")).not.toBeInTheDocument();
        expect(await screen.findByTestId("exchange-title")).toHaveTextContent("Sell GBP");
    });

    test("Should update balance after performing an exchange", async () => {
        const {rerender} = render(renderComponent(accounts));
        fireEvent.change(screen.getByTestId("account-EUR"), {target: {value: '100'}});
        expect((await screen.findByTestId("account-USD") as HTMLInputElement).value).toBe("+250.00");
        expect(await screen.findByRole("button")).not.toBeDisabled();
        fireEvent.click(await screen.findByRole("button"));
        rerender(renderComponent([{ ...accounts[0], balance: 1400.87 }, { ...accounts[1], balance: 2550.68 }, { ...accounts[2] }]));
        expect(await screen.findByText("Balance: €1,400.87")).toBeInTheDocument();
        expect(await screen.findByText("Balance: $2,550.68")).toBeInTheDocument();
    });
})