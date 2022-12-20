import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SocketChanelType } from '../../types/SocketChannelType';

function roundToTwo(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

export interface ChartState {
    mts: number,    // millisecond time stamp
    open: number,	// First execution during the time frame
    close: number,	// Last execution during the time frame
    high: number,	// Highest execution during the time frame
    low: number,    // Lowest execution during the timeframe
    volume: number,	// Quantity of symbol traded within the timeframe
}

export interface ChartsState {
    chanId: number,
    channel: SocketChanelType,
    candles: Array<ChartState>,
}

const initialState: ChartsState = {
    chanId: 0,
    channel: SocketChanelType.CANDLES,
    candles: [],
};

export const chartsSlice = createSlice({
    name: 'charts',
    initialState,
    reducers: {
        subscribeCharts: (state, { payload }) => {
            state.chanId = payload["chanId"];
            state.channel = payload["channel"];
            return state;
        },

        addSnapshotCharts: (state, action: PayloadAction<Array<Array<number>>>) => {
            const data = action.payload;
            state.candles = data.map(nums => ({
                mts: roundToTwo(nums[0]),
                open: roundToTwo(nums[1]),
                close: roundToTwo(nums[2]),
                high: roundToTwo(nums[3]),
                low: roundToTwo(nums[4]),
                volume: roundToTwo(nums[5]),
            }));

            return state;
        },

        addChartData: (state, { payload }) => {
            state.candles.shift();
            state.candles.push({
                mts: roundToTwo(payload[0]),
                open: roundToTwo(payload[1]),
                close: roundToTwo(payload[2]),
                high: roundToTwo(payload[3]),
                low: roundToTwo(payload[4]),
                volume: roundToTwo(payload[5]),
            } as ChartState);

            return state;
        }
    }
});

export const { subscribeCharts, addChartData, addSnapshotCharts } = chartsSlice.actions;

export default chartsSlice.reducer;