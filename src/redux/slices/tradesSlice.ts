import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
};

const prepareDate = (time: number) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    let timeString = `${hours}:`

    if (minutes < 10) {
        timeString += "0";
    }

    timeString += minutes;

    return timeString;
}


const initialState: TradesState = {
    chanId: 0,
    channel: SocketChanelType.TRADES,
    trades: [],
};


export const tradesSlice = createSlice({
    name: 'trades',
    initialState,
    reducers: {
        subscribeTrades: (state, { payload }) => {
            state.chanId = payload["chanId"];
            state.channel = payload["channel"];
            return state;
        },

        addSnapshotTrades: (state, action: PayloadAction<Array<Array<number>>>) => {
            state.trades = action.payload.map(nums => ({
                id: nums[0],
                time: prepareDate(nums[1]),
                amount: Math.abs(nums[2]),
                price: nums[3].toFixed(1),
                isUp: nums[2] > 0 ? true : false,
            }));

            return state;
        },

        addTradeData: (state, { payload }) => {
            const isPushed = state.trades.findIndex(x => x.id === payload[0]);
            if (isPushed > 0) {
                state.trades.splice(isPushed, 1);
            } else {
                state.trades.shift();
            }
            state.trades.push({
                id: payload[0],
                time: prepareDate(payload[1]),
                amount: Math.abs(payload[2]),
                price: payload[3].toFixed(1),
                isUp: payload[2] > 0 ? true : false,
            } as TradeState);

            return state;
        }
    }
});

export const { subscribeTrades, addTradeData, addSnapshotTrades } = tradesSlice.actions;

export default tradesSlice.reducer;