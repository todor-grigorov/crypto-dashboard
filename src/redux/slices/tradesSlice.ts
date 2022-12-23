import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WebSocketData } from '../../services/BaseWebSocketService';
import { ITradesResponse } from '../../services/TradesService';
import { SocketChanelType } from '../../types/SocketChannelType';

export interface TradeResponse {
    id: number, // Trade ID
    mts: number, //  millisecond time stamp
    amount: number // Amount bought (positive) or sold (negative).
    price: number // Price at which the trade was executed
    isUp: boolean //
}

export interface TradeState {
    id: number, // Trade ID
    time: string, //  millisecond time stamp
    amount: number // Amount bought (positive) or sold (negative).
    price: string // Price at which the trade was executed
}

export interface TradesState {
    chanId: number,
    channel: SocketChanelType,
    trades: Array<TradeState>,
    loading: boolean,
};

const prepareDate = (time: number) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    let seconds = date.getSeconds().toString();

    let timeString = `${hours}:`

    if (minutes < 10) {
        timeString += "0";
    }

    if (Number(seconds) < 10) {
        seconds = `0${seconds}`;
    }

    timeString += `${minutes}:${seconds}`;

    return timeString;
};


const dateCompare = (d1: string, d2: string) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);

    if (date1 > date2) {
        return 1;
    } else if (date1 < date2) {
        return -1;
    } else {
        return 0;
    }
}

const initialState: TradesState = {
    chanId: 0,
    channel: SocketChanelType.TRADES,
    trades: [],
    loading: true,
};


export const tradesSlice = createSlice({
    name: 'trades',
    initialState,
    reducers: {
        addSnapshotTrades: (state, action: PayloadAction<WebSocketData<ITradesResponse>>) => {
            state.trades = action.payload.data.map(trade => ({
                id: trade.ID,
                time: prepareDate(trade.MTS),
                amount: Math.abs(trade.AMOUNT),
                price: trade.PRICE.toFixed(1),
                isUp: trade.AMOUNT > 0 ? true : false,
            }));

            state.trades.sort((a, b) => dateCompare(a.time, b.time));

            return state;
        },

        addTradeData: (state, action: PayloadAction<WebSocketData<ITradesResponse>>) => {
            if (!action.payload.data.length) return;

            const update = action.payload.data[0];
            // const isPushed = state.trades.findIndex(x => x.id === update.ID);
            // if (isPushed > 0) {
            //     state.trades.splice(isPushed, 1);
            // } else {
            //     state.trades.shift();
            // }
            state.trades.pop();
            state.trades.unshift({
                id: update.ID,
                time: prepareDate(update.MTS),
                amount: Math.abs(update.AMOUNT),
                price: update.PRICE.toFixed(1),
                isUp: update.AMOUNT > 0 ? true : false,
            } as TradeState);

            // state.trades.sort((a, b) => dateCompare(a.time, b.time));

            return state;
        },

        setLoading: (state, { payload }) => {
            const newState = { ...state, loading: payload };

            return newState;
        }
    }
});

export const { addTradeData, addSnapshotTrades, setLoading } = tradesSlice.actions;

export default tradesSlice.reducer;