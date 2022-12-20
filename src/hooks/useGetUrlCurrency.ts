import { useLocation } from "react-router-dom";
import { CoinType } from "../types/CoinType";

export const useGetUrlCurrency = () => {
    const location = useLocation();
    const currency = location.pathname.substring(1).toUpperCase();
    const type = Object.values(CoinType).find((t) => t === currency);

    return type;
};