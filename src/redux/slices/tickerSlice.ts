import { createSlice } from '@reduxjs/toolkit';
import { SocketChanelType } from '../../types/SocketChannelType';

export interface TickerDisplayState {
    dailyChange: number,
    volume: number,
    high: number,
    low: number
}

export interface TickerState extends TickerDisplayState {
    chanId: number,
    channel: SocketChanelType,
    bid: number,
    bidSize: number,
    ask: number,
    askSize: number,

    dailyChangeRelative: number,
    lastPrice: number,

}

const initialState: TickerState = {
    chanId: 0,
    channel: SocketChanelType.TICKER,
    bid: 0,
    bidSize: 0,
    ask: 0,
    askSize: 0,
    dailyChange: 0,
    dailyChangeRelative: 0,
    lastPrice: 0,
    volume: 0,
    high: 0,
    low: 0,
};

export const tickerSlice = createSlice({
    name: 'ticker',
    initialState,
    reducers: {
        updateTickerOperationalData: (state, { payload }) => {
            state.bid = payload[0];
            state.bidSize = payload[1];
            state.ask = payload[2];
            state.askSize = payload[3];
            state.dailyChange = payload[4];
            state.dailyChangeRelative = payload[5];
            state.lastPrice = payload[6];
            state.volume = payload[7];
            state.high = payload[8];
            state.low = payload[9];
        }
    }
});

export const { updateTickerOperationalData } = tickerSlice.actions;

export default tickerSlice.reducer;