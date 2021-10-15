type Props = {
    val: number | undefined,
    maximumFractionDigits?: number,
    currency?: string,
    locale?: string
}

export const getCurrencyFormatted = ({ val, maximumFractionDigits = 4, currency, locale = "en-US"} : Props): string => {
    if(!val) {
        return "";
    }
    const options = {
        minimumFractionDigits: 0,
        maximumFractionDigits,
        ...(currency ? { currency, style: "currency" } : {})
    };
    return new Intl.NumberFormat(locale, options).format(val);
}