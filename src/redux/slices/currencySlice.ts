import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUrlCurrency } from '../../helpers';
import { CoinType } from '../../types/CoinType';


export interface CurrencyState {
    value: CoinType;
}

const initialState: CurrencyState = {
    value: getUrlCurrency() || CoinType.BTC,
}

export const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        setCurrency: (state, action: PayloadAction<CoinType | undefined>) => {
            if (!action.payload) action.payload = CoinType.BTC;
            state.value = action.payload;

            return state;
        }
    }
});

export const { setCurrency } = currencySlice.actions;

export default currencySlice.reducer; 