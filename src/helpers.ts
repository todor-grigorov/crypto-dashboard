import { CoinType } from "./types/CoinType";

export const getUrlCurrency = () => {
    const pathname = window.location.pathname;
    const currency = pathname.substring(1).toUpperCase();
    const type = Object.values(CoinType).find((t) => t === currency);

    return type;
};