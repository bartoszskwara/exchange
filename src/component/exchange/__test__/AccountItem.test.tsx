import React from "react";
import { render, screen } from "@testing-library/react";
import AccountItem from "../AccountItem";
import {CurrencyType} from "../../../types/ICurrency";
import {IAccount} from "../../../types/IAccount";
import theme from "../../../theme";
import {ThemeProvider} from "react-jss";

describe("<AccountItem />", () => {
    const renderComponent = (account: IAccount) =>
        <ThemeProvider theme={theme.light}>
            <AccountItem account={account} onClick={() => {}} />
        </ThemeProvider>;

    test("Should display account data correctly", () => {
        const account: IAccount = {
            currency: {
                name: CurrencyType.EUR,
                description: "Euro",
                symbol: "€"
            },
            balance: 1500
        };
        render(renderComponent(account))
        expect(screen.getByText("EUR • €1,500")).toBeInTheDocument();
        expect(screen.getByText("Euro")).toBeInTheDocument();
    });
})